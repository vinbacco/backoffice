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

import ProductCategoriesService from 'src/services/api/ProductCategoriesService'

const ProductCategoriesList = () => {
  const [data, setData] = useState(null);
  const [paginate, setPaginate] = useState(10);
  const [page, setPage] = useState(1);

  // /backoffice/products?paginate=10&page=1&lookup=%5Bcontact_id,product_category_id%5D&%5Ename=Tour%20Bolgheri&??^contact-business_name=vai
  const columns = [
    {
      key: 'nome',
      label: 'Nome',
      _props: { scope: 'col' },
    },
    {
      key: 'tipo',
      label: 'Tipo Prodotto',
      _props: { scope: 'col' },
    }
  ];
  
  const processData = (paginate = 10, page = 1, filters) => {
    const productCategoriesService = new ProductCategoriesService();
    productCategoriesService.getList(
      paginate,
      page,
      filters,
      (response) => {
        setData(response.data.map((item) => {
          return ({
            nome: item.name,
            tipo: item.product_type.name,
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
      <h1>Lista Categorie</h1>
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
                label="Nome"
                placeholder="Inserisci nome"
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
export default ProductCategoriesList;
