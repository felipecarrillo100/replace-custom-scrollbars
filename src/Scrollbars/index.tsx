import React, {
    forwardRef,
    useImperativeHandle,
    useState,
    useEffect,
    useRef,
    useCallback,
    createElement,
    cloneElement
} from 'react';
import getScrollbarWidth from '../utils/getScrollbarWidth';
import getInnerWidth from '../utils/getInnerWidth';
import getInnerHeight from '../utils/getInnerHeight';
import isString from '../utils/isString';
import {
    containerStyleDefault,
    containerStyleAutoHeight,
    viewStyleDefault,
    viewStyleAutoHeight,
    viewStyleUniversalInitial,
    trackHorizontalStyleDefault,
    trackVerticalStyleDefault,
    thumbHorizontalStyleDefault,
    thumbVerticalStyleDefault,
    disableSelectStyle,
    disableSelectStyleReset
} from './styles';
import {
    renderViewDefault,
    renderTrackHorizontalDefault,
    renderTrackVerticalDefault,
    renderThumbHorizontalDefault,
    renderThumbVerticalDefault
} from './defaultRenderElements';

export interface positionValues {
    left: number;
    top: number;
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
    scrollHeight: number;
    clientWidth: number;
    clientHeight: number;
}

export interface ScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {
    onScroll?: React.UIEventHandler<any>;
    onScrollFrame?: (values: positionValues) => void;
    onScrollStart?: () => void;
    onScrollStop?: () => void;
    onUpdate?: (values: positionValues) => void;

    renderView?: (props: any) => React.ReactElement;
    renderTrackHorizontal?: (props: any) => React.ReactElement;
    renderTrackVertical?: (props: any) => React.ReactElement;
    renderThumbHorizontal?: (props: any) => React.ReactElement;
    renderThumbVertical?: (props: any) => React.ReactElement;

    tagName?: string;
    hideTracksWhenNotNeeded?: boolean;

    autoHide?: boolean;
    autoHideTimeout?: number;
    autoHideDuration?: number;

    thumbSize?: number;
    thumbMinSize?: number;
    universal?: boolean;

    autoHeight?: boolean;
    autoHeightMin?: number | string;
    autoHeightMax?: number | string;

    native?: boolean;
    thumbColor?: string;
    trackColor?: string;

    style?: React.CSSProperties;
    children?: React.ReactNode;
}

export interface ScrollbarsRef {
    scrollTop: (top?: number) => void;
    scrollLeft: (left?: number) => void;
    scrollToTop: () => void;
    scrollToBottom: () => void;
    scrollToLeft: () => void;
    scrollToRight: () => void;
    getScrollLeft: () => number;
    getScrollTop: () => number;
    getScrollWidth: () => number;
    getScrollHeight: () => number;
    getClientWidth: () => number;
    getClientHeight: () => number;
    getWidth: () => number;
    getHeight: () => number;
    getValues: () => positionValues;
}

