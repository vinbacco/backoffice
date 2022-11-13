/* eslint-disable no-underscore-dangle */
/**
 * TODO:
 * Sistemare formulario creazione con pacchetto da discutere con Marco,
 * inclusa validazione prima di salvare
 * Pulire array selezionati dopo la risposta del elimina, una volta sia implementato.
 */
import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CCol,
  CForm,
  CFormInput,
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
  CAlert,
  CAlertHeading,
} from '@coreui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import {
  cilFile, cilPencil, cilPlus, cilTrash,
} from '@coreui/icons';

import AppTable from 'src/components/ui/AppTable';
import Pagination from 'src/components/ui/List/Pagination';
import dataToQueryParams from 'src/utils/dataToQueryParams';
import Autocomplete from 'src/components/ui/Autocomplete';

import TourService from 'src/services/api/TourService';
import ContactService from 'src/services/api/ContactService';

function ToursList() {
  const location = useLocation();
  const [state, setState] = useState({ selectedItems: [] });
  const initialTableData = {
    paginate: 10,
    page: 1,
    total: 0,
    order: 'asc',
    sort: 'name',
    search: '',
    data: null,
  };
  const [tableData, setTableData] = useState(initialTableData);
  const [fetchData, setFetchData] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  /** FIXME: Usare pacchetto formulari da discutere con Marco */
  const [creationModel, setCreationModel] = useState({});
  const [creationAction, setCreationAction] = useState({ error: null, executing: false });
  /** END */

  const [contactsData, setContactsData] = useState({
    data: [],
    fetching: true,
    filter: '',
    requestId: uuidv4(),
  });
  const contactRequestIdRef = useRef(contactsData.requestId);

  const loadContacts = () => {
    const contactService = new ContactService();

    const okGetContacts = (response, requestId) => {
      if (contactRequestIdRef.current === requestId) {
        let responseData = [];
        if (Array.isArray(response.data) && response.data.length > 0) {
          responseData = response.data.map((currentItem) => (
            { value: currentItem._id, label: currentItem.business_name }
          ));
        }
        setContactsData({ ...contactsData, fetching: false, data: responseData });
      }
    };

    const koGetContacts = (error, requestId) => {
      if (contactRequestIdRef.current === requestId) {
        setContactsData({ ...contactsData, fetching: false, data: [] });
        throw error;
      }
    };

    const filters = {
      paginate: 5,
      page: 1,
    };
    if (contactsData.filter.length > 0) filters['??^business_name'] = contactsData.filter;
    contactService.getList(
      filters,
      (res) => okGetContacts(res, contactsData.requestId),
      (err) => koGetContacts(err, contactsData.requestId),
    );
  };

  const toggleSelectAllRows = (event) => {
    const newState = { ...state };
    const isChecked = event.target.checked;
    if (isChecked === true && Array.isArray(tableData.data) && tableData.data.length > 0) {
      newState.selectedItems = tableData.data.map((currentItem) => currentItem._id);
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

  const isRowSelected = (itemId) => (
    state.selectedItems.findIndex((current) => current === itemId) > -1
  );

  const processData = (currentTableData) => {
    const filters = {};
    if (currentTableData.search.length > 0) filters['^name'] = currentTableData.search;
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
        const mappedData = response.data.map((item) => ({
          _id: item._id,
          name: item.name,
          business_name: item.contact.business_name,
        }));
        setTableData({ ...newTableData, ...{ data: mappedData } });
      },
      () => {
        setTableData({ ...tableData }, { ...{ data: [] } });
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

  const onChangeFilter = (value) => {
    const newTableData = { ...tableData };
    newTableData.search = value;
    setTableData(newTableData);
  };

  const onChangeCreationModel = (event) => {
    const newCreationModel = { ...creationModel };
    newCreationModel[event.target.name] = event.target.value;
    setCreationModel(newCreationModel);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newTableData = { ...tableData };
    newTableData.paginate = queryParams.get('paginate') || 10;
    newTableData.page = queryParams.get('page') || 1;
    newTableData.order = queryParams.get('order') || 'asc';
    newTableData.sort = queryParams.get('sort') || 'name';
    newTableData.search = queryParams.get('search') || '';
    newTableData.data = null;
    setTableData(newTableData);
    const mappedQueryParams = dataToQueryParams(newTableData);
    if (tableData.page !== newTableData.page
    || tableData.paginate !== newTableData.paginate
    || tableData.order !== newTableData.order
    || tableData.sort !== newTableData.sort
    || tableData.paginate !== newTableData.paginate
    || tableData.search !== newTableData.search
    ) {
      navigate(`/tours${mappedQueryParams}`, { replace: true });
    }
    processData(newTableData);
  }, [location]);

  useEffect(() => {
    if (contactsData.fetching === true) {
      loadContacts();
    }
  }, [contactsData]);

  const columns = [
    {
      key: 'select',
      label: <CFormCheck
        disabled={
          tableData.data === null
          || (Array.isArray(tableData.data) && tableData.data.length <= 0)
        }
        checked={(Array.isArray(tableData.data) && tableData.data.length > 0
          && tableData.data.length === state.selectedItems.length
        )}
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
    if (Array.isArray(tableData.data) && tableData.data.length > 0) {
      return tableData.data.map((item) => ({
        _id: item._id,
        select: (
          <CFormCheck
            checked={isRowSelected(item._id)}
            onChange={(event) => toggleSelectRow(event, item._id)}
          />
        ),
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
    if (tableData.data !== null) {
      event.preventDefault();
      const newTableData = { ...tableData };
      switch (event.nativeEvent.submitter.name) {
        case 'reset':
          newTableData.search = '';
          newTableData.data = null;
          break;
        default:
          break;
      }
      newTableData.page = 1;
      setState({ selectedItems: [] });
      setTableData(newTableData);
    }
  };

  const handleCreateNew = (event) => {
    if (showCreateModal === true && creationAction.executing === false) {
      event.preventDefault();
      setCreationAction({ error: null, executing: true });
      const tourService = new TourService();
      const tourData = { ...creationModel };
      tourData.contact_id = tourData.contact_id.value;
      tourService.addItem(
        tourData,
        (response) => {
          setCreationAction({ ...creationAction, executing: false });
          console.log('tourService.addItem response');
          console.log(response);
        },
        (error) => {
          setCreationAction({ error, executing: false });
        },
      );
    }
  };

  const showCreationModalAndClearModel = () => {
    setCreationModel({});
    setCreationAction({ error: null, executing: false });
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    loadContacts();
  };

  const handleContactFilter = (value) => {
    const newContactsData = { ...contactsData };
    if (newContactsData.filter !== value) {
      newContactsData.filter = value;
      if (value.length > 2 || value.length === 0) {
        newContactsData.requestId = uuidv4();
        newContactsData.fetching = true;
        contactRequestIdRef.current = newContactsData.requestId;
      }
      setContactsData(newContactsData);
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
                disabled={tableData.data === null}
                type="text"
                id="list-filter"
                name="list-filter"
                placeholder="Inserisci le parole chiave"
                aria-label="Filtro"
                aria-describedby="filter-button"
                value={tableData.search}
                onChange={(event) => onChangeFilter(event.target.value)}
              />
              <CButton disabled={tableData.data === null} type="submit" name="filter" color="primary" id="filter-button">Filtra</CButton>
              <CButton disabled={tableData.data === null || tableData.search.length <= 0} type="submit" name="reset" color="danger" id="filter-button">Cancella</CButton>
            </CInputGroup>
          </CForm>
        </CCol>
        <CCol md={12} lg={6} className="list-actions mt-2">
          <CButton color="primary" disabled={tableData.data === null} onClick={() => showCreationModalAndClearModel()}>
            <CIcon icon={cilPlus} className="icon-button" />
            Nuovo
          </CButton>
          <CButton color="primary" disabled={tableData === null || state.selectedItems.length !== 1} onClick={() => (state.selectedItems[0]) && editItem(state.selectedItems[0])}>
            <CIcon icon={cilPencil} className="icon-button" />
            Modifica
          </CButton>
          <CButton color="primary" disabled={tableData.data === null || state.selectedItems.length === 0} onClick={() => setShowDeleteModal(true)}>
            <CIcon icon={cilTrash} className="icon-button" />
            Elimina
          </CButton>
          <CButton color="primary" disabled={tableData.data === null}>
            <CIcon icon={cilFile} className="icon-button" />
            Esporta
          </CButton>
        </CCol>
      </CRow>
      <AppTable
        columns={columns}
        items={renderTableData()}
        loading={tableData.data === null}
        orderBy={tableData.order}
        sortBy={tableData.sort}
        onChangeOrderSort={onChangeOrderSort}
        rowAction={editItem}
      />
      <Pagination
        tableData={tableData}
        setSelectedItems={setState}
        setTableData={setTableData}
      />
      <CModal size="xl" backdrop="static" visible={showCreateModal}>
        <CModalHeader closeButton={false}>
          <CModalTitle>Creare un nuovo Tour</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm id="creationForm" onSubmit={(e) => handleCreateNew(e)}>
            {creationAction?.error?.data?.message && (
              <CRow>
                <CCol>
                  <CAlert color="danger" dismissible>
                    <CAlertHeading tag="h4">Errore nella creazione tour</CAlertHeading>
                    <p>{creationAction?.error?.data?.message}</p>
                  </CAlert>
                </CCol>
              </CRow>
            )}
            <CRow>
              <CCol md={6}>
                <CFormInput
                  disabled={creationAction.executing === true}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="es. Tour degli ulivi"
                  label="Nome del tour"
                  value={creationModel?.name || ''}
                  onChange={onChangeCreationModel}
                />
              </CCol>
              <CCol md={6}>
                <Autocomplete
                  dynamic
                  label="Contatto"
                  name="contact_id"
                  value={creationModel.contact_id}
                  options={contactsData.data}
                  loading={contactsData.fetching}
                  onChange={onChangeCreationModel}
                  onFilter={handleContactFilter}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton disabled={creationAction.executing === true} color="danger" onClick={() => closeCreateModal()}>
            Annulla
          </CButton>
          <CButton type="submit" form="creationForm" disabled={creationAction.executing === true} color="primary">Crea</CButton>
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
