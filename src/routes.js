import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const ToursList = React.lazy(() => import('./modules/tours/views/ToursList'));
const ToursDetail = React.lazy(() => import('./modules/tours/views/ToursDetail'));
const FeedsList = React.lazy(() => import('./modules/feeds/views/FeedsList'));
const TagsList = React.lazy(() => import('./modules/tags/views/TagsList'));
const RegionsList = React.lazy(() => import('./modules/regions/views/RegionsList'));
const ZonesList = React.lazy(() => import('./modules/zones/views/ZonesList'));
const NotFound = React.lazy(() => import('./views/pages/page404/Page404'));
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/tours', name: 'Tours', element: ToursList },
  { path: '/tours/:id', name: 'Tour', element: ToursDetail },
  { path: '/feeds', name: 'Feeds', element: FeedsList },
  { path: '/tags', name: 'Tags', element: TagsList },
  { path: '/regions', name: 'Tags', element: RegionsList },
  { path: '/zones', name: 'Tags', element: ZonesList },
  { path: '*', name: 'NotFound', element: NotFound },
];

export default routes;
