/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable dot-notation */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import {
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
} from '@coreui/react';
// SERVICES
import OrdersService from 'src/services/api/OrdersService';
import composeErrorFormType from 'src/utils/composeErrorFormType';
// COMPONENTS
import AppBaseDetail from 'src/components/ui/Detail/AppBaseDetail';
import AppLoadingSpinner from 'src/components/ui/AppLoadingSpinner';

const OrdersDetail = () => {
  const { id } = useParams();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [state, setState] = useState({
    loading: true,
    model: null,
  });

  const ordersService = new OrdersService();

  const handleReset = () => {
    reset({ ...state.model });
  };

  const formatModel = (response) => {
    const responseData = { ...response.data };
    console.log(responseData);
    const invoiceData = responseData.invoice_data;
    const tourData = responseData.products[0];
    const contactData = tourData.contact;
    setValue('user_name', responseData.user?.name || '');
    setValue('user_email', invoiceData.email || '');
    setValue('user_phone', invoiceData.phone || '');
    setValue('tour_date', `${tourData.variants.date}, ${tourData.variants.time[0]} - ${tourData.variants.time[1]}`);
    setValue('tour_quantity', tourData.product_quantity || '');
    setValue('tour_price', invoiceData.phone || '');
    setValue('tour_name', invoiceData.phone || '');
    setValue('tour_package', invoiceData.phone || '');
    setValue('tour_contact', invoiceData.phone || '');
    return responseData;
  };

  const onSubmit = (data) => {
    const savePromise = new Promise((resolve, reject) => {
      const okEditCallback = (response) => {
        setState({ ...state, loading: false, model: formatModel(response) });
        resolve();
      };

      const koEditCallback = (response) => {
        setState({ loading: false, error: response?.error });
        reject();
      };

      ordersService.updateItem(state.model['_id'], data, okEditCallback, koEditCallback);
    });

    toast.promise(savePromise, {
      loading: 'Attendere, salvando le modifiche...',
      success: 'Dato modificato con successo!',
      error: 'Ops, si è verificato un errore!',
    }, {
      success: {
        duration: 5000,
      },
      error: {
        duration: 5000,
      },
    });
  };

  useEffect(() => {
    if (id) {
      const okGetCallback = (response) => {
        setState({ ...state, loading: false, model: formatModel(response) });
      };

      const koGetCallback = (error) => {
        const errorMessage = error?.data?.message || 'Nessun errore';
        setState({ ...state, loading: false, error: errorMessage });
        throw new Error(errorMessage);
      };
      ordersService.getItem(id, okGetCallback, koGetCallback);
    }
  }, [id]);

  if (state?.loading === true) return <AppLoadingSpinner />;

  return (
    <AppBaseDetail
      type="prenotazione"
      saveAction={handleSubmit(onSubmit)}
      resetAction={handleReset}
    >
      <section id="orders-detail">
        <CForm
          className="row g-3 mt-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CRow className="mb-3">
            <CCol md={12} sm={12}>
              <CRow className="mb-3">
                <CCol>
                  <Controller
                    name="user_name"
                    control={control}
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <CFormInput
                        readOnly
                        invalid={!!errors.user_name}
                        feedback={
                            errors?.user_name
                              ? composeErrorFormType(errors.user_name)
                              : null
                        }
                        type="text"
                        id="order-user_name"
                        label="Nome utente"
                        placeholder="Inserisci nome utente"
                        {... field}
                      />
                    )}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <Controller
                    name="user_email"
                    control={control}
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <CFormInput
                        readOnly
                        invalid={!!errors.user_email}
                        feedback={
                            errors?.user_email
                              ? composeErrorFormType(errors.user_email)
                              : null
                        }
                        type="email"
                        id="order-user_email"
                        label="Email utente"
                        placeholder="Inserisci email utente"
                        {... field}
                      />
                    )}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <Controller
                    name="user_phone"
                    control={control}
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <CFormInput
                        readOnly
                        invalid={!!errors.user_phone}
                        feedback={
                            errors?.user_phone
                              ? composeErrorFormType(errors.user_phone)
                              : null
                        }
                        type="text"
                        id="order-user_phone"
                        label="Telefono utente"
                        placeholder="Inserisci telefono utente"
                        {... field}
                      />
                    )}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <Controller
                    name="tour_date"
                    control={control}
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <CFormInput
                        readOnly
                        invalid={!!errors.tour_date}
                        feedback={
                            errors?.tour_date
                              ? composeErrorFormType(errors.tour_date)
                              : null
                        }
                        type="text"
                        id="order-tour_date"
                        label="Data tour"
                        placeholder="Inserisci data tour"
                        {... field}
                      />
                    )}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <Controller
                    name="tour_quantity"
                    control={control}
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <CFormInput
                        readOnly
                        invalid={!!errors.tour_quantity}
                        feedback={
                            errors?.tour_quantity
                              ? composeErrorFormType(errors.tour_quantity)
                              : null
                        }
                        type="text"
                        id="order-tour_quantity"
                        label="Numero di persone"
                        placeholder="Inserisci numero di persone"
                        {... field}
                      />
                    )}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <Controller
                    name="tour_price"
                    control={control}
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <CFormInput
                        readOnly
                        invalid={!!errors.tour_price}
                        feedback={
                            errors?.tour_price
                              ? composeErrorFormType(errors.tour_price)
                              : null
                        }
                        type="text"
                        id="order-tour_price"
                        label="Prezzo tour"
                        placeholder="Inserisci prezzo tour"
                        {... field}
                      />
                    )}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <Controller
                    name="tour_name"
                    control={control}
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <CFormInput
                        readOnly
                        invalid={!!errors.tour_name}
                        feedback={
                            errors?.tour_name
                              ? composeErrorFormType(errors.tour_name)
                              : null
                        }
                        type="text"
                        id="order-tour_name"
                        label="Nome tour"
                        placeholder="Inserisci nome tour"
                        {... field}
                      />
                    )}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <Controller
                    name="tour_package"
                    control={control}
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <CFormInput
                        readOnly
                        invalid={!!errors.tour_package}
                        feedback={
                            errors?.tour_package
                              ? composeErrorFormType(errors.tour_package)
                              : null
                        }
                        type="text"
                        id="order-tour_package"
                        label="Pacchetto scelto"
                        placeholder="Inserisci pacchetto scelto"
                        {... field}
                      />
                    )}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <Controller
                    name="tour_contact"
                    control={control}
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field }) => (
                      <CFormInput
                        readOnly
                        invalid={!!errors.tour_contact}
                        feedback={
                            errors?.tour_contact
                              ? composeErrorFormType(errors.tour_contact)
                              : null
                        }
                        type="text"
                        id="order-tour_contact"
                        label="Nome cantina"
                        placeholder="Inserisci nome cantina"
                        {... field}
                      />
                    )}
                  />
                </CCol>
              </CRow>
            </CCol>
          </CRow>
        </CForm>
      </section>
    </AppBaseDetail>
  );
};

export default OrdersDetail;
