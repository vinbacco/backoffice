/* eslint-disable react/jsx-one-expression-per-line */

import React from 'react';
import PropTypes from 'prop-types';
import {
  CButton,
  CCol,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
} from '@coreui/react';

const Buttons = ({ saveAction, resetAction }) => (
  <CRow className="mb-4 justify-content-end">
    <CCol xs="auto">
      <CButton color="primary" onClick={() => saveAction()}>Salva</CButton>
    </CCol>
    <CCol xs="auto">
      <CButton color="secondary" onClick={() => resetAction()}>Annulla</CButton>
    </CCol>
  </CRow>
);

Buttons.propTypes = {
  saveAction: PropTypes.func.isRequired,
  resetAction: PropTypes.func.isRequired,
};

const AppBaseDetail = ({
  name,
  saveAction,
  resetAction,
  children,
}) => (
  <CCard>
    <CCardHeader>
      <CRow className="mb-4">
        <CCol>
          <h2>
            Modifica {name}
          </h2>
        </CCol>
      </CRow>
      <Buttons
        saveAction={saveAction}
        resetAction={resetAction}
      />
    </CCardHeader>
    <CCardBody>
      <CRow>
        {children}
      </CRow>
    </CCardBody>
    <CCardFooter>
      <Buttons
        saveAction={saveAction}
        resetAction={resetAction}
      />
    </CCardFooter>
  </CCard>
);

AppBaseDetail.propTypes = {
  name: PropTypes.string.isRequired,
  saveAction: PropTypes.func.isRequired,
  resetAction: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

export default AppBaseDetail;
