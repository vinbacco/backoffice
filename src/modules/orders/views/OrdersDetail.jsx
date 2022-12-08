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
    setState({ ...state, loading: false, model: { ...responseData } });
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
            <CCol md={8} sm={12}>
              <CRow className="mb-3">
                <CCol>
                  DATA
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
