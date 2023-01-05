/* eslint-disable import/no-cycle */
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CImage,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMenu } from '@coreui/icons';

import logo from 'src/assets/images/logo/logo_lg.svg';
import { toggleSidebar } from 'src/redux/slices/app.slice';
import { AppBreadcrumb } from './index';
import AppHeaderDropdown from './header/index';

function AppHeader() {
  const dispatch = useDispatch();

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid style={{ flexWrap: 'nowrap' }}>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch(toggleSidebar())}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CImage fluid src={logo} height={35} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
}

export default AppHeader;
