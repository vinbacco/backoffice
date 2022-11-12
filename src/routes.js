import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const ToursList = React.lazy(() => import('./modules/tours/views/ToursList'));
const ToursDetail = React.lazy(() => import('./modules/tours/views/ToursDetail'));
const NotFound = React.lazy(() => import('./views/pages/page404/Page404'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/tours', name: 'Tours', element: ToursList },
  { path: '/tour/:id', name: 'Tour', element: ToursDetail },
  { path: '*', name: 'NotFound', element: NotFound },
];

export default routes;
