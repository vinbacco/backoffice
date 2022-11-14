/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-underscore-dangle */
/** eslint-disable react/prop-types  */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
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

import AppTable from 'src/components/ui/List/AppTable';
import Pagination from 'src/components/ui/List/Pagination';
import dataToQueryParams from 'src/utils/dataToQueryParams';

function AppList({
  SectionServiceClass,
  sectionPath,
  creationTitle,
  mapListFn,
  buildColumnsFn,
  buildRowsFn,
  creationModel,
  creationBodyFn,
  clearCreationModel,
  evalCreation,
}) {
  const sectionService = new SectionServiceClass();
  const location = useLocation();
  const [state, setState] = useState({ selectedItems: [] });
  const [creationAction, setCreationAction] = useState({ error: null, executing: false });
  const { control, handleSubmit } = useForm({
    defaultValues: {
      listFilter: '',
    },
  });
  const initialTableData = {
    paginate: null,
    page: null,
    total: 0,
    order: null,
    sort: null,
    search: null,
    data: null,
  };
  const [tableData, setTableData] = useState(initialTableData);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

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
    if (typeof currentTableData.search === 'string' && currentTableData.search.length > 0) filters['^name'] = currentTableData.search;
    const newTableData = { ...currentTableData };
    sectionService.getList(
      currentTableData.paginate,
      currentTableData.page,
      currentTableData.order,
      currentTableData.sort,
      filters,
      (response) => {
        newTableData.total = parseInt(response?.headers?.total || 0, 10);
        const mappedData = response.data.map(mapListFn);
        setTableData({ ...newTableData, ...{ data: mappedData } });
      },
      () => {
        setTableData({ ...tableData }, { ...{ data: [] } });
      },
    );
  };

  const onChangeOrderSort = (value) => {
    const newTableData = { ...tableData, ...value };
    newTableData.page = 1;
    newTableData.data = null;
    setTableData(newTableData);
    setState({ selectedItems: [] });
  };

  // const onChangeFilter = (value) => {
  //   const newTableData = { ...tableData };
  //   newTableData.search = value;
  //   newTableData.data = null;
  //   setTableData(newTableData);
  // };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newTableData = { ...tableData };
    let mustRelocate = false;
    const currentParams = {
      paginate: queryParams.get('paginate'),
      page: queryParams.get('page'),
      order: queryParams.get('order'),
      sort: queryParams.get('sort'),
      search: queryParams.get('search'),
    };

    if (currentParams.paginate !== null) {
      currentParams.paginate = parseInt(currentParams.paginate, 10);
    }
    if (currentParams.page !== null) {
      currentParams.page = parseInt(currentParams.page, 10);
    }

    if (currentParams.search === null) {
      currentParams.search = '';
    }

    if (tableData.paginate === null) {
      if (currentParams.paginate !== null) newTableData.paginate = currentParams.paginate;
      else newTableData.paginate = 10;
    }
    if (currentParams.paginate !== newTableData.paginate) {
      currentParams.paginate = newTableData.paginate;
      if (mustRelocate === false) mustRelocate = true;
    }

    if (tableData.page === null) {
      if (currentParams.page !== null) newTableData.page = currentParams.page;
      else newTableData.page = 1;
    }
    if (currentParams.page !== newTableData.page) {
      currentParams.page = newTableData.page;
      if (mustRelocate === false) mustRelocate = true;
    }

    if (tableData.order === null) {
      if (currentParams.order !== null) newTableData.order = currentParams.order;
      else newTableData.order = 'asc';
    }
    if (currentParams.order !== newTableData.order) {
      currentParams.order = newTableData.order;
      if (mustRelocate === false) mustRelocate = true;
    }

    if (tableData.sort === null) {
      if (currentParams.sort !== null) newTableData.sort = currentParams.sort;
      else newTableData.sort = 'name';
    }
    if (currentParams.sort !== newTableData.sort) {
      currentParams.sort = newTableData.sort;
      if (mustRelocate === false) mustRelocate = true;
    }

    if (tableData.search === null) {
      if (currentParams.search !== null) newTableData.search = currentParams.search;
      else newTableData.search = '';
    }
    if (currentParams.search !== newTableData.search) {
      currentParams.search = newTableData.search;
      if (mustRelocate === false) mustRelocate = true;
    }

    if (mustRelocate) {
      const mappedQueryParams = dataToQueryParams(newTableData);
      navigate(`${sectionPath}${mappedQueryParams}`, { replace: true });
    }
    if (newTableData.data === null) processData(newTableData);
  }, [tableData.paginate, tableData.page, tableData.order, tableData.sort, tableData.search]);

  const columns = () => {
    const selectColumn = {
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
    };
    return [selectColumn].concat(buildColumnsFn());
  };

  const renderTableData = () => {
    if (Array.isArray(tableData.data) && tableData.data.length > 0) {
      return tableData.data.map((item) => {
        const selectColumn = {
          select: (
            <CFormCheck
              checked={isRowSelected(item._id)}
              onChange={(event) => toggleSelectRow(event, item._id)}
            />
          ),
        };
        const rowsData = buildRowsFn(item);
        return { ...selectColumn, ...rowsData };
      });
    }
    return [];
  };

  const editItem = (itemId) => {
    navigate(`${sectionPath}/${itemId}`);
  };

  const applyFilters = (data) => {
    if (tableData.data !== null) {
      const newTableData = { ...tableData };
      newTableData.page = 1;
      newTableData.search = `&??_^name=${data.listFilter}&OR??_^contact-business-name=${data.listFilter}`;
      newTableData.data = null;
      setState({ selectedItems: [] });
      setTableData(newTableData);
    }
  };

  const handleCreateNew = (event) => {
    if (evalCreation() === true) {
      if (showCreateModal === true && creationAction.executing === false) {
        event.preventDefault();
        setCreationAction({ error: null, executing: true });
        sectionService.addItem(
          creationModel,
          (response) => {
            setCreationAction({ ...creationAction, executing: false });
            navigate(`${sectionPath}/${response?.data?._id}`);
          },
          (error) => {
            setCreationAction({ error, executing: false });
          },
        );
      }
    }
  };

  const showCreationModalAndClearModel = () => {
    clearCreationModel();
    setCreationAction({ error: null, executing: false });
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  return (
    <>
      <h1 className="list-title">Lista Tour</h1>
      <CRow className="align-items-end mb-4">
        <CCol md={12} lg={6}>
          <CForm onSubmit={handleSubmit(applyFilters)}>
            <CFormLabel htmlFor="list-filter">Filtro</CFormLabel>
            <CInputGroup>
              <Controller
                name="listFilter"
                control={control}
                render={({ field }) => (
                  <CFormInput
                    {...field}
                    disabled={tableData.data === null}
                    type="text"
                    placeholder="Inserisci le parole chiave"
                    aria-label="Filtro"
                    aria-describedby="filter-button"
                  />
                )}
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
        columns={columns()}
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
          <CModalTitle>{creationTitle}</CModalTitle>
        </CModalHeader>
        <CModalBody>
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
          <CForm id="creationForm" onSubmit={(e) => handleCreateNew(e)}>
            {creationBodyFn()}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" disabled={creationAction.executing === true} onClick={() => closeCreateModal()}>
            Annulla
          </CButton>
          <CButton type="submit" disabled={creationAction.executing === true} form="creationForm" color="primary">Crea</CButton>
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

AppList.propTypes = {
  SectionServiceClass: PropTypes.func.isRequired,
  sectionPath: PropTypes.string.isRequired,
  mapListFn: PropTypes.func.isRequired,
  buildColumnsFn: PropTypes.func.isRequired,
  buildRowsFn: PropTypes.func.isRequired,
  creationTitle: PropTypes.string.isRequired,
  creationBodyFn: PropTypes.func,
  creationModel: PropTypes.any,
  evalCreation: PropTypes.func,
  clearCreationModel: PropTypes.func,
};

AppList.defaultProps = {
  creationBodyFn: null,
  creationModel: {},
  evalCreation: null,
  clearCreationModel: null,
};

export default AppList;
