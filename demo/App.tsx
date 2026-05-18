import React, { useState, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import ColoredScrollbars from './components/ColoredScrollbars/ColoredScrollbars';
import SpringScrollbars from './components/SpringScrollbars/SpringScrollbars';
import ShadowScrollbars from './components/ShadowScrollbars/ShadowScrollbars';

type TabId = 'default' | 'colored' | 'spring' | 'shadow' | 'native';

export default function App() {
    const [activeTab, setActiveTab] = useState<TabId>('default');
    
    // Playground configurations
    const [containerHeight, setContainerHeight] = useState<number>(300);
    const [autoHide, setAutoHide] = useState<boolean>(false);
    const [autoHideTimeout, setAutoHideTimeout] = useState<number>(1000);
    const [autoHideDuration, setAutoHideDuration] = useState<number>(200);
    const [thumbMinSize, setThumbMinSize] = useState<number>(30);
    const [nativeMode, setNativeMode] = useState<boolean>(false);
    const [thumbColor, setThumbColor] = useState<string>('#6366f1');
    const [trackColor, setTrackColor] = useState<string>('#1e1b4b');
    
    // Code snippet visibility
    const [showCode, setShowCode] = useState<boolean>(true);
    
    // Refs for action buttons
    const springScrollbarsRef = useRef<SpringScrollbars>(null);

    const handleRandomScroll = () => {
        if (springScrollbarsRef.current) {
            const scrollHeight = springScrollbarsRef.current.getScrollHeight();
            const target = Math.floor(Math.random() * scrollHeight);
            springScrollbarsRef.current.scrollTop(target);
        }
    };

    // Helper to generate dynamic props code
    const getDynamicPropsString = () => {
        let propsList = [];
        
        if (activeTab === 'native') {
            propsList.push('native={true}');
            propsList.push(`thumbColor="${thumbColor}"`);
            propsList.push(`trackColor="${trackColor}"`);
        } else {
            if (autoHide) {
                propsList.push('autoHide');
                if (autoHideTimeout !== 1000) propsList.push(`autoHideTimeout={${autoHideTimeout}}`);
                if (autoHideDuration !== 200) propsList.push(`autoHideDuration={${autoHideDuration}}`);
            }
            if (thumbMinSize !== 30) {
                propsList.push(`thumbMinSize={${thumbMinSize}}`);
            }
        }
        
        propsList.push(`style={{ height: ${containerHeight} }}`);
        return propsList.join('\n    ');
    };

    const getCodeSnippet = () => {
        const dynamicProps = getDynamicPropsString();
        switch (activeTab) {
            case 'default':
                return `import { Scrollbars } from 'replace-custom-scrollbars';\n\n<Scrollbars\n    ${dynamicProps}\n>\n    <p>Scrollable content goes here...</p>\n</Scrollbars>`;
            case 'colored':
                return `// ColoredScrollbars.tsx\nimport React, { Component } from 'react';\nimport { Scrollbars } from 'replace-custom-scrollbars';\n\nexport default class ColoredScrollbars extends Component {\n    // Handles state shifting background/thumb rgb values based on scrollTop\n    // See full implementation below\n}\n\n// Usage:\nimport ColoredScrollbars from './ColoredScrollbars';\n\n<ColoredScrollbars\n    ${dynamicProps}\n>\n    <p>Beautiful gradient content shifts color on scroll!</p>\n</ColoredScrollbars>`;
            case 'spring':
                return `import React, { useRef } from 'react';\nimport SpringScrollbars from './SpringScrollbars'; // Powered by rebound-js\n\nconst App = () => {\n    const scrollRef = useRef(null);\n\n    const scrollRandom = () => {\n        const scrollHeight = scrollRef.current.getScrollHeight();\n        scrollRef.current.scrollTop(Math.floor(Math.random() * scrollHeight));\n    };\n\n    return (\n        <>\n            <SpringScrollbars ref={scrollRef} ${dynamicProps}>\n                <p>Silky-smooth elastic spring scrollable content...</p>\n            </SpringScrollbars>\n            <button onClick={scrollRandom}>Random Position</button>\n        </>\n    );\n};`;
            case 'shadow':
                return `// ShadowScrollbars.tsx\n// Features linear-gradient overlays on top/bottom that dynamically fade\n// based on scroll proximity to indicate unread content.\n\nimport ShadowScrollbars from './ShadowScrollbars';\n\n<ShadowScrollbars\n    ${dynamicProps}\n>\n    <p>Scroll content to watch shadow indicators fade in and out...</p>\n</ShadowScrollbars>`;
            case 'native':
                return `import { Scrollbars } from 'replace-custom-scrollbars';\n\n{/* Opt-in standard OS native scrollbars easily styled with thumb/track properties */}\n<Scrollbars\n    ${dynamicProps}\n>\n    <p>GPU-accelerated native styled scrollbar container...</p>\n</Scrollbars>`;
            default:
                return '';
        }
    };

    const paragraphs = [
        "Welcome to the interactive showcase of replace-custom-scrollbars. This library is a completely modernized, highly optimized, and typesafe React scrollbars solution. Designed to be a drop-in replacement for the popular but abandoned react-custom-scrollbars library, it is fully prepared for React 18 & 19 (including the React Compiler and Strict Mode).",
        "Infinite Zoom Protection: Unlike standard custom scrollbar widgets which fail under browser scaling options below 100%, this package utilizes a robust hybrid rendering system. By combining high-precision runtime offset calculations with native CSS properties (like scrollbar-width: none and Webkit layout pseudo-classes), native scrollbars remain perfectly invisible and custom tracks stay flawless across all zoom levels.",
        "Opt-in Native Styling Mode: By simply toggling the native property, you can instruct the library to utilize standard browser scrollbars. They remain hardware-accelerated, consume zero runtime JS overhead, and can be customized in modern environments using the thumbColor and trackColor properties. This provides a highly clean look without standard layout components.",
        "Facebook Rebound Physics: You can leverage smooth-scrolling spring setups for fluid scroll transitions. By binding to the Rebound engine, custom event handlers map mapValueInRange math onto scroll offsets in requestAnimationFrame pipelines to deliver buttery 60fps reactions.",
        "Zero Legacy Bloat: Every line of outdated configuration has been pruned. Outmoded Webpack and Karma runners have been replaced by Vitest and Vite 8 engines. Double ESM/CJS packages are distributed with fully qualified types maps.",
        "Try scrolling this pane vertically. Notice how the scroll indicators respond instantly, offering lag-free feedback. In standard browser environments, they match the precision of native scroll trackers without heavy event throttling or layout shifting.",
        "You can customize these parameters directly using the controller console on the left. Toggle the autoHide flag to watch the scrollbars fade out when inactive. Shift the height slider to scale the viewport and check layout compliance.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae hendrerit eros. Duis eget elementum sem. Suspendisse potenti. Nam et sapien id nunc efficitur pretium.",
        "Quisque sit amet vulputate ante, et hendrerit elit. Ut mollis, leo vitae pretium egestas, ex urna sollicitudin nisl, sed finibus libero magna sed leo. Suspendisse congue felis sed neque tristique sollicitudin. Maecenas ac lorem convallis, elementum tortor non, accumsan libero.",
        "Vestibulum id imperdiet metus. Proin porta, nibh sed efficitur hendrerit, ex libero tincidunt ex, sed egestas augue elit ut felis. Sed finibus nisl lorem, eget lobortis libero euismod in. Quisque non dolor feugiat, facilisis sapien eget, porta lectus.",
        "Morbi scelerisque turpis quis augue pulvinar convallis. In tempus augue et ex lobortis sollicitudin. Curabitur elementum justo sit amet dui mollis finibus. Vivamus id justo erat. Sed pellentesque at metus nec vestibulum. Proin at sem arcu.",
        "Ut feugiat, dolor ac convallis mattis, sapien neque varius ipsum, id sollicitudin lorem est sed ante. Nunc sit amet scelerisque velit. Integer feugiat eros non nunc interdum tempus. Sed condimentum risus at elit pellentesque commodo.",
        "Donec ac magna congue, egestas felis sed, rutrum lectus. Pellentesque elementum nulla in accumsan interdum. Ut sollicitudin, ligula sit amet aliquam facilisis, libero dui porta ante, ac pellentesque leo magna vitae felis."
    ];

    const renderScrollbarDemo = () => {
        const commonStyle = { height: containerHeight, width: '100%' };
        
        switch (activeTab) {
            case 'default':
                return (
                    <Scrollbars
                        style={commonStyle}
                        autoHide={autoHide}
                        autoHideTimeout={autoHideTimeout}
                        autoHideDuration={autoHideDuration}
                        thumbMinSize={thumbMinSize}
                    >
                        <div className="demo-content-inner">
                            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                    </Scrollbars>
                );
            case 'colored':
                return (
                    <ColoredScrollbars
                        style={commonStyle}
                        autoHide={autoHide}
                        autoHideTimeout={autoHideTimeout}
                        autoHideDuration={autoHideDuration}
                        thumbMinSize={thumbMinSize}
                    >
                        <div className="demo-content-inner">
                            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                    </ColoredScrollbars>
                );
            case 'spring':
                return (
                    <SpringScrollbars
                        ref={springScrollbarsRef}
                        style={commonStyle}
                        autoHide={autoHide}
                        autoHideTimeout={autoHideTimeout}
                        autoHideDuration={autoHideDuration}
                        thumbMinSize={thumbMinSize}
                    >
                        <div className="demo-content-inner">
                            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                    </SpringScrollbars>
                );
            case 'shadow':
                return (
                    <ShadowScrollbars
                        style={commonStyle}
                        autoHide={autoHide}
                        autoHideTimeout={autoHideTimeout}
                        autoHideDuration={autoHideDuration}
                        thumbMinSize={thumbMinSize}
                    >
                        <div className="demo-content-inner">
                            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                    </ShadowScrollbars>
                );
            case 'native':
                return (
                    <Scrollbars
                        style={commonStyle}
                        native={true}
                        thumbColor={thumbColor}
                        trackColor={trackColor}
                    >
                        <div className="demo-content-inner">
                            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                    </Scrollbars>
                );
            default:
                return null;
        }
    };

    return (
        <div className="app-container">
            {/* Header section */}
            <header className="app-header">
                <div className="header-meta">
                    <span className="meta-tag tag-primary">v2.0.0</span>
                    <span className="meta-separator">•</span>
                    <span className="meta-tag tag-success">React 18 & 19 Ready</span>
                    <span className="meta-separator">•</span>
                    <span className="meta-tag tag-warning">TypeScript Native</span>
                    <span className="meta-separator">•</span>
                    <span className="meta-tag tag-danger">Infinite Zoom Protection</span>
                </div>
                
                <div className="header-title-container">
                    <h1>replace-custom-scrollbars</h1>
                    <a href="https://github.com/felipecarrillo100/replace-custom-scrollbars" target="_blank" rel="noopener noreferrer" className="github-link" title="View on GitHub">
                        <i className="fa-brands fa-github"></i>
                    </a>
                </div>
                
                <p className="app-subtitle">
                    A fully modernized, high-performance, typesafe React custom scrollbars component. Ready for Concurrent Mode and designed as a clean, backward-compatible drop-in replacement.
                </p>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                    <button 
                        className={`tab-btn ${activeTab === 'default' ? 'active' : ''}`}
                        onClick={() => setActiveTab('default')}
                    >
                        <i className="fa-solid fa-scroll"></i> Default Style
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'colored' ? 'active' : ''}`}
                        onClick={() => setActiveTab('colored')}
                    >
                        <i className="fa-solid fa-palette"></i> Custom style
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'spring' ? 'active' : ''}`}
                        onClick={() => setActiveTab('spring')}
                    >
                        <i className="fa-solid fa-bounce"></i> Spring scroll
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'shadow' ? 'active' : ''}`}
                        onClick={() => setActiveTab('shadow')}
                    >
                        <i className="fa-solid fa-circle-nodes"></i> Shadow scrollbars
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'native' ? 'active' : ''}`}
                        onClick={() => setActiveTab('native')}
                    >
                        <i className="fa-solid fa-window-maximize"></i> Native style
                    </button>
                </div>
            </header>

            {/* Main Console Grid */}
            <main className="app-workspace">
                
                {/* Left Panel: Settings / Controls */}
                <section className="control-panel panel-card">
                    <h3 className="panel-title">
                        <i className="fa-solid fa-sliders"></i> Scrollbar Parameters
                    </h3>
                    
                    {activeTab !== 'native' ? (
                        <>
                            {/* Height slider */}
                            <div className="control-group">
                                <label className="control-label">
                                    <span>Viewport Height</span>
                                    <span className="value-badge">{containerHeight}px</span>
                                </label>
                                <input 
                                    type="range" 
                                    min="150" 
                                    max="500" 
                                    step="10" 
                                    value={containerHeight}
                                    onChange={(e) => setContainerHeight(Number(e.target.value))}
                                    className="styled-slider"
                                />
                            </div>

                            {/* AutoHide Toggle */}
                            <div className="control-group toggle-group">
                                <label className="control-label toggle-label" htmlFor="autohide-toggle">
                                    <span>Auto-Hide Scrollbars</span>
                                    <span className="label-description">Fade scrollbars out when mouse is inactive</span>
                                </label>
                                <div className="toggle-switch">
                                    <input 
                                        type="checkbox" 
                                        id="autohide-toggle"
                                        checked={autoHide}
                                        onChange={(e) => setAutoHide(e.target.checked)}
                                    />
                                    <label htmlFor="autohide-toggle"></label>
                                </div>
                            </div>

                            {autoHide && (
                                <>
                                    {/* AutoHide Timeout */}
                                    <div className="control-group animate-fade-in">
                                        <label className="control-label">
                                            <span>Hide Delay</span>
                                            <span className="value-badge">{autoHideTimeout}ms</span>
                                        </label>
                                        <input 
                                            type="range" 
                                            min="200" 
                                            max="3000" 
                                            step="100" 
                                            value={autoHideTimeout}
                                            onChange={(e) => setAutoHideTimeout(Number(e.target.value))}
                                            className="styled-slider"
                                        />
                                    </div>

                                    {/* AutoHide Duration */}
                                    <div className="control-group animate-fade-in">
                                        <label className="control-label">
                                            <span>Fade Duration</span>
                                            <span className="value-badge">{autoHideDuration}ms</span>
                                        </label>
                                        <input 
                                            type="range" 
                                            min="50" 
                                            max="1000" 
                                            step="50" 
                                            value={autoHideDuration}
                                            onChange={(e) => setAutoHideDuration(Number(e.target.value))}
                                            className="styled-slider"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Thumb Min Size */}
                            <div className="control-group">
                                <label className="control-label">
                                    <span>Min Thumb Size</span>
                                    <span className="value-badge">{thumbMinSize}px</span>
                                </label>
                                <input 
                                    type="range" 
                                    min="10" 
                                    max="150" 
                                    step="5" 
                                    value={thumbMinSize}
                                    onChange={(e) => setThumbMinSize(Number(e.target.value))}
                                    className="styled-slider"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Native configurations */}
                            <div className="control-group">
                                <label className="control-label">
                                    <span>Viewport Height</span>
                                    <span className="value-badge">{containerHeight}px</span>
                                </label>
                                <input 
                                    type="range" 
                                    min="150" 
                                    max="500" 
                                    step="10" 
                                    value={containerHeight}
                                    onChange={(e) => setContainerHeight(Number(e.target.value))}
                                    className="styled-slider"
                                />
                            </div>

                            <div className="control-group">
                                <label className="control-label">Thumb Color</label>
                                <div className="color-picker-wrapper">
                                    <input 
                                        type="color" 
                                        value={thumbColor} 
                                        onChange={(e) => setThumbColor(e.target.value)} 
                                        className="styled-color"
                                    />
                                    <input 
                                        type="text" 
                                        value={thumbColor} 
                                        onChange={(e) => setThumbColor(e.target.value)} 
                                        className="styled-text-input"
                                    />
                                </div>
                            </div>

                            <div className="control-group">
                                <label className="control-label">Track Color</label>
                                <div className="color-picker-wrapper">
                                    <input 
                                        type="color" 
                                        value={trackColor} 
                                        onChange={(e) => setTrackColor(e.target.value)} 
                                        className="styled-color"
                                    />
                                    <input 
                                        type="text" 
                                        value={trackColor} 
                                        onChange={(e) => setTrackColor(e.target.value)} 
                                        className="styled-text-input"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Example Actions Context */}
                    {activeTab === 'spring' && (
                        <div className="panel-actions animate-fade-in">
                            <h4 className="actions-title">Spring Physics Engine Action</h4>
                            <button className="action-btn" onClick={handleRandomScroll}>
                                <i className="fa-solid fa-shuffle"></i> Scroll to Random Position
                            </button>
                            <p className="action-help">
                                Clicking triggers `rebound.js` spring animations mapping custom damping limits to render smooth elastic scrolling.
                            </p>
                        </div>
                    )}
                </section>
                
                {/* Right Panel: Interactive Canvas & Dynamic Code */}
                <section className="display-panel">
                    
                    {/* Live Render Canvas */}
                    <div className="canvas-card panel-card">
                        <div className="canvas-header">
                            <span className="canvas-dot red"></span>
                            <span className="canvas-dot yellow"></span>
                            <span className="canvas-dot green"></span>
                            <span className="canvas-title">
                                {activeTab.toUpperCase()} SCROLLBAR CONTAINER
                            </span>
                            <button 
                                className={`code-toggle ${showCode ? 'active' : ''}`}
                                onClick={() => setShowCode(!showCode)}
                            >
                                <i className="fa-solid fa-code"></i> {showCode ? 'Hide Code' : 'Show Code'}
                            </button>
                        </div>
                        
                        <div className="canvas-body">
                            {renderScrollbarDemo()}
                        </div>
                    </div>

                    {/* Code Snippet Box */}
                    {showCode && (
                        <div className="code-card panel-card animate-fade-in">
                            <div className="code-header">
                                <span className="code-title">
                                    <i className="fa-solid fa-laptop-code"></i> JSX Component Implementation
                                </span>
                                <span className="code-language">typescript</span>
                            </div>
                            <pre className="code-content">
                                <code>{getCodeSnippet()}</code>
                            </pre>
                        </div>
                    )}
                </section>
            </main>

            {/* Footer Section */}
            <footer className="app-footer">
                <p>
                    © 2026 felipecarrillo100/replace-custom-scrollbars. Distributed under the MIT license.
                </p>
                <div className="footer-links">
                    <a href="https://github.com/felipecarrillo100/replace-custom-scrollbars/tree/master/docs" target="_blank" rel="noopener noreferrer">
                        API Documentation
                    </a>
                    <span className="separator">•</span>
                    <span className="author-credits">
                        Rebuilt by Felipe Carrillo
                    </span>
                </div>
            </footer>
        </div>
    );
}
