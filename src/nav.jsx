/* eslint-disable no-unused-vars */
import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilSpeedometer,
  cilTerrain,
  cilList,
  cilMap,
  cilBusAlt,
  cilUser,
  cilContact,
  cilPeople,
  cilAddressBook,
} from '@coreui/icons';
import { CNavItem, CNavGroup } from '@coreui/react';
import { useSelector } from 'react-redux';

const nav = () => {
  const userData = useSelector((state) => state.user.value);

  const navigationArray = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
  ];
  if (Array.isArray(userData.permissions) && userData.permissions.length > 0) {
    // Tours
    if (userData.permissions.find((current) => current === 'products_view') !== undefined) {
      navigationArray.push({
        component: CNavItem,
        name: 'Tours',
        to: '/tours',
        icon: <CIcon icon={cilBusAlt} customClassName="nav-icon" />,
      });
    }
    // Contacts
    if (userData.permissions.find((current) => current === 'contacts_view') !== undefined) {
      navigationArray.push({
        component: CNavItem,
        name: 'Cantine',
        to: '/winery',
        icon: <CIcon icon={cilTerrain} customClassName="nav-icon" />,
      });
    }
    // Orders
    if (userData.permissions.find((current) => current === 'orders_view') !== undefined) {
      navigationArray.push({
        component: CNavItem,
        name: 'Prenotazioni',
        to: '/orders',
        icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
      });
    }
    // Settings
    if (userData.permissions.find((current) => current === 'settings_view') !== undefined) {
      const settingsNav = [];
      // Feeds
      if (userData.permissions.find((current) => current === 'feeds_view') !== undefined) {
        settingsNav.push({
          component: CNavItem,
          name: 'Feeds',
          to: '/feeds',
          icon: <CIcon icon={cilList} customClassName="nav-icon" />,
        });
      }
      // Tags
      if (userData.permissions.find((current) => current === 'tags_view') !== undefined) {
        settingsNav.push({
          component: CNavItem,
          name: 'Tags',
          to: '/tags',
          icon: <CIcon icon={cilList} customClassName="nav-icon" />,
        });
      }
      // Regions // TODO:
      settingsNav.push({
        component: CNavItem,
        name: 'Regioni',
        to: '/regions',
        icon: <CIcon icon={cilList} customClassName="nav-icon" />,
      });
      // Zones // TODO:
      settingsNav.push({
        component: CNavItem,
        name: 'Zone',
        to: '/zones',
        icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
      });
      // Product types
      if (userData.permissions.find((current) => current === 'product_types_view') !== undefined) {
        settingsNav.push({
          component: CNavItem,
          name: 'Tipologie Prodotti',
          to: '/product-types',
          icon: <CIcon icon={cilList} customClassName="nav-icon" />,
        });
      }
      // Contact categories
      if (userData.permissions.find((current) => current === 'contact_categories_view') !== undefined) {
        settingsNav.push({
          component: CNavItem,
          name: 'Categorie contatto',
          to: '/contact-categories',
          icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
        });
      }
      // Users
      if (
        userData.permissions.find((current) => current === 'users_create') !== undefined &&
        userData.permissions.find((current) => current === 'users_edit') !== undefined &&
        userData.permissions.find((current) => current === 'users_delete') !== undefined
      ) {
        settingsNav.push({
          component: CNavItem,
          name: 'Utenti',
          to: '/users',
          icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
        });
      // Profile
      } else {
        settingsNav.push({
          component: CNavItem,
          name: 'Profilo',
          to: '/users/profile',
          icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        });
      }

      navigationArray.push({
        component: CNavGroup,
        toggler: 'Impostazioni',
        name: 'Impostazioni',
        items: settingsNav,
      });
    }
  }
  return navigationArray;
};

export default nav;
