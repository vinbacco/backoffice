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
const TagsList = React.lazy(() => import('./modules/tags/views/TagsList'));
const ZonesList = React.lazy(() => import('./modules/zones/views/ZonesList'));
const NotFound = React.lazy(() => import('./views/pages/page404/Page404'));
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/feeds', name: 'Feeds', element: FeedsList },
  { path: '/feeds/:id', name: 'Feeds Detail', element: FeedsDetail },
  { path: '/contacts', name: 'Contacts', element: ContactsList },
  { path: '/contacts/:id', name: 'Contacts Detail', element: ContactsDetail },
  { path: '/product-types', name: 'ProductTypes', element: ProductTypesList },
  { path: '/regions', name: 'Tags', element: RegionsList },
  { path: '/tags', name: 'Tags', element: TagsList },
  { path: '/tours', name: 'Tours', element: ToursList },
  { path: '/tours/:id', name: 'Tour', element: ToursDetail },
  { path: '/zones', name: 'Tags', element: ZonesList },
  { path: '*', name: 'NotFound', element: NotFound },
];

export default routes;
