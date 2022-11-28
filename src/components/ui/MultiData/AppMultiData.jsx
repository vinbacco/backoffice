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

import utils from 'src/services/api/utils/utils';

const AppMultiData = ({
  className,
  title,
  item,
  data,
  modalSize,
  modalAlign,
  createFormComponent,
  editFormComponent,
  deleteFunction,
  formId,
  singleField,
  singleFieldType,
  columns,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editModalState, setEditModalState] = useState({ show: false, target: null });
  const [deleteModalState, setDeleteModalState] = useState({ show: false, target: null });

  const handleDeleteFunction = () => {
    deleteFunction({ id: deleteModalState.target });
    setDeleteModalState({ show: false, target: null });
  };

  const renderCellValue = (columnData, columnProps, isSingleField = false) => {
    const displayData = isSingleField ? columnData : columnData[columnProps.index];
    if (!displayData) return '-';
    switch (columnProps.type) {
      case 'currency':
        return utils.formatCurrency({ number: parseFloat(displayData) });
      case 'select':
        return displayData.label;
      case 'text':
      default:
        return displayData;
    }
  };

  const renderCells = (currentData) => {
    if (singleField === true) {
      return (
        <CTableDataCell>
          {renderCellValue(currentData, singleFieldType, true)}
        </CTableDataCell>
      );
    }
    return (columns.map((currentColumn, indexColumn) => (
      <CTableDataCell key={`multidata_${item}_data_column_${indexColumn}_${currentColumn}`}>
        {renderCellValue(currentData, currentColumn)}
      </CTableDataCell>
    )));
  };

  const processDataType = () => {
    if (typeof data[editModalState.target] === 'object') {
      return { ...data[editModalState.target], id: editModalState.target };
    }
    return { value: data[editModalState.target], id: editModalState.target };
  };

  return (
    <div className={className}>
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
                    {renderCells(currentData)}
                    <CTableDataCell className="col-1">
                      <CButton
                        color="dark"
                        variant="ghost"
                        onClick={() => setEditModalState({
                          show: !editModalState.show, target: indexData,
                        })}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                    </CTableDataCell>
                    <CTableDataCell className="col-1">
                      <CButton
                        color="danger"
                        variant="ghost"
                        onClick={() => setDeleteModalState({
                          show: !deleteModalState.show, target: indexData,
                        })}
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
          <CButton color="secondary" onClick={() => setShowCreateModal(false)}>
            Annulla
          </CButton>
          <CButton type="submit" form={`create_${formId}`} color="primary">
            Applica
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        alignment={modalAlign}
        size={modalSize}
        id="editModal"
        backdrop="static"
        visible={editModalState.show}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            {`Modifica ${item}`}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {editFormComponent({
            show: editModalState.show,
            closeModal: () => setEditModalState({
              show: false, target: null,
            }),
            target: {
              data: typeof editModalState.target === 'number' && editModalState.target >= 0
                ? processDataType()
                : {},
            },
          })}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setEditModalState({
              show: false, target: null,
            })}
          >
            Annulla
          </CButton>
          <CButton type="submit" form={`edit_${formId}`} color="primary">
            Applica
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        id="deleteModal"
        backdrop="static"
        visible={deleteModalState.show}
      >
        <CModalHeader closeButton={false}>
          <CModalTitle>
            Elimina
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Sei sicuro di voler eliminare questo elemento? Questa azione non può essere annullata.
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setDeleteModalState({
              show: false, target: null,
            })}
          >
            Annulla
          </CButton>
          <CButton
            color="primary"
            onClick={() => handleDeleteFunction()}
          >
            Si
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

AppMultiData.propTypes = {
  title: PropTypes.string,
  item: PropTypes.string,
  modalAlign: PropTypes.oneOf(['top', 'center']),
  modalSize: PropTypes.oneOf(['sm', 'lg', 'xl']),
  createFormComponent: PropTypes.func.isRequired,
  editFormComponent: PropTypes.func.isRequired,
  deleteFunction: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.any) || null,
  singleField: PropTypes.bool,
  singleFieldType: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    index: PropTypes.string,
  })),
  className: PropTypes.string,
};

AppMultiData.defaultProps = {
  title: 'Aggiungi titolo',
  item: 'Item',
  data: null,
  modalSize: 'sm',
  modalAlign: 'top',
  singleField: false,
  singleFieldType: 'string',
  columns: [],
  className: '',
};

export default AppMultiData;
