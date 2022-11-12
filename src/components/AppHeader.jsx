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

import logo from 'src/assets/images/logo/logo_lg_white.svg';
import { toggleSidebar } from 'src/redux/slices/app.slice';
import { AppBreadcrumb } from './index';
import AppHeaderDropdown from './header/index';

function AppHeader() {
  const dispatch = useDispatch();

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch(toggleSidebar())}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CImage src={logo} height={35} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="ms-3">
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
