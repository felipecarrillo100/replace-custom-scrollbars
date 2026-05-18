import { createRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Scrollbars, ScrollbarsRef } from '../../src';

describe('Scrollbars Component Modern Tests', () => {
    it('should render children and apply default style', () => {
        const { container } = render(
            <Scrollbars style={{ width: 300, height: 300 }}>
                <div data-testid="child">Test content</div>
            </Scrollbars>
        );
        expect(screen.getByTestId('child')).toBeDefined();
        const mainDiv = container.firstChild as HTMLDivElement;
        expect(mainDiv.style.position).toBe('relative');
        expect(mainDiv.style.width).toBe('300px');
        expect(mainDiv.style.height).toBe('300px');
    });

    it('should expose imperative ref methods correctly', () => {
        const ref = createRef<ScrollbarsRef>();
        render(
            <Scrollbars ref={ref} style={{ width: 300, height: 300 }}>
                <div style={{ height: 1000 }}>Long Content</div>
            </Scrollbars>
        );

        expect(ref.current).toBeDefined();
        expect(ref.current?.scrollTop).toBeTypeOf('function');
        expect(ref.current?.scrollLeft).toBeTypeOf('function');
        expect(ref.current?.getValues).toBeTypeOf('function');

        const values = ref.current?.getValues();
        expect(values).toBeDefined();
        expect(values?.scrollTop).toBe(0);
    });

    it('should call onScroll when view scrolls', () => {
        const onScroll = vi.fn();
        const { container } = render(
            <Scrollbars onScroll={onScroll}>
                <div style={{ height: 1000 }}>Long Content</div>
            </Scrollbars>
        );

        const view = container.firstChild?.firstChild as HTMLDivElement;
        expect(view).toBeDefined();

        fireEvent.scroll(view, { target: { scrollTop: 100 } });
        expect(onScroll).toHaveBeenCalled();
     });

    it('should apply native style properties and hide custom tracks when native={true}', () => {
        const { container } = render(
            <Scrollbars native={true} thumbColor="red" trackColor="blue">
                <div style={{ height: 1000 }}>Long Content</div>
            </Scrollbars>
        );

        const view = container.firstChild?.firstChild as HTMLDivElement;
        expect(view).toBeDefined();
        expect(view.style.scrollbarWidth).toBe('thin');
        expect(view.style.scrollbarColor).toBe('red blue');
        expect(view.style.marginRight).toBe('0px');
        expect(view.style.marginBottom).toBe('0px');

        const trackHorizontal = container.firstChild?.childNodes[1] as HTMLDivElement;
        const trackVertical = container.firstChild?.childNodes[2] as HTMLDivElement;
        expect(trackHorizontal.style.display).toBe('none');
        expect(trackVertical.style.display).toBe('none');
    });
});

