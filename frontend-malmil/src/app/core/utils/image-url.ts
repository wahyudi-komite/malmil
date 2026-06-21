import { environment } from 'environments/environment';

export function resolveImageUrl(url?: string | null): string {
    if (!url) return '';
    const apiOrigin = environment.apiUrl.replace('/api/v1', '');
    if (url.startsWith(apiOrigin)) {
        return url.slice(apiOrigin.length);
    }
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? url : '/' + url;
}