export const Scrollbars = forwardRef<ScrollbarsRef, ScrollbarProps>((propsInput, ref) => {
    const {
        onScroll,
        onScrollFrame,
        onScrollStart,
        onScrollStop,
        onUpdate,
        renderView = renderViewDefault,
        renderTrackHorizontal = renderTrackHorizontalDefault,
        renderTrackVertical = renderTrackVerticalDefault,
        renderThumbHorizontal = renderThumbHorizontalDefault,
        renderThumbVertical = renderThumbVerticalDefault,
        tagName = 'div',
        thumbSize,
        thumbMinSize = 30,
        hideTracksWhenNotNeeded = false,
        autoHide = false,
        autoHideTimeout = 1000,
        autoHideDuration = 200,
        autoHeight = false,
        autoHeightMin = 0,
        autoHeightMax = 200,
        universal = false,
        native = false,
        thumbColor,
        trackColor,
        style,
        children,
        ...props
    } = propsInput;

    const [didMountUniversal, setDidMountUniversal] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<HTMLDivElement | null>(null);
    const trackHorizontalRef = useRef<HTMLDivElement | null>(null);
    const trackVerticalRef = useRef<HTMLDivElement | null>(null);
    const thumbHorizontalRef = useRef<HTMLDivElement | null>(null);
    const thumbVerticalRef = useRef<HTMLDivElement | null>(null);

    const requestFrameRef = useRef<number | null>(null);
    const hideTracksTimeoutRef = useRef<any>(null);
    const detectScrollingIntervalRef = useRef<any>(null);

    const draggingRef = useRef<boolean>(false);
    const scrollingRef = useRef<boolean>(false);
    const trackMouseOverRef = useRef<boolean>(false);

    const prevPageXRef = useRef<number>(0);
    const prevPageYRef = useRef<number>(0);

    const viewScrollLeftRef = useRef<number>(0);
    const viewScrollTopRef = useRef<number>(0);
    const lastViewScrollLeftRef = useRef<number>(0);
    const lastViewScrollTopRef = useRef<number>(0);

    const getValues = useCallback((): positionValues => {
        const {
            scrollLeft = 0,
            scrollTop = 0,
            scrollWidth = 0,
            scrollHeight = 0,
            clientWidth = 0,
            clientHeight = 0
        } = viewRef.current || {};

        return {
            left: (scrollLeft / (scrollWidth - clientWidth)) || 0,
            top: (scrollTop / (scrollHeight - clientHeight)) || 0,
            scrollLeft,
            scrollTop,
            scrollWidth,
            scrollHeight,
            clientWidth,
            clientHeight
        };
    }, []);

    const getThumbHorizontalWidth = useCallback((): number => {
        if (!viewRef.current || !trackHorizontalRef.current) return 0;
        const { scrollWidth, clientWidth } = viewRef.current;
        const trackWidth = getInnerWidth(trackHorizontalRef.current);
        const width = Math.ceil(clientWidth / scrollWidth * trackWidth);
        if (trackWidth === width) return 0;
        if (thumbSize) return thumbSize;
        return Math.max(width, thumbMinSize);
    }, [thumbSize, thumbMinSize]);

    const getThumbVerticalHeight = useCallback((): number => {
        if (!viewRef.current || !trackVerticalRef.current) return 0;
        const { scrollHeight, clientHeight } = viewRef.current;
        const trackHeight = getInnerHeight(trackVerticalRef.current);
        const height = Math.ceil(clientHeight / scrollHeight * trackHeight);
        if (trackHeight === height) return 0;
        if (thumbSize) return thumbSize;
        return Math.max(height, thumbMinSize);
    }, [thumbSize, thumbMinSize]);

    const getScrollLeftForOffset = useCallback((offset: number): number => {
        if (!viewRef.current || !trackHorizontalRef.current) return 0;
        const { scrollWidth, clientWidth } = viewRef.current;
        const trackWidth = getInnerWidth(trackHorizontalRef.current);
        const thumbWidth = getThumbHorizontalWidth();
        return offset / (trackWidth - thumbWidth) * (scrollWidth - clientWidth);
    }, [getThumbHorizontalWidth]);

    const getScrollTopForOffset = useCallback((offset: number): number => {
        if (!viewRef.current || !trackVerticalRef.current) return 0;
        const { scrollHeight, clientHeight } = viewRef.current;
        const trackHeight = getInnerHeight(trackVerticalRef.current);
        const thumbHeight = getThumbVerticalHeight();
        return offset / (trackHeight - thumbHeight) * (scrollHeight - clientHeight);
    }, [getThumbVerticalHeight]);

    const scrollTopFn = useCallback((top = 0) => {
        if (!viewRef.current) return;
        viewRef.current.scrollTop = top;
    }, []);

    const scrollLeftFn = useCallback((left = 0) => {
        if (!viewRef.current) return;
        viewRef.current.scrollLeft = left;
    }, []);

    const scrollToTop = useCallback(() => {
        if (!viewRef.current) return;
        viewRef.current.scrollTop = 0;
    }, []);

    const scrollToBottom = useCallback(() => {
        if (!viewRef.current) return;
        viewRef.current.scrollTop = viewRef.current.scrollHeight;
    }, []);

    const scrollToLeft = useCallback(() => {
        if (!viewRef.current) return;
        viewRef.current.scrollLeft = 0;
    }, []);

    const scrollToRight = useCallback(() => {
        if (!viewRef.current) return;
        viewRef.current.scrollLeft = viewRef.current.scrollWidth;
    }, []);

    useImperativeHandle(ref, () => ({
        scrollTop: scrollTopFn,
        scrollLeft: scrollLeftFn,
        scrollToTop,
        scrollToBottom,
        scrollToLeft,
        scrollToRight,
        getScrollLeft: () => viewRef.current ? viewRef.current.scrollLeft : 0,
        getScrollTop: () => viewRef.current ? viewRef.current.scrollTop : 0,
        getScrollWidth: () => viewRef.current ? viewRef.current.scrollWidth : 0,
        getScrollHeight: () => viewRef.current ? viewRef.current.scrollHeight : 0,
        getClientWidth: () => viewRef.current ? viewRef.current.clientWidth : 0,
        getClientHeight: () => viewRef.current ? viewRef.current.clientHeight : 0,
        getWidth: () => containerRef.current ? containerRef.current.clientWidth : 0,
        getHeight: () => containerRef.current ? containerRef.current.clientHeight : 0,
        getValues
    }));

    const _update = useCallback((callback?: (values: positionValues) => void) => {
        const values = getValues();
        const scrollbarWidth = getScrollbarWidth();

        if (scrollbarWidth) {
            const { scrollLeft, clientWidth, scrollWidth } = values;
            const trackHorizontalWidth = trackHorizontalRef.current ? getInnerWidth(trackHorizontalRef.current) : 0;
            const thumbHorizontalWidth = getThumbHorizontalWidth();
            const thumbHorizontalX = scrollLeft / (scrollWidth - clientWidth) * (trackHorizontalWidth - thumbHorizontalWidth);

            if (thumbHorizontalRef.current) {
                thumbHorizontalRef.current.style.width = `${thumbHorizontalWidth}px`;
                thumbHorizontalRef.current.style.transform = `translateX(${thumbHorizontalX}px)`;
            }

            const { scrollTop, clientHeight, scrollHeight } = values;
            const trackVerticalHeight = trackVerticalRef.current ? getInnerHeight(trackVerticalRef.current) : 0;
            const thumbVerticalHeight = getThumbVerticalHeight();
            const thumbVerticalY = scrollTop / (scrollHeight - clientHeight) * (trackVerticalHeight - thumbVerticalHeight);

            if (thumbVerticalRef.current) {
                thumbVerticalRef.current.style.height = `${thumbVerticalHeight}px`;
                thumbVerticalRef.current.style.transform = `translateY(${thumbVerticalY}px)`;
            }

            if (hideTracksWhenNotNeeded) {
                if (trackHorizontalRef.current) {
                    trackHorizontalRef.current.style.visibility = scrollWidth > clientWidth ? 'visible' : 'hidden';
                }
                if (trackVerticalRef.current) {
                    trackVerticalRef.current.style.visibility = scrollHeight > clientHeight ? 'visible' : 'hidden';
                }
            }
        }

        if (onUpdate) onUpdate(values);
        if (typeof callback === 'function') {
            callback(values);
        }
    }, [getValues, getThumbHorizontalWidth, getThumbVerticalHeight, hideTracksWhenNotNeeded, onUpdate]);

    const rafHelper = useCallback((callback: () => void) => {
        if (requestFrameRef.current) {
            window.cancelAnimationFrame(requestFrameRef.current);
        }
        requestFrameRef.current = window.requestAnimationFrame(() => {
            requestFrameRef.current = null;
            callback();
        });
    }, []);

    const update = useCallback((callback?: (values: positionValues) => void) => {
        rafHelper(() => _update(callback));
    }, [rafHelper, _update]);

    const showTracks = useCallback(() => {
        if (hideTracksTimeoutRef.current) {
            clearTimeout(hideTracksTimeoutRef.current);
        }
        if (trackHorizontalRef.current) {
            trackHorizontalRef.current.style.opacity = '1';
        }
        if (trackVerticalRef.current) {
            trackVerticalRef.current.style.opacity = '1';
        }
    }, []);

    const hideTracks = useCallback(() => {
        if (draggingRef.current || scrollingRef.current || trackMouseOverRef.current) return;
        if (hideTracksTimeoutRef.current) {
            clearTimeout(hideTracksTimeoutRef.current);
        }
        hideTracksTimeoutRef.current = setTimeout(() => {
            if (trackHorizontalRef.current) {
                trackHorizontalRef.current.style.opacity = '0';
            }
            if (trackVerticalRef.current) {
                trackVerticalRef.current.style.opacity = '0';
            }
        }, autoHideTimeout);
    }, [autoHideTimeout]);

    const handleDrag = useCallback((event: MouseEvent) => {
        if (prevPageXRef.current && trackHorizontalRef.current && viewRef.current) {
            const { clientX } = event;
            const { left: trackLeft } = trackHorizontalRef.current.getBoundingClientRect();
            const thumbWidth = getThumbHorizontalWidth();
            const clickPosition = thumbWidth - prevPageXRef.current;
            const offset = -trackLeft + clientX - clickPosition;
            viewRef.current.scrollLeft = getScrollLeftForOffset(offset);
        }
        if (prevPageYRef.current && trackVerticalRef.current && viewRef.current) {
            const { clientY } = event;
            const { top: trackTop } = trackVerticalRef.current.getBoundingClientRect();
            const thumbHeight = getThumbVerticalHeight();
            const clickPosition = thumbHeight - prevPageYRef.current;
            const offset = -trackTop + clientY - clickPosition;
            viewRef.current.scrollTop = getScrollTopForOffset(offset);
        }
        return false;
    }, [getThumbHorizontalWidth, getThumbVerticalHeight, getScrollLeftForOffset, getScrollTopForOffset]);

    const handleDragEnd = useCallback(() => {
        draggingRef.current = false;
        prevPageXRef.current = prevPageYRef.current = 0;
        
        Object.assign(document.body.style, disableSelectStyleReset);
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleDragEnd);
        (document as any).onselectstart = null;

        if (autoHide) {
            hideTracks();
        }
    }, [handleDrag, autoHide, hideTracks]);

    const handleDragStart = useCallback((event: MouseEvent) => {
        draggingRef.current = true;
        event.stopImmediatePropagation();
        
        Object.assign(document.body.style, disableSelectStyle);
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleDragEnd);
        (document as any).onselectstart = () => false;
    }, [handleDrag, handleDragEnd]);

    const handleTrackMouseEnter = useCallback(() => {
        trackMouseOverRef.current = true;
        if (autoHide) {
            showTracks();
        }
    }, [autoHide, showTracks]);

    const handleTrackMouseLeave = useCallback(() => {
        trackMouseOverRef.current = false;
        if (autoHide) {
            hideTracks();
        }
    }, [autoHide, hideTracks]);

    const handleHorizontalTrackMouseDown = useCallback((event: MouseEvent) => {
        event.preventDefault();
        if (!viewRef.current) return;
        const target = event.currentTarget as HTMLElement;
        const { left: targetLeft } = target.getBoundingClientRect();
        const thumbWidth = getThumbHorizontalWidth();
        const offset = Math.abs(targetLeft - event.clientX) - thumbWidth / 2;
        viewRef.current.scrollLeft = getScrollLeftForOffset(offset);
    }, [getThumbHorizontalWidth, getScrollLeftForOffset]);

    const handleVerticalTrackMouseDown = useCallback((event: MouseEvent) => {
        event.preventDefault();
        if (!viewRef.current) return;
        const target = event.currentTarget as HTMLElement;
        const { top: targetTop } = target.getBoundingClientRect();
        const thumbHeight = getThumbVerticalHeight();
        const offset = Math.abs(targetTop - event.clientY) - thumbHeight / 2;
        viewRef.current.scrollTop = getScrollTopForOffset(offset);
    }, [getThumbVerticalHeight, getScrollTopForOffset]);

    const handleHorizontalThumbMouseDown = useCallback((event: MouseEvent) => {
        event.preventDefault();
        handleDragStart(event);
        const target = event.currentTarget as HTMLElement;
        const { offsetWidth } = target;
        const { left } = target.getBoundingClientRect();
        prevPageXRef.current = offsetWidth - (event.clientX - left);
    }, [handleDragStart]);

    const handleVerticalThumbMouseDown = useCallback((event: MouseEvent) => {
        event.preventDefault();
        handleDragStart(event);
        const target = event.currentTarget as HTMLElement;
        const { offsetHeight } = target;
        const { top } = target.getBoundingClientRect();
        prevPageYRef.current = offsetHeight - (event.clientY - top);
    }, [handleDragStart]);

    const handleScrollStart = useCallback(() => {
        if (onScrollStart) onScrollStart();
        if (autoHide) {
            showTracks();
        }
    }, [onScrollStart, autoHide, showTracks]);

    const handleScrollStop = useCallback(() => {
        if (onScrollStop) onScrollStop();
        if (autoHide) {
            hideTracks();
        }
    }, [onScrollStop, autoHide, hideTracks]);

    const detectScrolling = useCallback(() => {
        if (scrollingRef.current) return;
        scrollingRef.current = true;
        handleScrollStart();
        
        detectScrollingIntervalRef.current = setInterval(() => {
            if (lastViewScrollLeftRef.current === viewScrollLeftRef.current
                && lastViewScrollTopRef.current === viewScrollTopRef.current) {
                clearInterval(detectScrollingIntervalRef.current);
                scrollingRef.current = false;
                handleScrollStop();
            }
            lastViewScrollLeftRef.current = viewScrollLeftRef.current;
            lastViewScrollTopRef.current = viewScrollTopRef.current;
        }, 100);
    }, [handleScrollStart, handleScrollStop]);

    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        if (onScroll) onScroll(event);
        update(values => {
            const { scrollLeft, scrollTop } = values;
            viewScrollLeftRef.current = scrollLeft;
            viewScrollTopRef.current = scrollTop;
            if (onScrollFrame) onScrollFrame(values);
        });
        detectScrolling();
    }, [onScroll, onScrollFrame, update, detectScrolling]);

    const handleWindowResize = useCallback(() => {
        update();
    }, [update]);

    // Equivalent to componentDidUpdate: recalculate thumb sizes if children/layout changed
    useEffect(() => {
        update();
    });

    useEffect(() => {
        if (universal) {
            setDidMountUniversal(true);
        }
    }, [universal]);

    useEffect(() => {
        if (!native && typeof document !== 'undefined') {
            const styleId = 'replace-custom-scrollbars-style';
            if (!document.getElementById(styleId)) {
                const styleEl = document.createElement('style');
                styleEl.id = styleId;
                styleEl.textContent = `
                    .replace-custom-scrollbars-view::-webkit-scrollbar {
                        display: none !important;
                        width: 0 !important;
                        height: 0 !important;
                    }
                `;
                document.head.appendChild(styleEl);
            }
        }
    }, [native]);

    useEffect(() => {
        const view = viewRef.current;
        const trackHorizontal = trackHorizontalRef.current;
        const trackVertical = trackVerticalRef.current;
        const thumbHorizontal = thumbHorizontalRef.current;
        const thumbVertical = thumbVerticalRef.current;

        if (typeof document === 'undefined' || !view) return;

        view.addEventListener('scroll', handleScroll as any);

        const hasScrollbar = !native && getScrollbarWidth() > 0;
        if (hasScrollbar) {
            if (trackHorizontal) {
                trackHorizontal.addEventListener('mouseenter', handleTrackMouseEnter);
                trackHorizontal.addEventListener('mouseleave', handleTrackMouseLeave);
                trackHorizontal.addEventListener('mousedown', handleHorizontalTrackMouseDown as any);
            }
            if (trackVertical) {
                trackVertical.addEventListener('mouseenter', handleTrackMouseEnter);
                trackVertical.addEventListener('mouseleave', handleTrackMouseLeave);
                trackVertical.addEventListener('mousedown', handleVerticalTrackMouseDown as any);
            }
            if (thumbHorizontal) {
                thumbHorizontal.addEventListener('mousedown', handleHorizontalThumbMouseDown as any);
            }
            if (thumbVertical) {
                thumbVertical.addEventListener('mousedown', handleVerticalThumbMouseDown as any);
            }
            window.addEventListener('resize', handleWindowResize);
        }

        update();

        return () => {
            if (view) {
                view.removeEventListener('scroll', handleScroll as any);
            }
            if (hasScrollbar) {
                if (trackHorizontal) {
                    trackHorizontal.removeEventListener('mouseenter', handleTrackMouseEnter);
                    trackHorizontal.removeEventListener('mouseleave', handleTrackMouseLeave);
                    trackHorizontal.removeEventListener('mousedown', handleHorizontalTrackMouseDown as any);
                }
                if (trackVertical) {
                    trackVertical.removeEventListener('mouseenter', handleTrackMouseEnter);
                    trackVertical.removeEventListener('mouseleave', handleTrackMouseLeave);
                    trackVertical.removeEventListener('mousedown', handleVerticalTrackMouseDown as any);
                }
                if (thumbHorizontal) {
                    thumbHorizontal.removeEventListener('mousedown', handleHorizontalThumbMouseDown as any);
                }
                if (thumbVertical) {
                    thumbVertical.removeEventListener('mousedown', handleVerticalThumbMouseDown as any);
                }
                window.removeEventListener('resize', handleWindowResize);
            }

            if (requestFrameRef.current) {
                window.cancelAnimationFrame(requestFrameRef.current);
            }
            if (hideTracksTimeoutRef.current) {
                clearTimeout(hideTracksTimeoutRef.current);
            }
            if (detectScrollingIntervalRef.current) {
                clearInterval(detectScrollingIntervalRef.current);
            }
        };
    }, [
        handleScroll,
        handleTrackMouseEnter,
        handleTrackMouseLeave,
        handleHorizontalTrackMouseDown,
        handleVerticalTrackMouseDown,
        handleHorizontalThumbMouseDown,
        handleVerticalThumbMouseDown,
        handleWindowResize,
        update
    ]);

    const scrollbarWidth = getScrollbarWidth();

    const containerStyle = {
        ...containerStyleDefault,
        ...(autoHeight && {
            ...containerStyleAutoHeight,
            minHeight: autoHeightMin,
            maxHeight: autoHeightMax
        }),
        ...style
    };

    const viewStyle = {
        ...viewStyleDefault,
        ...(native ? {
            marginRight: 0,
            marginBottom: 0,
            overflow: 'auto' as const,
            scrollbarWidth: 'thin' as const,
            ...(thumbColor && trackColor && {
                scrollbarColor: `${thumbColor} ${trackColor}`
            })
        } : {
            marginInlineEnd: scrollbarWidth ? -scrollbarWidth : 0,
            marginBottom: scrollbarWidth ? -scrollbarWidth : 0,
            paddingInlineEnd: scrollbarWidth ? scrollbarWidth : 0,
            paddingBottom: scrollbarWidth ? scrollbarWidth : 0,
            scrollbarWidth: 'none' as const,
            msOverflowStyle: 'none' as const,
        }),
        ...(autoHeight && {
            ...viewStyleAutoHeight,
            minHeight: isString(autoHeightMin)
                ? `calc(${autoHeightMin} + ${scrollbarWidth}px)`
                : (autoHeightMin as number) + scrollbarWidth,
            maxHeight: isString(autoHeightMax)
                ? `calc(${autoHeightMax} + ${scrollbarWidth}px)`
                : (autoHeightMax as number) + scrollbarWidth
        }),
        ...((autoHeight && universal && !didMountUniversal) && {
            minHeight: autoHeightMin,
            maxHeight: autoHeightMax
        }),
        ...((universal && !didMountUniversal) && viewStyleUniversalInitial)
    };

    const trackAutoHeightStyle = {
        transition: `opacity ${autoHideDuration}ms`,
        opacity: 0
    };

    const trackHorizontalStyle = {
        ...trackHorizontalStyleDefault,
        ...(autoHide && trackAutoHeightStyle),
        ...((native || !scrollbarWidth || (universal && !didMountUniversal)) && {
            display: 'none'
        })
    };

    const trackVerticalStyle = {
        ...trackVerticalStyleDefault,
        ...(autoHide && trackAutoHeightStyle),
        ...((native || !scrollbarWidth || (universal && !didMountUniversal)) && {
            display: 'none'
        })
    };

    return createElement(
        tagName,
        {
            ...props,
            style: containerStyle,
            ref: containerRef
        },
        [
            cloneElement(
                renderView({
                    style: viewStyle,
                    className: native ? undefined : 'replace-custom-scrollbars-view'
                }),
                { key: 'view', ref: viewRef },
                children
            ),
            cloneElement(
                renderTrackHorizontal({ style: trackHorizontalStyle }),
                { key: 'trackHorizontal', ref: trackHorizontalRef },
                cloneElement(
                    renderThumbHorizontal({ style: thumbHorizontalStyleDefault }),
                    { ref: thumbHorizontalRef }
                )
            ),
            cloneElement(
                renderTrackVertical({ style: trackVerticalStyle }),
                { key: 'trackVertical', ref: trackVerticalRef },
                cloneElement(
                    renderThumbVertical({ style: thumbVerticalStyleDefault }),
                    { ref: thumbVerticalRef }
                )
            )
        ]
    );
});

Scrollbars.displayName = 'Scrollbars';

export default Scrollbars;
