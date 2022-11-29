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
import ContactCategoriesService from 'src/services/api/ContactCategoriesService';
import AppBaseDetail from 'src/components/ui/Detail/AppBaseDetail';
import AppLoadingSpinner from 'src/components/ui/AppLoadingSpinner';
import composeErrorFormType from 'src/utils/composeErrorFormType';

const ContactCategoriesDetail = () => {
  const { id } = useParams();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      code: '',
    },
  });
  const [state, setState] = useState({
    loading: true,
    model: null,
  });

  const contactCategoriesService = new ContactCategoriesService();

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

      contactCategoriesService.updateItem(state.model['_id'], data, okEditCallback, koEditCallback);
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

      contactCategoriesService.getItem(id, okGetCallback, koGetCallback);
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
      type="categoria contatto"
      saveAction={handleSubmit(onSubmit)}
      resetAction={handleReset}
    >
      <section id="contact-categories-detail">
        <CForm
          className="row g-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CRow className="mt-3">
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
                    id="contact-category-name"
                    label="Nome"
                    placeholder="Inserisci nome"
                    {... field}
                  />
                )}
              />
            </CCol>
            <CCol md={6}>
              <Controller
                name="category_name"
                control={control}
                rules={{ required: true }}
                defaultValue=""
                render={({ field }) => (
                  <CFormInput
                    invalid={!!errors.category_name}
                    feedback={errors?.category_name
                      ? composeErrorFormType(errors.category_name)
                      : null}
                    type="text"
                    id="contact-category-category_name"
                    label="Categoria contatto"
                    placeholder="Inserisci categoria contatto"
                    {... field}
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

export default ContactCategoriesDetail;
