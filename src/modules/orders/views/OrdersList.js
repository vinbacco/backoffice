import React, { useEffect, useState } from 'react';
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
} from '@coreui/react';
import { Link } from 'react-router-dom';

import OrderService from 'src/services/api/OrderService';
import AppLoadingSpinner from 'src/components/ui/AppLoadingSpinner';

function OrdersList() {
  const [data, setData] = useState(null);
  const [paginate, setPaginate] = useState(10);
  const [page, setPage] = useState(1);

  // /backoffice/products?paginate=10&page=1&lookup=%5Bcontact_id,product_category_id%5D&%5Ename=Tour%20Bolgheri&??^contact-business_name=vai
  const columns = [
    {
      key: 'nr',
      label: 'Numero Ordine',
      _props: { scope: 'col' },
    },
    {
      key: 'prodotti',
      label: 'Prodotti',
      _props: { scope: 'col' },
    },
  ];

  const processData = (paginate = 10, page = 1, filters) => {
    const orderService = new OrderService();
    orderService.getList(
      paginate,
      page,
      filters,
      (response) => {
        setData(response.data.map((item) => ({
          nr: item.order_number || 'Pending',
          prodotti: item.products[0].name,
          _cellProps: { id: { scope: 'row' } },
        })));
      },
      (response) => { setData(response.data); },
    );
  };

  useEffect(() => {
    if (!data) {
      processData();
    }
  }, [data]);

  if (!data) return <AppLoadingSpinner />;

  return (
    <>
      <h1>Lista Ordini</h1>
      <CContainer>
        <CForm onSubmit={(e) => {
          e.preventDefault();
          processData(
            undefined,
            undefined,
            { '^product.name': e.currentTarget[0].value },
          );
        }}
        >
          <CRow>
            <CCol>
              <CFormInput
                type="text"
                name="name"
                id="exampleFormControlInput1"
                label="Nr. Ordine"
                placeholder="Inserisci nr. ordine"
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
export default OrdersList;
