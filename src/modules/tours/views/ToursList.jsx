/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/**
 * TODO:
 * Aggiornare il query params della pagina una volta avviene qualsiasi modifica (cambio filtro, sort, pagina...) (da fare DOMANI 12/11/2022)
 * Pulire array selezionati dopo la risposta del elimina, una volta sia implementato.
 */
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
import {
  cilFile, cilPencil, cilPlus, cilTrash,
} from '@coreui/icons';

import TourService from 'src/services/api/tourService';
import AppTable from 'src/components/ui/AppTable';

function ToursList() {
  const [data, setData] = useState(null);
  const [state, setState] = useState({ selectedItems: [] });
  const [tableData, setTableData] = useState({
    paginate: 10, page: 1, total: 0, order: 'asc', sort: 'name', search: '',
  });
  const [fetchData, setFetchData] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const toggleSelectAllRows = (event) => {
    const newState = { ...state };
    const isChecked = event.target.checked;
    if (isChecked === true && Array.isArray(data) && data.length > 0) {
      newState.selectedItems = data.map((currentItem) => currentItem._id);
    } else {
      newState.selectedItems = [];
    }
    setState(newState);
  };

  const toggleSelectRow = (event, itemId) => {
    const newState = { ...state };
    const isChecked = event.target.checked;
    const elementId = state.selectedItems.findIndex((current) => current === itemId);
    if (isChecked === true && elementId === -1) {
      newState.selectedItems.push(itemId);
    } else if (isChecked === false && elementId > -1) {
      newState.selectedItems.splice(elementId, 1);
    }
    setState(newState);
  };

  const isRowSelected = (itemId) => state.selectedItems.findIndex((current) => current === itemId) > -1;

  const processData = (currentTableData) => {
    const filters = {};
    if (currentTableData.search.length > 0) filters['^name'] = currentTableData.search;
    setIsLoadingData(true);
    const newTableData = { ...currentTableData };
    const tourService = new TourService();
    tourService.getList(
      currentTableData.paginate,
      currentTableData.page,
      currentTableData.order,
      currentTableData.sort,
      filters,
      (response) => {
        newTableData.total = response?.headers?.total || 0;
        setFetchData(false);
        setTableData(newTableData);
        setIsLoadingData(false);
        setData(response.data.map((item) => ({
          _id: item._id,
          name: item.name,
          business_name: item.contact.business_name,
        })));
      },
      () => {
        setData([]);
        setIsLoadingData(false);
      },
    );
  };

  const onChangeOrderSort = (value) => {
    if (fetchData === false) {
      const newTableData = { ...tableData, ...value };
      newTableData.page = 1;
      setTableData(newTableData);
      setState({ selectedItems: [] });
      setFetchData(true);
    }
  };

  const changePage = (value) => {
    if (fetchData === false) {
      const newTableData = { ...tableData };
      newTableData.page = value;
      setState({ selectedItems: [] });
      setTableData(newTableData);
      setFetchData(true);
    }
  };

  const onChangeFilter = (value) => {
    const newTableData = { ...tableData };
    newTableData.search = value;
    setTableData(newTableData);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const newTableData = { ...tableData };
    newTableData.paginate = queryParams.get('paginate') || 10;
    newTableData.page = queryParams.get('page') || 1;
    newTableData.order = queryParams.get('order') || 'asc';
    newTableData.sort = queryParams.get('sort') || 'name';
    setTableData(newTableData);
    if (!data) {
      setFetchData(true);
    }
  }, []);

  useEffect(() => {
    if (fetchData === true) {
      processData(tableData);
    }
  }, [fetchData]);

  const columns = [
    {
      key: 'select',
      label: <CFormCheck
        disabled={fetchData === true || (Array.isArray(data) && data.length <= 0)}
        checked={Array.isArray(data) && data.length > 0 && data.length === state.selectedItems.length}
        onChange={(event) => toggleSelectAllRows(event)}
      />,
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
    },
  ];

  const renderTableData = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item) => ({
        _id: item._id,
        select: <CFormCheck checked={isRowSelected(item._id)} onChange={(event) => toggleSelectRow(event, item._id)} />,
        name: item.name,
        'contact.business_name': item.business_name,
      }));
    }
    return [];
  };

  const editItem = (itemId) => {
    navigate(`/tour/${itemId}`);
  };

  const applyFilters = (event) => {
    if (fetchData === false) {
      event.preventDefault();
      const newTableData = { ...tableData };
      switch (event.nativeEvent.submitter.name) {
        case 'reset':
          newTableData.search = '';
          break;
        default:
          break;
      }
      newTableData.page = 1;
      setState({ selectedItems: [] });
      setFetchData(true);
      setTableData(newTableData);
    }
  };

  return (
    <>
      <h1 className="list-title">Lista Tour</h1>
      <CRow className="align-items-end mb-4">
        <CCol md={12} lg={6}>
          <CForm onSubmit={(e) => applyFilters(e)}>
            <CFormLabel htmlFor="list-filter">Filtro</CFormLabel>
            <CInputGroup>
              <CFormInput
                disabled={fetchData === true}
                type="text"
                id="list-filter"
                name="list-filter"
                placeholder="Inserisci le parole chiave"
                aria-label="Filtro"
                aria-describedby="filter-button"
                value={tableData.search}
                onChange={(event) => onChangeFilter(event.target.value)}
              />
              <CButton disabled={fetchData === true} type="submit" name="filter" color="primary" id="filter-button">Filtra</CButton>
              <CButton disabled={fetchData === true || tableData.search.length <= 0} type="submit" name="reset" color="danger" id="filter-button">Cancella</CButton>
            </CInputGroup>
          </CForm>
        </CCol>
        <CCol md={12} lg={6} className="list-actions mt-2">
          <CButton color="primary" disabled={fetchData === true} onClick={() => setShowCreateModal(true)}>
            <CIcon icon={cilPlus} className="icon-button" />
            Nuovo
          </CButton>
          <CButton color="primary" disabled={fetchData === true || state.selectedItems.length !== 1} onClick={() => (state.selectedItems[0]) && editItem(state.selectedItems[0])}>
            <CIcon icon={cilPencil} className="icon-button" />
            Modifica
          </CButton>
          <CButton color="primary" disabled={fetchData === true || state.selectedItems.length === 0} onClick={() => setShowDeleteModal(true)}>
            <CIcon icon={cilTrash} className="icon-button" />
            Elimina
          </CButton>
          <CButton color="primary" disabled={fetchData === true}>
            <CIcon icon={cilFile} className="icon-button" />
            Esporta
          </CButton>
        </CCol>
      </CRow>
      <AppTable
        columns={columns}
        items={renderTableData()}
        loading={isLoadingData}
        orderBy={tableData.order}
        sortBy={tableData.sort}
        onChangeOrderSort={onChangeOrderSort}
        rowAction={editItem}
      />
      <CRow className="align-items-center mb-5">
        <CCol>
          <CPagination>
            <CPaginationItem
              onClick={() => changePage(tableData.page - 1)}
              className={tableData.page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}
              disabled={fetchData === true || tableData.page === 1}
            >
              Pagina precedente
            </CPaginationItem>
            <CPaginationItem
              onClick={() => changePage(tableData.page + 1)}
              className={tableData.page === Math.ceil(tableData.total / tableData.paginate) ? 'cursor-not-allowed' : 'cursor-pointer'}
              disabled={fetchData === true || tableData.page === Math.ceil(tableData.total / tableData.paginate)}
            >
              Pagina successiva
            </CPaginationItem>
          </CPagination>
        </CCol>
        <CCol className="text-end">
          {`Pagina ${tableData.page} di ${Math.ceil(tableData.total / tableData.paginate)}(${tableData.total} risultat${tableData.total === 1 ? 'o' : 'i'})`}
        </CCol>
      </CRow>
      <CModal backdrop="static" visible={showCreateModal}>
        <CModalHeader closeButton={false}>
          <CModalTitle>Creare un nuovo Tour</CModalTitle>
        </CModalHeader>
        <CModalBody />
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
          {`Sei sicuro di voler eliminare ${state.selectedItems.length === 1 ? 'il tour selezionato' : 'i tours selezionati'}? Questa azione non può essere annullata.`}
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
export default ToursList;
