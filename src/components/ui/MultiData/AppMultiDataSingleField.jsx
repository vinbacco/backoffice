import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableBody,
  CTableRow,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilPencil,
  cilPlus,
  cilTrash,
} from '@coreui/icons';

const AppMultiDataSingleField = ({
  title,
  buildRowsFn = () => null,
  createFormComponent = null,
  editFormComponent = null,
  deleteFn = null,
}) => {
  const tableData = null;
  const addNewItem = () => null;
  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-start align-items-center">
          <div>
            {title}
          </div>
          <div className="d-inline-block ms-2">
            <CButton
              color="primary"
              onClick={() => addNewItem()}
            >
              <CIcon icon={cilPlus} />
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {tableData}
          {buildRowsFn()}
          <CTable bordered hover>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>Mark</CTableDataCell>
                <CTableDataCell className="col-1">
                  <CButton
                    color="secondary"
                    onClick={() => null}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                </CTableDataCell>
                <CTableDataCell className="col-1">
                  <CButton
                    color="secondary"
                    onClick={() => null}
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  );
};

AppMultiDataSingleField.propTypes = {
  title: PropTypes.string,
  buildRowsFn: PropTypes.func.isRequired,
  createFormComponent: PropTypes.node.isRequired,
  editFormComponent: PropTypes.node.isRequired,
  deleteFn: PropTypes.func.isRequired,
};

AppMultiDataSingleField.defaultProps = {
  title: 'Aggiungi titolo',
};

export default AppMultiDataSingleField;
