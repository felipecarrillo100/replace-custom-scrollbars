replace-custom-scrollbars
=========================

[![npm](https://img.shields.io/badge/npm-replace--custom--scrollbars-brightgreen.svg?style=flat-square)]()
[![npm version](https://img.shields.io/npm/v/replace-custom-scrollbars.svg?style=flat-square)](https://www.npmjs.com/package/replace-custom-scrollbars)
[![npm downloads](https://img.shields.io/npm/dm/replace-custom-scrollbars.svg?style=flat-square)](https://www.npmjs.com/package/replace-custom-scrollbars)

A fully modernized, high-performance, typesafe React custom scrollbars component. Ready for **React 18 & 19** (including Strict Mode and React Compiler support).

* frictionless native browser scrolling
* native scrollbars for mobile devices
* [fully customizable](https://github.com/felipecarrillo100/replace-custom-scrollbars/blob/master/docs/customization.md)
* [auto hide](https://github.com/felipecarrillo100/replace-custom-scrollbars/blob/master/docs/usage.md#auto-hide)
* [auto height](https://github.com/felipecarrillo100/replace-custom-scrollbars/blob/master/docs/usage.md#auto-height)
* [universal rendering](https://github.com/felipecarrillo100/replace-custom-scrollbars/blob/master/docs/usage.md#universal-rendering) (runs on client & server)
* `requestAnimationFrame` for 60fps
* no extra stylesheets
* built-in TypeScript definitions
* powered by Vite 8 and tsup

[Documentation](https://github.com/felipecarrillo100/replace-custom-scrollbars/tree/master/docs)

## Installation
```bash
npm install replace-custom-scrollbars --save
```

## Usage

This is the minimal configuration. [Check out the Documentation for advanced usage](https://github.com/felipecarrillo100/replace-custom-scrollbars/tree/master/docs).

```tsx
import React from 'react';
import { Scrollbars } from 'replace-custom-scrollbars';

const App: React.FC = () => {
    return (
        <Scrollbars style={{ width: 500, height: 300 }}>
            <p>Some great content...</p>
        </Scrollbars>
    );
};
```

The `<Scrollbars>` component is completely customizable. Check out the following configuration:

```tsx
import React, { useRef, useCallback } from 'react';
import { Scrollbars, ScrollbarsRef } from 'replace-custom-scrollbars';

const CustomScrollbars: React.FC = () => {
    const scrollbarsRef = useRef<ScrollbarsRef>(null);

    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        // Handle scroll event...
    }, []);

    return (
        <Scrollbars
            ref={scrollbarsRef}
            onScroll={handleScroll}
            renderView={props => <div {...props} className="custom-view" />}
            renderTrackHorizontal={props => <div {...props} className="track-horizontal" />}
            renderTrackVertical={props => <div {...props} className="track-vertical" />}
            renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" />}
            renderThumbVertical={props => <div {...props} className="thumb-vertical" />}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            autoHeight
            autoHeightMin={0}
            autoHeightMax={200}
            thumbMinSize={30}
            universal={true}
            style={{ width: 500, height: 300 }}
        >
            <p>Some great content...</p>
        </Scrollbars>
    );
};
```

All properties are documented in the [API docs](https://github.com/felipecarrillo100/replace-custom-scrollbars/blob/master/docs/API.md).

## Examples

Run the simple example dev server:
```bash
# Install root package dependencies
npm install
# Boot up Vite development environment
npm run dev
```

## Tests

Execute typesafe unit testing suite:
```bash
# Run unit tests via Vitest
npm run test
```

## License

MIT
