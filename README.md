replace-custom-scrollbars
=========================

[![npm](https://img.shields.io/badge/npm-replace--custom--scrollbars-brightgreen.svg?style=flat-square)]()
[![npm version](https://img.shields.io/npm/v/replace-custom-scrollbars.svg?style=flat-square)](https://www.npmjs.com/package/replace-custom-scrollbars)
[![npm downloads](https://img.shields.io/npm/dm/replace-custom-scrollbars.svg?style=flat-square)](https://www.npmjs.com/package/replace-custom-scrollbars)

A fully modernized, high-performance, typesafe React custom scrollbars component. Ready for **React 18 & 19** (including Strict Mode, Concurrent Features, and React Compiler support).

👉 **[View the Live Demo & Theme Explorer](https://felipecarrillo100.github.io/replace-custom-scrollbars/)**


### 🚀 Key Improvements & Modernizations

1. **React 18 & 19 Ready**: Built with full concurrency awareness. Functions seamlessly with Strict Mode, standard element cloning, and modern React 19 forwardRef patterns.
2. **Infinite Zoom Protection (New)**: Completely resolves layout gaps under browser zoom levels of 75% or lower. Combines precise negative margin offset calculations with standard, robust CSS hiding elements (`scrollbar-width: none` and Webkit pseudo-element selectors) to ensure native scrollbars are 100% transparent and hidden under any browser scaling factor.
3. **Opt-in Native Styling Mode (New)**: Render lightweight, GPU-accelerated standard native browser scrollbars using the `native={true}` option. Style standard scrollbars easily with `thumbColor` and `trackColor` properties.
4. **Vite 8 & tsup Build Engine**: Bundled utilizing modern, fast tsup compilers producing optimized dual ESM and CJS formats alongside typesafe declaration maps (`.d.ts` and `.d.mts`).
5. **Modernized Test Suite**: Replaced legacy Karma/Webpack tests with a fast, reliable test suite powered by **Vitest** and **React Testing Library**.
6. **Zero Legacy Bloat**: Cleaned up all obsolete configuration files (such as `karma.conf.js`, `prepublish.js`, `tests.js`, `.nvmrc`, `.travis.yml`, and unused Bootstrap classes) for a lightweight, modern codebase.

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

## Examples and Playground

To explore custom styling themes, spring physics, and interactively tune scrollbar parameters:

### Running the Live Playground App
```bash
# Serves the sandbox playground at http://localhost:8000
npm run demo
```

### Compiling the Library
To compile production bundle assets:
```bash
# Rebuilds CJS/ESM outputs and .d.ts files inside /dist
npm run build
```


## Tests

Execute typesafe unit testing suite:
```bash
# Run unit tests via Vitest
npm run test
```

## License

MIT
