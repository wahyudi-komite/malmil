/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/dashboard',
    },
    {
        id: 'query',
        title: 'Query',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/query',
    },
    {
        id: 'audit-log',
        title: 'Audit Log',
        type: 'basic',
        icon: 'heroicons_outline:document-text',
        link: '/audit-log',
    },

];
export const compactNavigation: FuseNavigationItem[] = [];
export const futuristicNavigation: FuseNavigationItem[] = [];
export const horizontalNavigation: FuseNavigationItem[] = [];
