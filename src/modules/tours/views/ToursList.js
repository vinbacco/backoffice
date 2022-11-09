import React, { useEffect, useState } from 'react'
import {
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
  CButton,
  CInputGroup,
  CFormLabel,
  CFormCheck,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilFile, cilPencil, cilPlus, cilTrash } from '@coreui/icons'

import TourService from 'src/services/api/tourService'
import AppList from 'src/components/list/AppList'
import AppLoadingSpinner from 'src/components/AppLoadingSpinner'

const ToursListToDo = () => {
  return (
    <AppList sectionName='tours'></AppList>
  )
}

const ToursList = () => {
  const [data, setData] = useState(null);
  const [state, setState] = useState({selectedItems: []});
  const [paginate, setPaginate] = useState(10);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const columns = [
    {
      key: 'select',
      label: <CFormCheck checked={Array.isArray(data) && data.length  === state.selectedItems.length } onChange={(event) => toggleSelectAllRows(event)} />,
      _style: { width: '1%' },
      _props: { scope: 'col' },
    },
    {
      key: 'nome',
      label: 'Nome',
      _props: { scope: 'col' },
    },
    {
      key: 'cantina',
      label: 'Cantina',
      _props: { scope: 'col' },
    }
  ];

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
        const listTotal = response?.headers?.total || 0;
        setTotal(listTotal);
        setData(response.data.map((item) => {
          return ({
            _id: item._id,
            name: item.name,
            business_name: item.contact.business_name,
          });
        }))
      },
      (response) => { setData(response.data) }
    );
  }

  useEffect(() => {
    if (!data) {
      processData();
    }
  }, [data]);

  const renderTableData = () => {
    return data.map((item) => ({
      _id: item._id,
      select: <CFormCheck checked={isRowSelected(item._id)} onChange={(event) => toggleSelectRow(event, item._id)} />,
      nome: item.name,
      cantina: item.business_name,
      _cellProps: { id: { scope: 'row' } },
    }))
  }

  if (!data) return <AppLoadingSpinner />

  return (
    <>
      <h1 className='list-title'>Lista Tour</h1>
      <CContainer>
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
          <CInputGroup className="mb-3">
            <CFormInput type="text" id="list-filter" name="list-filter" placeholder="Inserisci le parole chiave" aria-label="Filtro" aria-describedby="filter-button"/>
            <CButton type="submit" color="primary" id="filter-button">Filtra</CButton>
          </CInputGroup>
        </CForm>
      </CContainer>
      <CRow>
        <CCol className='list-actions'>
          <CButton color="primary"><CIcon icon={cilPlus} /> Nuovo</CButton>
          <CButton color="primary" disabled={state.selectedItems.length !== 1} ><CIcon icon={cilPencil} /> Modifica</CButton>
          <CButton color="primary" disabled={state.selectedItems.length === 0} ><CIcon icon={cilTrash} /> Elimina</CButton>
          <CButton color="primary"><CIcon icon={cilFile} /> Esporta</CButton>
        </CCol>
      </CRow>
      <CTable striped bordered columns={columns} items={renderTableData()} />
      <CRow className="align-items-center mb-5">
        <CCol>
          <CPagination>
            <CPaginationItem className={page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'} disabled={page === 1}>Pagina precedente</CPaginationItem>
            <CPaginationItem className={page === Math.ceil(total / paginate) ? 'cursor-not-allowed' : 'cursor-pointer'} disabled={page === Math.ceil(total / paginate)}>Pagina successiva</CPaginationItem>
          </CPagination>
        </CCol>
        <CCol className="text-end">
          Pagina {page} di {Math.ceil(total / paginate)} ({total} risultat{total === 1 ? 'o' : 'i'})
        </CCol>
      </CRow>
    </>
  );
}
export default ToursList
