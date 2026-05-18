import { Component, createRef } from 'react';
import { Scrollbars, ScrollbarsRef } from 'react-custom-scrollbars';
import { SpringSystem, MathUtil } from 'rebound';

export default class SpringScrollbars extends Component<any> {
    private springSystem: any;
    private spring: any;
    private scrollbarsRef = createRef<ScrollbarsRef>();

    constructor(props: any) {
        super(props);
        this.handleSpringUpdate = this.handleSpringUpdate.bind(this);
    }

    componentDidMount() {
        this.springSystem = new SpringSystem();
        this.spring = this.springSystem.createSpring();
        this.spring.addListener({ onSpringUpdate: this.handleSpringUpdate });
    }

    componentWillUnmount() {
        if (this.springSystem) {
            this.springSystem.deregisterSpring(this.spring);
            this.springSystem.removeAllListeners();
            this.springSystem = undefined;
        }
        if (this.spring) {
            this.spring.destroy();
            this.spring = undefined;
        }
    }

    getScrollTop() {
        return this.scrollbarsRef.current ? this.scrollbarsRef.current.getScrollTop() : 0;
    }

    getScrollHeight() {
        return this.scrollbarsRef.current ? this.scrollbarsRef.current.getScrollHeight() : 0;
    }

    getHeight() {
        return this.scrollbarsRef.current ? this.scrollbarsRef.current.getHeight() : 0;
    }

    scrollTop(top: number) {
        const scrollbars = this.scrollbarsRef.current;
        if (!scrollbars || !this.spring) return;
        const scrollTop = scrollbars.getScrollTop();
        const scrollHeight = scrollbars.getScrollHeight();
        const val = MathUtil.mapValueInRange(top, 0, scrollHeight, scrollHeight * 0.2, scrollHeight * 0.8);
        this.spring.setCurrentValue(scrollTop).setAtRest();
        this.spring.setEndValue(val);
    }

    handleSpringUpdate(spring: any) {
        const scrollbars = this.scrollbarsRef.current;
        if (!scrollbars) return;
        const val = spring.getCurrentValue();
        scrollbars.scrollTop(val);
    }

    render() {
        return (
            <Scrollbars
                {...this.props}
                ref={this.scrollbarsRef}/>
        );
    }
}
