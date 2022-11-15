/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-pattern */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  CButton,
  CCol,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
} from '@coreui/react';

const AppDetail = (props) => {
  const {
    name, urlFriendlyName, tabContentMain, tabContentWeb, saveAction,
  } = props;
  const [activeKey, setActiveKey] = useState(1);

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <h2>{name}</h2>
          <small>{`Pagina sito: /${urlFriendlyName}`}</small>
        </CCol>
      </CRow>
      <CRow className="mb-4 justify-content-end">
        <CCol xs="auto">
          <CDropdown variant="btn-group">
            <CButton color="primary" onClick={() => saveAction('save')}>Salva bozza</CButton>
            <CDropdownToggle color="primary" split />
            <CDropdownMenu>
              <CDropdownItem className="cursor-pointer" onClick={() => saveAction('publish')}>Pubblica</CDropdownItem>
              <CDropdownDivider />
              <CDropdownItem className="cursor-pointer" onClick={() => saveAction('publishNow')}>Pubblica ora</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CCol>
      </CRow>
      <CNav variant="tabs" role="tablist">
        <CNavItem>
          <CNavLink
            className="cursor-pointer"
            active={activeKey === 1}
            onClick={() => setActiveKey(1)}
          >
            Dati principali
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            className="cursor-pointer"
            active={activeKey === 2}
            onClick={() => setActiveKey(2)}
          >
            Dati web
          </CNavLink>
        </CNavItem>
      </CNav>
      <CTabContent>
        <CTabPane className="p-3" role="tabpanel" aria-labelledby="main-tab" visible={activeKey === 1}>
          {tabContentMain}
        </CTabPane>
        <CTabPane className="p-3" role="tabpanel" aria-labelledby="web-tab" visible={activeKey === 2}>
          {tabContentWeb}
        </CTabPane>
      </CTabContent>
    </>
  );
};

AppDetail.propTypes = {
  name: PropTypes.string,
  urlFriendlyName: PropTypes.string,
  saveAction: PropTypes.func.isRequired,
  tabContentMain: PropTypes.element.isRequired,
  tabContentWeb: PropTypes.element.isRequired,
};

AppDetail.defaultProps = {
  name: null,
  urlFriendlyName: null,
};

export default AppDetail;
