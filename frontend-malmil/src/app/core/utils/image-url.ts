export function resolveImageUrl(url?: string | null): string {
    if (!url) return '';
    try {
        const parsed = new URL(url);
        return parsed.pathname + parsed.search;
    } catch {
        return url.startsWith('/') ? url : '/' + url;
    }
}
