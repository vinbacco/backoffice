import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  CImage, CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler,
} from '@coreui/react';

import { AppSidebarNav } from './AppSidebarNav';

import logo from 'src/assets/images/logo/logo_lg_white.svg';
import logoSmall from 'src/assets/images/logo/logo_sm_white.svg';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// sidebar nav config

import { setSidebar } from 'src/redux/slices/appSlice';
import navigation from '../_nav';

function AppSidebar() {
  const sidebarShow = useSelector((state) => state.app.sidebarShow);
  const dispatch = useDispatch();

  return (
    <CSidebar
      position="fixed"
      visible={sidebarShow}
      onVisibleChange={(showValue) => (sidebarShow !== showValue ? dispatch(setSidebar(showValue)) : null)}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CImage className="sidebar-brand-full" src={logo} height={35} />
        <CImage className="sidebar-brand-narrow" src={logoSmall} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  );
}

export default React.memo(AppSidebar);
