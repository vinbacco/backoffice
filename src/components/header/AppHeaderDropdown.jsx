import React from 'react';
import { useSelector } from 'react-redux';
import {
  // CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import {
  cilAccountLogout, cilUser,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';

import AuthService from 'src/services/api/authService';

// import avatar8 from '../../assets/images/avatars/2.jpg';

function AppHeaderDropdown() {
  const userData = useSelector((state) => state.user.value);

  const handleLogout = () => {
    const authService = new AuthService();
    authService.logout();
  };

  return (
    <CDropdown variant="nav-item" direction="center">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <span className="d-flex align-items-center">
          {/* <CAvatar className="me-2" src={avatar8} size="md" /> */}
          <p className="m-0">
            <small>
              <b>{`${userData.name} `}</b>
              <br />
              {userData.email}
            </small>
          </p>
        </span>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2 mb-2">Account</CDropdownHeader>
        <CDropdownItem href="/users/profile">
          <CIcon icon={cilUser} className="me-2" />
          Profilo
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="/#" onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Esci
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
}

export default AppHeaderDropdown;
