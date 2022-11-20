/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
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

const AppMultiData = ({
  title,
  item,
  data,
  modalSize,
  modalAlign,
  createFormComponent = null,
  formId,
  columns,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const tableData = null;
  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-start align-items-center">
          <div className="me-4">
            {title}
          </div>
          <div className="d-inline-block ms-2">
            <CButton
              color="primary"
              onClick={() => setShowCreateModal(!showCreateModal)}
            >
              <CIcon icon={cilPlus} />
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {tableData}
          <CTable bordered>
            <CTableBody>
              { !data || data.length <= 0
                ? (
                  <CTableRow>
                    <CTableDataCell>Nessuno</CTableDataCell>
                  </CTableRow>
                )
                : data.map((currentData, indexData) => (
                  <CTableRow key={`multidata_${item}_data_${indexData}`}>
                    {columns.map((currentColumn, indexColumn) => (
                      <CTableDataCell key={`multidata_${item}_data_column_${indexColumn}_${currentColumn}`}>
                        {currentData[currentColumn] || '-'}
                      </CTableDataCell>
                    ))}
                    <CTableDataCell className="col-1">
                      <CButton
                        color="dark"
                        variant="ghost"
                        onClick={() => setShowEditModal(!showEditModal)}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                    </CTableDataCell>
                    <CTableDataCell className="col-1">
                      <CButton
                        color="danger"
                        variant="ghost"
                        onClick={() => setShowDeleteModal(!showDeleteModal)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      <CModal
        alignment={modalAlign}
        size={modalSize}
        id="createModal"
        backdrop="static"
        visible={showCreateModal}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>{`Aggiungi ${item}`}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {createFormComponent({
            show: showCreateModal,
            closeModal: () => setShowCreateModal(false),
          })}
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setShowCreateModal(false)}>
            Annulla
          </CButton>
          <CButton type="submit" form={formId} color="primary">Si</CButton>
        </CModalFooter>
      </CModal>
      {/* <CModal
        id="editModal"
        backdrop="static"
        visible={showEditModal}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            {editFormComponent}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Body
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setShowEditModal(false)}>
            Annulla
          </CButton>
          <CButton color="primary">Si</CButton>
        </CModalFooter>
      </CModal>
      <CModal
        id="deleteModal"
        backdrop="static"
        visible={showDeleteModal}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Elimina
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Sei sicuro?
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setShowDeleteModal(false)}>
            Annulla
          </CButton>
          <CButton
            color="primary"
            onClick={() => deleteFn}
          >
            Si
          </CButton>
        </CModalFooter>
      </CModal> */}
    </>
  );
};

AppMultiData.propTypes = {
  title: PropTypes.string,
  item: PropTypes.string,
  modalAlign: PropTypes.oneOf(['top', 'center']),
  modalSize: PropTypes.oneOf(['sm', 'lg', 'xl']),
  createFormComponent: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.any) || null,
  columns: PropTypes.arrayOf(PropTypes.string),
};

AppMultiData.defaultProps = {
  title: 'Aggiungi titolo',
  item: 'Item',
  data: null,
  modalSize: 'sm',
  modalAlign: 'top',
  columns: [],
};

export default AppMultiData;
