import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilListRich, cilSpeedometer, cilTags, cilTerrain } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Orders',
    to: '/orders',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tours',
    to: '/tours',
    icon: <CIcon icon={cilTerrain} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Categorie',
    to: '/categories',
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
  },
]

export default _nav
