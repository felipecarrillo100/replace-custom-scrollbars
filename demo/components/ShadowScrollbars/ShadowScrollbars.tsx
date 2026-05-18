import React, { Component, createRef } from 'react';
import { Scrollbars, positionValues, ScrollbarsRef } from 'react-custom-scrollbars';

interface ShadowScrollbarsState {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
}

class ShadowScrollbars extends Component<any, ShadowScrollbarsState> {
    private scrollbarsRef = createRef<ScrollbarsRef>();
    private shadowTopRef = createRef<HTMLDivElement>();
    private shadowBottomRef = createRef<HTMLDivElement>();

    constructor(props: any) {
        super(props);
        this.state = {
            scrollTop: 0,
            scrollHeight: 0,
            clientHeight: 0
        };
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleUpdate(values: positionValues) {
        const shadowTop = this.shadowTopRef.current;
        const shadowBottom = this.shadowBottomRef.current;
        const { scrollTop, scrollHeight, clientHeight } = values;
        const shadowTopOpacity = 1 / 20 * Math.min(scrollTop, 20);
        const bottomScrollTop = scrollHeight - clientHeight;
        const shadowBottomOpacity = 1 / 20 * (bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20));
        
        if (shadowTop) {
            shadowTop.style.opacity = String(shadowTopOpacity);
        }
        if (shadowBottom) {
            shadowBottom.style.opacity = String(shadowBottomOpacity);
        }
    }

    render() {
        const { style, ...props } = this.props;
        const containerStyle: React.CSSProperties = {
            ...style,
            position: 'relative'
        };
        const shadowTopStyle: React.CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)'
        };
        const shadowBottomStyle: React.CSSProperties = {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 10,
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)'
        };
        return (
            <div style={containerStyle}>
                <Scrollbars
                    ref={this.scrollbarsRef}
                    onUpdate={this.handleUpdate}
                    {...props}/>
                <div
                    ref={this.shadowTopRef}
                    style={shadowTopStyle}/>
                <div
                    ref={this.shadowBottomRef}
                    style={shadowBottomStyle}/>
            </div>
        );
    }
}

export default ShadowScrollbars;
