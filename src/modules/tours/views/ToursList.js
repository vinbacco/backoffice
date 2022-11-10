import React, { useEffect, useState } from 'react';
import {
  CCol,
  CForm,
  CFormInput,
  CPagination,
  CPaginationItem,
  CRow,
  CButton,
  CInputGroup,
  CFormLabel,
  CFormCheck,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilFile, cilPencil, cilPlus, cilTrash } from '@coreui/icons';

import TourService from 'src/services/api/tourService';
import AppTable from 'src/components/ui/AppTable';


const ToursList = () => {
  const [data, setData] = useState(null);
  const [state, setState] = useState({selectedItems: []});
  const [tableData, setTableData] = useState({paginate: 10, page: 1, total: 0, order: 'asc', sort: 'name', search: ''})
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const toggleSelectAllRows = (event) => {
    const newState = { ...state }
    const isChecked = event.target.checked;
    if (isChecked === true && Array.isArray(data) && data.length > 0) {
      newState.selectedItems = data.map(currentItem => currentItem._id);
    } else {
      newState.selectedItems = [];
    }
    setState(newState)
  }

  const toggleSelectRow = (event, itemId) => {
    const newState = { ...state }
    const isChecked = event.target.checked;
    const elementId = state.selectedItems.findIndex(current => current === itemId);
    if (isChecked === true && elementId === -1) {
      newState.selectedItems.push(itemId);
    } else if (isChecked === false && elementId > -1) {
      newState.selectedItems.splice(elementId, 1);
    }
    setState(newState)
  }

  const isRowSelected = (itemId) => state.selectedItems.findIndex(current => current === itemId) > -1;
  
  const processData = (paginate = 10, page = 1, filters) => {
    const tourService = new TourService();
    tourService.getList(
      paginate,
      page,
      filters,
      (response) => {
        const newTableData = { ...tableData };
        newTableData.total = response?.headers?.total || 0;
        setTableData(newTableData);
        setIsLoadingData(false)
        setData(response.data.map((item) => {
          return ({
            _id: item._id,
            name: item.name,
            business_name: item.contact.business_name,
          });
        }));
      },
      (error) => {
        console.group('Error on processData');
        console.error(error);
        console.groupEnd();
        setData([]);
        setIsLoadingData(false);
      }
    );
  }

  const onChangeOrderSort = (value) => {
    const newTableData = { ...tableData, ...value };
    setTableData(newTableData);
  }

  const onChangeFilter = (value) => {
    const newTableData = { ...tableData };
    newTableData.search = value;
    setTableData(newTableData);
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    console.log(queryParams.get('paginate') || 10)
    if (!data) {
      processData();
    }
  }, [data]);

  const columns = [
    {
      key: 'select',
      label: <CFormCheck checked={Array.isArray(data) && data.length  === state.selectedItems.length } onChange={(event) => toggleSelectAllRows(event)} />,
      _style: { width: '1%' },
      _props: { scope: 'col' },
    },
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'contact.business_name',
      label: 'Cantina',
      sortable: true,
      _props: { scope: 'col' },
    }
  ];

  const renderTableData = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item) => ({
        _id: item._id,
        select: <CFormCheck checked={isRowSelected(item._id)} onChange={(event) => toggleSelectRow(event, item._id)} />,
        name: item.name,
        'contact.business_name': item.business_name,
      }))
    }
    return [];
  }

  const editItem = itemId => {
    navigate(`/tour/${itemId}`);
  }

  return (
    <>
      <h1 className='list-title'>Lista Tour</h1>
      <CRow className="align-items-end mb-4">
        <CCol md={12} lg={6}>
          <CForm onSubmit={(e) => {
                e.preventDefault();
                processData(
                  undefined,
                  undefined,
                  {'^name': e.currentTarget[0].value}
                );
              }
            }
          >
            <CFormLabel htmlFor="list-filter">Filtro</CFormLabel>
            <CInputGroup>
              <CFormInput type="text" id="list-filter" name="list-filter" placeholder="Inserisci le parole chiave" aria-label="Filtro" aria-describedby="filter-button" value={tableData.search} onChange={event => onChangeFilter(event.target.value)} />
              <CButton type="submit" color="primary" id="filter-button">Filtra</CButton>
            </CInputGroup>
          </CForm>
        </CCol>
        <CCol md={12} lg={6} className='list-actions mt-2'>
          <CButton color="primary" onClick={() => setShowCreateModal(true)}><CIcon icon={cilPlus} /> Nuovo</CButton>
          <CButton color="primary" disabled={state.selectedItems.length !== 1} ><CIcon icon={cilPencil} /> Modifica</CButton>
          <CButton color="primary" disabled={state.selectedItems.length === 0} onClick={() => setShowDeleteModal(true)}><CIcon icon={cilTrash} /> Elimina</CButton>
          <CButton color="primary"><CIcon icon={cilFile} /> Esporta</CButton>
        </CCol>
      </CRow>
      <AppTable columns={columns} items={renderTableData()} loading={isLoadingData} orderBy={tableData.order} sortBy={tableData.sort} onChangeOrderSort={onChangeOrderSort} rowAction={editItem} />
      <CRow className="align-items-center mb-5">
        <CCol>
          <CPagination>
            <CPaginationItem className={tableData.page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'} disabled={tableData.page === 1}>Pagina precedente</CPaginationItem>
            <CPaginationItem className={tableData.page === Math.ceil(tableData.total / tableData.paginate) ? 'cursor-not-allowed' : 'cursor-pointer'} disabled={tableData.page === Math.ceil(tableData.total / tableData.paginate)}>Pagina successiva</CPaginationItem>
          </CPagination>
        </CCol>
        <CCol className="text-end">
          Pagina {tableData.page} di {Math.ceil(tableData.total / tableData.paginate)} ({tableData.total} risultat{tableData.total === 1 ? 'o' : 'i'})
        </CCol>
      </CRow>
      <CModal backdrop="static" visible={showCreateModal}>
        <CModalHeader closeButton={false}>
          <CModalTitle>Creare un nuovo Tour</CModalTitle>
        </CModalHeader>
        <CModalBody>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setShowCreateModal(false)}>
            Annulla
          </CButton>
          <CButton color="primary">Crea</CButton>
        </CModalFooter>
      </CModal>
      <CModal backdrop="static" visible={showDeleteModal}>
        <CModalHeader closeButton={false}>
          <CModalTitle>{state.selectedItems.length === 1 ? 'Eliminare il tour' : 'Eliminare i tours'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Sei sicuro di voler eliminare {state.selectedItems.length === 1 ? 'il tour selezionato' : 'i tours selezionati'}? Questa azione non può essere annullata.
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setShowDeleteModal(false)}>
            Annulla
          </CButton>
          <CButton color="primary">Si</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
}
export default ToursList
