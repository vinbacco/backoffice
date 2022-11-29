/* eslint-disable dot-notation */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import {
  CForm,
  CRow,
  CCol,
  CFormInput,
  CAlert,
  CAlertHeading,
} from '@coreui/react';
// SERVICES
import FeedsService from 'src/services/api/FeedsService';
import AppBaseDetail from 'src/components/ui/Detail/AppBaseDetail';
import AppLoadingSpinner from 'src/components/ui/AppLoadingSpinner';

const ProductTypeDetail = () => {
  const { id } = useParams();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      name: '',
    },
  });
  const [state, setState] = useState({
    loading: true,
    model: null,
  });

  const feedsService = new FeedsService();

  const onSubmit = (data) => {
    const savePromise = new Promise((resolve, reject) => {
      const okEditCallback = (response) => {
        setState({ loading: false, model: { ...response.data } });
        resolve();
      };

      const koEditCallback = (response) => {
        setState({ loading: false, error: response?.error });
        reject();
      };

      feedsService.updateItem(state.model['_id'], data, okEditCallback, koEditCallback);
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

  const handleReset = () => {
    reset({ name: state.model?.name, code: state.model?.code });
  };

  useEffect(() => {
    if (id) {
      const okGetCallback = (response) => {
        setValue('name', response.data.name);
        setState({ ...state, loading: false, model: { ...response.data } });
      };

      const koGetCallback = (error) => {
        const errorMessage = error?.data?.message || 'Nessun errore';
        setState({ ...state, loading: false, error: errorMessage });
        throw new Error(errorMessage);
      };

      feedsService.getItem(id, okGetCallback, koGetCallback);
    }
  }, [id]);

  if (state.loading === true) return <AppLoadingSpinner />;

  if (state.error) {
    return (
      <CAlert color="danger">
        <CAlertHeading tag="h4">Si è verificato un errore!</CAlertHeading>
        <p>{state.error}</p>
      </CAlert>
    );
  }

  return (
    <AppBaseDetail
      type="tipologia prodotto"
      saveAction={handleSubmit(onSubmit)}
      resetAction={handleReset}
    >
      <section id="product-type-detail">
        <CForm
          className="row g-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CRow>
            <CCol md={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <CFormInput
                    label="Nome"
                    {...field}
                  />
                )}
              />
            </CCol>
            <div className="mb-3" />
          </CRow>
        </CForm>
      </section>
    </AppBaseDetail>
  );
};

export default ProductTypeDetail;
