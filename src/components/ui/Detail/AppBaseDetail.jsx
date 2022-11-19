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
  type,
  name,
  saveAction,
  resetAction,
  children,
}) => (
  <CCard className="mb-4">
    <CCardHeader>
      <CRow className="mb-4">
        <CCol>
          <h2>
            Modifica {type}
          </h2>
          {typeof name === 'string' && name.length > 0 && (
            <h4>{name}</h4>
          )}
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
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  saveAction: PropTypes.func.isRequired,
  resetAction: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

AppBaseDetail.defaultProps = {
  name: null,
};

export default AppBaseDetail;
