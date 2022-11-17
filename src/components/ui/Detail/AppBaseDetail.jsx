/* eslint-disable react/jsx-one-expression-per-line */

import React from 'react';
import PropTypes from 'prop-types';
import {
  CButton,
  CCol,
  CRow,
} from '@coreui/react';

const AppBaseDetail = ({
  name,
  saveAction,
  resetAction,
  children,
}) => (
  <>
    <CRow className="mb-4">
      <CCol>
        <h2>
          Modifica {name}
        </h2>
      </CCol>
    </CRow>
    <CRow className="mb-4 justify-content-end">
      <CCol xs="auto">
        <CButton color="primary" onClick={() => saveAction()}>Salva</CButton>
      </CCol>
      <CCol xs="auto">
        <CButton color="secondary" onClick={() => resetAction()}>Annulla</CButton>
      </CCol>
    </CRow>
    <CRow>
      {children}
    </CRow>
  </>
);

AppBaseDetail.propTypes = {
  name: PropTypes.string.isRequired,
  saveAction: PropTypes.func.isRequired,
  resetAction: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

export default AppBaseDetail;
