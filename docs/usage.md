# Usage

## Default Scrollbars

The `<Scrollbars>` component works out of the box with some default styles. The only thing you need to care about is that the component has a `width` and `height`:

```tsx
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const App: React.FC = () => {
    return (
        <Scrollbars style={{ width: 500, height: 300 }}>
            <p>Some great content...</p>
        </Scrollbars>
    );
};
```

Also don't forget to set the `viewport` meta tag if you want to **support mobile devices**:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
```

## Events

There are several events you can listen to:

```tsx
import React, { useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const App: React.FC = () => {
    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        console.log('Scroll event:', event);
    }, []);

    const handleScrollFrame = useCallback((values: any) => {
        console.log('Scroll frame values:', values);
    }, []);

    const handleScrollStart = useCallback(() => {
        console.log('Scroll started');
    }, []);

    const handleScrollStop = useCallback(() => {
        console.log('Scroll stopped');
    }, []);

    const handleUpdate = useCallback((values: any) => {
        console.log('Update values:', values);
    }, []);

    return (
        <Scrollbars
            onScroll={handleScroll}
            onScrollFrame={handleScrollFrame}
            onScrollStart={handleScrollStart}
            onScrollStop={handleScrollStop}
            onUpdate={handleUpdate}
            style={{ width: 500, height: 300 }}
        >
            <p>Some great content...</p>
        </Scrollbars>
    );
};
```

## Auto-hide

You can activate auto-hide by setting the `autoHide` property.

```tsx
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const App: React.FC = () => {
    return (
        <Scrollbars
            // This will activate auto hide
            autoHide
            // Hide delay in ms
            autoHideTimeout={1000}
            // Duration for hide animation in ms.
            autoHideDuration={200}
            style={{ width: 500, height: 300 }}
        >
            <p>Some great content...</p>
        </Scrollbars>
    );
};
```

## Auto-height

You can activate auto-height by setting the `autoHeight` property.

```tsx
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const App: React.FC = () => {
    return (
        <Scrollbars
            // This will activate auto-height
            autoHeight
            autoHeightMin={100}
            autoHeightMax={200}
            style={{ width: 500 }}
        >
            <p>Some great content...</p>
        </Scrollbars>
    );
};
```

## Universal rendering

If your app runs on both client and server, activate the `universal` mode. This will ensure that the initial markup on client and server are the same:

```tsx
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const App: React.FC = () => {
    return (
        <Scrollbars universal style={{ width: 500, height: 300 }}>
            <p>Some great content...</p>
        </Scrollbars>
    );
};
```
