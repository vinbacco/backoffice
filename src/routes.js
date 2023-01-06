import Dashboard from './views/dashboard/Dashboard';
import ToursList from './modules/tours/views/ToursList';
import ToursDetail from './modules/tours/views/ToursDetail';
import ContactsList from './modules/contacts/views/ContactsList';
import ContactsDetail from './modules/contacts/views/ContactsDetail';
import FeedsList from './modules/feeds/views/FeedsList';
import FeedsDetail from './modules/feeds/views/FeedsDetail';
import ProductTypesList from './modules/productTypes/views/ProductTypesList';
import ProductTypeDetail from './modules/productTypes/views/ProductTypeDetail';
import RegionsList from './modules/regions/views/RegionsList';
import RegionsDetail from './modules/regions/views/RegionsDetail';
import TagsList from './modules/tags/views/TagsList';
import TagsDetail from './modules/tags/views/TagsDetail';
import ZonesList from './modules/zones/views/ZonesList';
import ZonesDetail from './modules/zones/views/ZonesDetail';
import NotFound from './views/pages/page404/Page404';
import ContactCategoriesList from './modules/contactCategories/views/ContactCategoriesList';
import ContactCategoriesDetail from './modules/contactCategories/views/ContactCategoriesDetail';
import UsersList from './modules/users/views/UsersList';
import UsersDetail from './modules/users/views/UsersDetail';
import UserProfile from './modules/users/views/UserProfile';
import OrdersList from './modules/orders/views/OrdersList';
import OrdersDetail from './modules/orders/views/OrdersDetail';

// FIXME: Permessi giusti per zones e per regions

const routes = [
  {
    path: '/',
    exact: true,
    name: 'Home',
  },
  {
    path: '/users/profile',
    name: 'Il tuo profilo',
    element: UserProfile,
  },
  {
    path: '*',
    name: 'NotFound',
    element: NotFound,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: Dashboard,
  },
  {
    path: '/feeds',
    name: 'Feeds',
    element: FeedsList,
    roles: ['admin'],
    permissions: ['feeds_view'],
  },
  {
    path: '/feeds/:id',
    name: 'Feeds Detail',
    element: FeedsDetail,
    roles: ['admin'],
    permissions: ['feeds_view', 'feeds_edit'],
  },
  {
    path: '/winery',
    name: 'Cantine',
    element: ContactsList,
    roles: ['admin', 'winery'],
    permissions: ['contacts_view'],
  },
  {
    path: '/winery/:id',
    name: 'Dettaglio cantina',
    element: ContactsDetail,
    roles: ['admin', 'winery'],
    permissions: ['contacts_view', 'contacts_edit'],
  },
  {
    path: '/product-types',
    name: 'Product Types',
    element: ProductTypesList,
    roles: ['admin'],
    permissions: ['product_types_view'],
  },
  {
    path: '/product-types/:id',
    name: 'Product Type',
    element: ProductTypeDetail,
    roles: ['admin'],
    permissions: ['product_types_view', 'product_types_edit'],
  },
  {
    path: '/regions',
    name: 'Regions',
    roles: ['admin'],
    element: RegionsList,
  },
  {
    path: '/regions/:id',
    name: 'Regions Details',
    element: RegionsDetail,
    roles: ['admin'],
  },
  {
    path: '/tags',
    name: 'Tags',
    element: TagsList,
    roles: ['admin'],
    permissions: ['tags_view'],
  },
  {
    path: '/tags/:id',
    name: 'Tags Details',
    element: TagsDetail,
    roles: ['admin'],
    permissions: ['tags_view', 'tags_edit'],
  },
  {
    path: '/tours',
    name: 'Tours',
    element: ToursList,
    roles: ['admin', 'winery'],
    permissions: ['products_view'],
  },
  {
    path: '/tours/:id',
    name: 'Dettaglio Tour',
    element: ToursDetail,
    roles: ['admin', 'winery'],
    permissions: ['products_view', 'products_edit'],
  },
  {
    path: '/orders',
    name: 'Prenotazioni',
    element: OrdersList,
    roles: ['admin'],
    permissions: ['orders_view'],
  },
  {
    path: '/orders/:id',
    name: 'Dettaglio prenotazione',
    element: OrdersDetail,
    roles: ['admin'],
    permissions: ['orders_view', 'orders_edit'],
  },
  {
    path: '/zones',
    name: 'Zones',
    element: ZonesList,
    roles: ['admin'],
  },
  {
    path: '/zones/:id',
    name: 'Zones Details',
    element: ZonesDetail,
    roles: ['admin'],
  },
  {
    path: '/contact-categories',
    name: 'Categorie contatto',
    element: ContactCategoriesList,
    roles: ['admin'],
    permissions: ['contact_categories_view'],
  },
  {
    path: '/contact-categories/:id',
    name: 'Dettaglio categoria contatto',
    element: ContactCategoriesDetail,
    roles: ['admin'],
    permissions: ['contact_categories_view', 'contact_categories_edit'],
  },
  {
    path: '/users',
    name: 'Utenti',
    element: UsersList,
    roles: ['admin'],
    permissions: ['users_view'],
  },
  {
    path: '/users/:id',
    name: 'Dettaglio utente',
    element: UsersDetail,
    roles: ['admin'],
    permissions: ['users_view', 'users_edit'],
  },
];

export default routes;
