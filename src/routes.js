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

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/feeds', name: 'Feeds', element: FeedsList },
  { path: '/feeds/:id', name: 'Feeds Detail', element: FeedsDetail },
  { path: '/winery', name: 'Cantine', element: ContactsList },
  { path: '/winery/:id', name: 'Dettaglio cantina', element: ContactsDetail },
  { path: '/product-types', name: 'Product Types', element: ProductTypesList },
  { path: '/product-types/:id', name: 'Product Type', element: ProductTypeDetail },
  { path: '/regions', name: 'Tags', element: RegionsList },
  { path: '/regions/:id', name: 'Regions Details', element: RegionsDetail },
  { path: '/tags', name: 'Tags', element: TagsList },
  { path: '/tags/:id', name: 'Tags Details', element: TagsDetail },
  { path: '/tours', name: 'Tours', element: ToursList },
  { path: '/tours/:id', name: 'Dettaglio Tour', element: ToursDetail },
  { path: '/zones', name: 'Zones', element: ZonesList },
  { path: '/zones/:id', name: 'Zones Details', element: ZonesDetail },
  { path: '/contact-categories', name: 'Categorie contatto', element: ContactCategoriesList },
  { path: '/contact-categories/:id', name: 'Dettaglio categoria contatto', element: ContactCategoriesDetail },
  { path: '/users', name: 'Utenti', element: UsersList },
  { path: '/users/:id', name: 'Dettaglio utente', element: UsersDetail },
  { path: '/users/profile', name: 'Il tuo profilo', element: UserProfile },
  { path: '*', name: 'NotFound', element: NotFound },
];

export default routes;
