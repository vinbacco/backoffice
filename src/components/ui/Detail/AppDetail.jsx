/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable no-empty-pattern */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
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

const Buttons = ({ saveAction, urlFriendlyName, previewPage }) => (
  <CRow className="mb-4 justify-content-end">
    <CCol xs="auto">
      <CDropdown direction="center">
        <CDropdownToggle color="primary"><span className="ps-2 pe-2">Scegli azione</span></CDropdownToggle>
        <CDropdownMenu>
          {urlFriendlyName !== null && (
            <>
              <CDropdownItem className="cursor-pointer" onClick={() => previewPage(urlFriendlyName)}>Anteprima pagina</CDropdownItem>
              <CDropdownDivider />
            </>
          )}
          <CDropdownItem className="cursor-pointer" onClick={() => saveAction('save')}>Salva bozza</CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem className="cursor-pointer" onClick={() => saveAction('publish')}>Pubblica</CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem className="cursor-pointer" onClick={() => saveAction('publishNow')}>Pubblica ora</CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </CCol>
  </CRow>
);

Buttons.propTypes = {
  saveAction: PropTypes.func.isRequired,
  previewPage: PropTypes.func,
  urlFriendlyName: PropTypes.string,
};

Buttons.defaultProps = {
  urlFriendlyName: null,
  previewPage: () => null,
};

const AppDetail = (props) => {
  const {
    name, urlFriendlyName, tabsContents, actions, saveAction, tabsHeaders, previewPage,
  } = props;
  const [activeTab, setActiveTab] = useState(tabsHeaders[0] || null);

  return (
    <div style={{ marginBottom: '4em' }}>
      <CCard>
        <CCardHeader>
          <CRow className="mb-4">
            <CCol>
              <h2>{name}</h2>
            </CCol>
          </CRow>
          {actions === true && (
            <Buttons
              urlFriendlyName={urlFriendlyName}
              saveAction={saveAction}
              previewPage={previewPage}
            />
          )}
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol className="d-lg-block d-md-none d-sm-none d-xs-none">
              <CNav variant="pills" role="tablist" className="mb-4">
                {tabsHeaders.map((currentTab, tabIndex) => (
                  <CNavItem key={`app-detail-tab-header-${tabIndex}_${currentTab}`}>
                    <CNavLink
                      className="cursor-pointer nav-pill-border"
                      active={activeTab.index === currentTab.index}
                      onClick={() => setActiveTab(currentTab)}
                    >
                      {currentTab.label}
                    </CNavLink>
                  </CNavItem>
                ))}
              </CNav>
            </CCol>
            <CCol className="d-lg-none d-md-block d-sm-block d-xs-block">
              <CDropdown direction="center" className="w-100 mb-4">
                <CDropdownToggle color="primary"><span className="ps-2 pe-2">{activeTab.label}</span></CDropdownToggle>
                <CDropdownMenu className="w-100">
                  {tabsHeaders.map((currentTab, tabIndex) => (
                    <CDropdownItem
                      key={`app-detail-tab-header-dropdown-${tabIndex}_${currentTab}`}
                      className="cursor-pointer"
                      onClick={() => setActiveTab(currentTab)}
                    >
                      {currentTab.label}
                    </CDropdownItem>
                  ))}
                </CDropdownMenu>
              </CDropdown>
            </CCol>
          </CRow>
          <CTabContent>
            {tabsContents.map((currentTab, tabIndex) => (
              <CTabPane
                key={`app-detail-tab-content-${tabIndex}_${currentTab}`}
                className="p-3"
                role="tabpanel"
                aria-labelledby="main-tab"
                visible={activeTab.index === currentTab.index}
              >
                {currentTab.content}
              </CTabPane>
            ))}
          </CTabContent>
        </CCardBody>
        {actions === true && (
          <CCardFooter>
            <div className="mt-4" />
            <Buttons saveAction={saveAction} />
          </CCardFooter>
        )}
      </CCard>
    </div>
  );
};

AppDetail.propTypes = {
  name: PropTypes.string,
  urlFriendlyName: PropTypes.string,
  actions: PropTypes.bool,
  saveAction: PropTypes.func,
  previewPage: PropTypes.func,
  tabsHeaders: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.string,
    label: PropTypes.string,
  })).isRequired,
  tabsContents: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.string,
    content: PropTypes.element,
  })).isRequired,
};

AppDetail.defaultProps = {
  name: null,
  actions: true,
  saveAction: () => null,
  previewPage: () => null,
  urlFriendlyName: null,
};

export default AppDetail;
