/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
  CBadge,
  CCol,
  CFormInput,
  CRow,
} from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';

import OrdersService from 'src/services/api/OrdersService';
import AppList from 'src/components/ui/List/AppList';
import composeErrorFormType from 'src/utils/composeErrorFormType';

function OrdersList() {
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const buildColumnsFn = () => [
    {
      key: 'user_name',
      label: 'Nome e Cognome',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'date',
      label: 'Data tour',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'tour_name',
      label: 'Nome tour',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'guests',
      label: 'Numero di persone',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'price_person',
      label: 'Totale a persona',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'user_email',
      label: 'Email',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'user_phone',
      label: 'Telefono',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'order_status',
      label: 'Stato',
      sortable: true,
      _props: { scope: 'col' },
    },
  ];

  const buildRowsFn = (item) => ({
    _id: item._id,
    user_name: item.name,
    date: item.date,
    tour_name: item.tour_name,
    guests: item.guests,
    price_person: item.price_person,
    user_email: item.user_email,
    user_phone: item.user_phone,
    order_status: (
      <CBadge color={item.order_status.color}>{item.order_status.label}</CBadge>
    ),
  });

  const mapListFn = (item) => {
    const tourData = item.products[0];
    const orderStatus = {
      label: 'In lavorazione',
      color: 'warning',
    };
    if (item.status === 'completed') {
      orderStatus.label = 'Completato';
      orderStatus.color = 'success';
    }
    if (item.status === 'rejected') {
      orderStatus.label = 'Rifiutato';
      orderStatus.color = 'danger';
    }

    const tourDate = '-';
    console.log(tourData.variants);
    return ({
      _id: item._id,
      name: item.user?.name || '-',
      date: tourDate,
      tour_name: tourData.name,
      guests: tourData.product_quantity,
      price_person: tourData.base_price,
      user_email: item.invoice_data?.email || '-',
      user_phone: item.invoice_data?.phone || '-',
      order_status: orderStatus,
    });
  };

  const creationBodyFn = () => (
    <CRow md={{ cols: 2, gutter: 2 }}>
      <CCol md={6}>
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.name}
              feedback={errors?.name ? composeErrorFormType(errors.name) : null}
              type="text"
              id="region-name"
              label="Regione"
              placeholder="Inserisci regione"
              {...field}
            />
          )}
        />
      </CCol>
    </CRow>
  );

  return (
    <section id="orders">
      <AppList
        scrollable
        sectionId="orders"
        sectionTitle="Lista Prenotazioni"
        SectionServiceClass={OrdersService}
        sectionPath="/orders"
        mapListFn={mapListFn}
        buildColumnsFn={buildColumnsFn}
        buildRowsFn={buildRowsFn}
        creationTitle="Nuova prenotazione"
        creationBodyFn={() => creationBodyFn()}
        evalCreation={handleSubmit}
        clearCreationModel={() => reset({})}
      />
    </section>
  );
}
export default OrdersList;
