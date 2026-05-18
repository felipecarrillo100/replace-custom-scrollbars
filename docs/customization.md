# Customization

The `<Scrollbars>` component consists of the following elements:

* `view` The element your content is rendered in
* `trackHorizontal` The horizontal scrollbars track
* `trackVertical` The vertical scrollbars track
* `thumbHorizontal` The horizontal thumb
* `thumbVertical` The vertical thumb

Each element can be **rendered individually** with a function that you pass to the component. Say you want to use your own `className` for each element:

```tsx
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface CustomScrollbarsProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const CustomScrollbars: React.FC<CustomScrollbarsProps> = ({ children, style }) => {
    return (
        <Scrollbars
            renderTrackHorizontal={props => <div {...props} className="track-horizontal"/>}
            renderTrackVertical={props => <div {...props} className="track-vertical"/>}
            renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
            renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
            renderView={props => <div {...props} className="view"/>}
            style={style}
        >
            {children}
        </Scrollbars>
    );
};

const App: React.FC = () => {
    return (
        <CustomScrollbars style={{ width: 500, height: 300 }}>
            <p>Some great content...</p>
        </CustomScrollbars>
    );
};
```

**Important**: **You will always need to pass through the given props** for the respective element like in the example above: `<div {...props} className="track-horizontal"/>`.
This is because we need to pass some default `styles` down to the element in order to make the component work.

If you are working with **inline styles**, you could do something like this:

```tsx
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface CustomScrollbarsProps {
    children: React.ReactNode;
}

const CustomScrollbars: React.FC<CustomScrollbarsProps> = ({ children }) => {
    return (
        <Scrollbars
            renderTrackHorizontal={({ style, ...props }) =>
                <div {...props} style={{ ...style, backgroundColor: 'blue' }}/>
            }
        >
            {children}
        </Scrollbars>
    );
};
```

## Respond to scroll events

If you want to change the appearance in response to the scrolling position, you can achieve that like this:

```tsx
import React, { useState, useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface CustomScrollbarsProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const CustomScrollbars: React.FC<CustomScrollbarsProps> = ({ children, style }) => {
    const [top, setTop] = useState(0);

    const handleScrollFrame = useCallback((values: any) => {
        const { top } = values;
        setTop(top);
    }, []);

    const renderView = useCallback(({ style: viewStyle, ...props }: any) => {
        const color = top * 255;
        const customStyle = {
            backgroundColor: `rgb(${color}, ${color}, ${color})`
        };
        return (
            <div {...props} style={{ ...viewStyle, ...customStyle }}/>
        );
    }, [top]);

    return (
        <Scrollbars
            renderView={renderView}
            onScrollFrame={handleScrollFrame}
            style={style}
        >
            {children}
        </Scrollbars>
    );
};
```

Check out these examples in the repository for some inspiration:
* [ColoredScrollbars](https://github.com/felipecarrillo100/replace-custom-scrollbars/tree/master/examples/simple/components/ColoredScrollbars)
* [ShadowScrollbars](https://github.com/felipecarrillo100/replace-custom-scrollbars/tree/master/examples/simple/components/ShadowScrollbars)
