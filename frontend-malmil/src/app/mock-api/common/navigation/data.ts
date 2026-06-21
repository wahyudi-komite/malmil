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
    id: 'ecommerce',
    title: 'E-Commerce',
    type: 'group',
    children: [
      {
        id: 'products',
        title: 'Produk',
        type: 'basic',
        icon: 'heroicons_outline:shopping-bag',
        link: '/products',
      },
      {
        id: 'orders',
        title: 'Pesanan',
        type: 'basic',
        icon: 'heroicons_outline:truck',
        link: '/orders',
      },
      {
        id: 'coupons',
        title: 'Kupon',
        type: 'basic',
        icon: 'heroicons_outline:ticket',
        link: '/coupons',
      },
      {
        id: 'categories',
        title: 'Kategori',
        type: 'basic',
        icon: 'heroicons_outline:tag',
        link: '/categories',
      },
      {
        id: 'banners',
        title: 'Banner',
        type: 'basic',
        icon: 'heroicons_outline:photo',
        link: '/banners',
      },
      {
        id: 'users',
        title: 'Pengguna',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/users',
      },
      {
        id: 'inventory',
        title: 'Inventory',
        type: 'basic',
        icon: 'heroicons_outline:archive-box',
        link: '/inventory',
      },
    ],
  },
  {
    id: 'roles',
    title: 'Roles & Permissions',
    type: 'basic',
    icon: 'heroicons_outline:lock-closed',
    link: '/roles',
  },

  {
    id: 'settings',
    title: 'Pengaturan',
    type: 'basic',
    icon: 'heroicons_outline:cog',
    link: '/settings',
  },
  {
    id: 'audit-logs',
    title: 'Audit Log',
    type: 'basic',
    icon: 'heroicons_outline:document-text',
    link: '/audit-logs',
  },

];

export const compactNavigation: FuseNavigationItem[] = [];
export const futuristicNavigation: FuseNavigationItem[] = [];
export const horizontalNavigation: FuseNavigationItem[] = [];
