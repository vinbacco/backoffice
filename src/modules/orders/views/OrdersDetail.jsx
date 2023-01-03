/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable dot-notation */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import {
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
  CButton,
} from '@coreui/react';

// SERVICES
import OrdersService from 'src/services/api/OrdersService';
import composeErrorFormType from 'src/utils/composeErrorFormType';

// COMPONENTS
import AppDetail from 'src/components/ui/Detail/AppDetail';
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

  const formatModel = (response) => {
    const responseData = { ...response.data };
    const invoiceData = responseData.invoice_data;
    setValue('user_name', `${invoiceData?.first_name || ''}${invoiceData?.last_name ? ` ${invoiceData?.last_name}` : ''}`);
    setValue('user_email', invoiceData.email || '-');
    setValue('user_phone', invoiceData.phone || '-');
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
    if (id !== null && typeof id !== 'undefined') {
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

  const handleOrderProductAction = (accept, childId, selectedVariant = null) => {
    const savePromise = new Promise((resolve, reject) => {
      const okEditCallback = (response) => {
        setState({ ...state, loading: false, model: formatModel(response) });
        resolve();
      };

      const koEditCallback = (response) => {
        setState({ loading: false, error: response?.error });
        reject();
      };

      if (accept) {
        ordersService.acceptOrderProductVariant(
          {
            orderId: state.model['_id'],
            childId,
            selectedVariant,
          },
          okEditCallback,
          koEditCallback,
        );
      } else {
        ordersService.rejectOrderProductVariant(
          {
            orderId: state.model['_id'],
            childId,
          },
          okEditCallback,
          koEditCallback,
        );
      }
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

  if (state?.loading === true) return <AppLoadingSpinner />;

  return (
    <AppDetail
      actions={false}
      name="Dettaglio della prenotazione"
      tabsHeaders={[
        {
          index: 'user-tab',
          label: 'DATI UTENTE',
        },
        {
          index: 'tour-tab',
          label: 'DATI PRENOTAZIONI',
        },
      ]}
      tabsContents={[
        {
          index: 'user-tab',
          content: (
            <CRow>
              <CCol md={12}>
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
                      </CCol>
                    </CRow>
                  </CForm>
                </section>
              </CCol>
            </CRow>
          ),
        },
        {
          index: 'tour-tab',
          content: (
            <>
              <CRow className="mb-2">
                <CCol>
                  <h2>Prenotazioni del utente</h2>
                </CCol>
              </CRow>
              {state?.model?.products && state?.model?.products.map((currentProduct) => (
                <CRow className="mb-4" key={currentProduct.name}>
                  <CCol>
                    <h4>{currentProduct.name}</h4>
                    <CRow>
                      <CCol md={6} sm={12}>
                        <p>
                          <b>Quantità di persone: </b>
                          {currentProduct.product_quantity || 0}
                        </p>
                        <p>
                          <b>Pacchetto scelto: </b>
                          TO DO!
                        </p>
                        <p>
                          <b>Prezzo: </b>
                          TO DO!
                        </p>
                      </CCol>
                      <CCol md={6} sm={12}>
                        <h6>Orari scelti</h6>
                        {currentProduct?.variants &&
                          currentProduct?.variants?.datetimes &&
                          currentProduct.variants.datetimes.map((currentVariant) => (
                            <CRow className="mb-4 align-items-center" key={currentVariant}>
                              <CCol md={6}>
                                {format(new Date(currentVariant), 'dd/MM/yyyy HH:mm')}
                              </CCol>
                              <CCol md={6} className="text-align-end">
                                <CButton color="success" onClick={() => handleOrderProductAction(true, currentProduct.child_id, currentVariant)}>
                                  {'Approvare per quest\'orario'}
                                </CButton>
                              </CCol>
                            </CRow>
                          ))}
                        <CRow className="mb-4">
                          <CCol className="text-align-end">
                            <CButton color="danger" onClick={() => handleOrderProductAction(false, currentProduct.child_id)}>Rifiutare la prenotazione</CButton>
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
                    <hr />
                  </CCol>
                </CRow>
              ))}
            </>
          ),
        },
      ]}
    />
  );
};

export default OrdersDetail;
