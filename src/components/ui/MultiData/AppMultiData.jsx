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
  buildRowsFn = () => null,
  createFormComponent = null,
  editFormComponent = null,
  deleteFn = null,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const tableData = null;
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
              onClick={() => setShowCreateModal(!showCreateModal)}
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
                <CTableDataCell>Otto</CTableDataCell>
                <CTableDataCell>@mdo</CTableDataCell>
                <CTableDataCell className="col-1">
                  <CButton
                    color="secondary"
                    onClick={() => setShowEditModal(!showEditModal)}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                </CTableDataCell>
                <CTableDataCell className="col-1">
                  <CButton
                    color="secondary"
                    onClick={() => setShowDeleteModal(!showDeleteModal)}
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      <CModal
        id="createModal"
        backdrop="static"
        visible={showCreateModal}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Aggiungi
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {createFormComponent()}
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setShowCreateModal(false)}>
            Annulla
          </CButton>
          <CButton color="primary">Si</CButton>
        </CModalFooter>
      </CModal>
      <CModal
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
      </CModal>
    </>
  );
};

AppMultiData.propTypes = {
  title: PropTypes.string,
  buildRowsFn: PropTypes.func.isRequired,
  createFormComponent: PropTypes.node.isRequired,
  editFormComponent: PropTypes.node.isRequired,
  deleteFn: PropTypes.func.isRequired,
};

AppMultiData.defaultProps = {
  title: 'Aggiungi titolo',
};

export default AppMultiData;
