import { SideNavItem } from 'types/sideNavibarItem';

export const workerItems: SideNavItem[] = [
  {
    title: 'Блюда',
    route: 'dishes',
    activeLogoUrl: '/img/activeDishes.png',
    inactiveLogoUrl: '/img/dishes.png',
  },
  {
    title: 'Заказы',
    route: 'orders',
    activeLogoUrl: '/img/activeOrders.png',
    inactiveLogoUrl: '/img/orders.png',
  },
  {
    title: 'Стандартное питание',
    route: 'standard-menu',
    activeLogoUrl: '/img/activeStandardMenu.png',
    inactiveLogoUrl: '/img/standardMenu.png',
  },
];

export const adminItems: SideNavItem[] = [
  {
    title: 'Работники',
    route: '../admin/workers',
    activeLogoUrl: '/img/activeDishes.png',
    inactiveLogoUrl: '/img/dishes.png',
  },
  {
    title: 'Родители',
    route: '../admin/parents',
    activeLogoUrl: '/img/activeOrders.png',
    inactiveLogoUrl: '/img/orders.png',
  },
  {
    title: 'Ученики',
    route: '../admin/students',
    activeLogoUrl: '/img/activeStandardMenu.png',
    inactiveLogoUrl: '/img/standardMenu.png',
  },
  {
    title: 'Классы',
    route: '../admin/classes',
    activeLogoUrl: '/img/activeDishes.png',
    inactiveLogoUrl: '/img/dishes.png',
  },

  {
    title: 'Блюда',
    route: '../worker/dishes',
    activeLogoUrl: '/img/activeDishes.png',
    inactiveLogoUrl: '/img/dishes.png',
  },
  {
    title: 'Заказы',
    route: '../worker/orders',
    activeLogoUrl: '/img/activeOrders.png',
    inactiveLogoUrl: '/img/orders.png',
  },
  {
    title: 'Стандартное питание',
    route: '../worker/standard-menu',
    activeLogoUrl: '/img/activeStandardMenu.png',
    inactiveLogoUrl: '/img/standardMenu.png',
  },
];
