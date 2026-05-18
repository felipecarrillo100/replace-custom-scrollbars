export default function getInnerWidth(el: HTMLElement): number {
    const { clientWidth } = el;
    const { paddingLeft, paddingRight } = getComputedStyle(el);
    return clientWidth - parseFloat(paddingLeft || '0') - parseFloat(paddingRight || '0');
}
