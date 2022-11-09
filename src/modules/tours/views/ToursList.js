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
} from '@coreui/react'
import { Link } from 'react-router-dom'

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
  const [paginate, setPaginate] = useState(10);
  const [page, setPage] = useState(1);

  const columns = [
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
  
  const processData = (paginate = 10, page = 1, filters) => {
    const tourService = new TourService();
    tourService.getList(
      paginate,
      page,
      filters,
      (response) => {
        setData(response.data.map((item) => {
          return ({
            nome: item.name,
            cantina: item.contact.business_name,
            _cellProps: { id: { scope: 'row' } },
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

  if (!data) return <AppLoadingSpinner />

  return (
    <>
      <h1>Lista Tour</h1>
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
          <CRow>
            <CCol>
              <CFormInput
                type="text"
                name="name"
                id="exampleFormControlInput1"
                label="Nome tour"
                placeholder="Inserisci nome del tour"
              />
            </CCol>
          </CRow>
          <CRow>  
            <CCol>
              <CButton type="submit">
                Filtra
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CContainer>
      <CTable striped bordered columns={columns} items={data} />
    </>
  );
}
export default ToursList
