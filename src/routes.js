import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const ToursList = React.lazy(() => import('./modules/tours/views/ToursList'));
const ToursDetail = React.lazy(() => import('./modules/tours/views/ToursDetail'));
const ContactsList = React.lazy(() => import('./modules/contacts/views/ContactsList'));
const ContactsDetail = React.lazy(() => import('./modules/contacts/views/ContactsDetail'));
const FeedsList = React.lazy(() => import('./modules/feeds/views/FeedsList'));
const FeedsDetail = React.lazy(() => import('./modules/feeds/views/FeedsDetail'));
const ProductTypesList = React.lazy(() => import('./modules/productTypes/views/ProductTypesList'));
const RegionsList = React.lazy(() => import('./modules/regions/views/RegionsList'));
const RegionsDetail = React.lazy(() => import('./modules/regions/views/RegionsDetail'));
const TagsList = React.lazy(() => import('./modules/tags/views/TagsList'));
const TagsDetail = React.lazy(() => import('./modules/tags/views/TagsDetail'));
const ZonesList = React.lazy(() => import('./modules/zones/views/ZonesList'));
const ZonesDetail = React.lazy(() => import('./modules/zones/views/ZonesDetail'));
const NotFound = React.lazy(() => import('./views/pages/page404/Page404'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/feeds', name: 'Feeds', element: FeedsList },
  { path: '/feeds/:id', name: 'Feeds Detail', element: FeedsDetail },
  { path: '/winery', name: 'Cantine', element: ContactsList },
  { path: '/winery/:id', name: 'Dettaglio cantina', element: ContactsDetail },
  { path: '/product-types', name: 'ProductTypes', element: ProductTypesList },
  { path: '/regions', name: 'Tags', element: RegionsList },
  { path: '/regions/:id', name: 'Regions Details', element: RegionsDetail },
  { path: '/tags', name: 'Tags', element: TagsList },
  { path: '/tags/:id', name: 'Tags Details', element: TagsDetail },
  { path: '/tours', name: 'Tours', element: ToursList },
  { path: '/tours/:id', name: 'Dettaglio Tour', element: ToursDetail },
  { path: '/zones', name: 'Zones', element: ZonesList },
  { path: '/zones/:id', name: 'Zones Details', element: ZonesDetail },
  { path: '*', name: 'NotFound', element: NotFound },
];

export default routes;
