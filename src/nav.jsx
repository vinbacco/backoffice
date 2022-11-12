import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilTerrain } from '@coreui/icons';
import { CNavItem } from '@coreui/react';

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
    icon: <CIcon icon={cilTerrain} customClassName="nav-icon" />,
  },
];

export default nav;
