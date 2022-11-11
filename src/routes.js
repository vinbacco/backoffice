import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const OrdersList = React.lazy(() => import('./modules/orders/views/OrdersList'));
const OrdersDetail = React.lazy(() => import('./modules/orders/views/OrdersDetail'));
const ToursList = React.lazy(() => import('./modules/tours/views/ToursList'));
const ToursDetail = React.lazy(() => import('./modules/tours/views/ToursDetail'));
const NotFound = React.lazy(() => import('./views/pages/page404/Page404'));
const ProductCategoriesList = React.lazy(() => import('./modules/productCategories/views/ProductCategoriesList'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/orders', name: 'Orders', element: OrdersList },
  { path: '/order/:id', name: 'Order', element: OrdersDetail },
  { path: '/tours', name: 'Tours', element: ToursList },
  { path: '/tour/:id', name: 'Tour', element: ToursDetail },
  { path: '/categories', name: 'Categorie', element: ProductCategoriesList },
  { path: '*', name: 'NotFound', element: NotFound },
];

export default routes;
