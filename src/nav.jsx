import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilSpeedometer, cilTerrain, cilList, cilMap, cilBusAlt, cilUser,
} from '@coreui/icons';
import { CNavItem, CNavGroup } from '@coreui/react';

const nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tours',
    to: '/tours',
    icon: <CIcon icon={cilBusAlt} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Cantine',
    to: '/winery',
    icon: <CIcon icon={cilTerrain} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    toggler: 'Impostazioni',
    name: 'Impostazioni',
    items: [
      {
        component: CNavItem,
        name: 'Feeds',
        to: '/feeds',
        icon: <CIcon icon={cilList} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Tags',
        to: '/tags',
        icon: <CIcon icon={cilList} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Regioni',
        to: '/regions',
        icon: <CIcon icon={cilList} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Zone',
        to: '/zones',
        icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Tipologie Prodotti',
        to: '/product-types',
        icon: <CIcon icon={cilList} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Utenti',
        to: '/users',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ],
  },
];

export default nav;
