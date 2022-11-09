import React, { useEffect, useState } from 'react'
import { CCol, CContainer, CForm, CFormInput, CPagination, CPaginationItem, CRow, CTable } from '@coreui/react'
import { Link } from 'react-router-dom'

import TourService from 'src/services/api/tourService'
import AppList from 'src/components/list/AppList'

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

  if (!data) return <p>Loading...</p>
  
  return (
    <>
      <h1>Lista Tour</h1>
      <CContainer>
        <CForm>
          <CRow>
            <CCol>
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              label="Nome tour"
              placeholder="Inserisci nome del tour"
              onChange={(e) => {
                console.log(e.target.value)
              }}  
            />
            </CCol>
          </CRow>
        </CForm>
      </CContainer>
      <CTable striped bordered columns={columns} items={data} />
    </>
  );
}
export default ToursList
