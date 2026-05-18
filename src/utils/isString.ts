export default function isString(maybe: any): maybe is string {
    return typeof maybe === 'string';
}
