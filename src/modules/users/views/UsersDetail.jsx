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
import UsersService from 'src/services/api/UsersService';
import AppBaseDetail from 'src/components/ui/Detail/AppBaseDetail';
import composeErrorFormType from 'src/utils/composeErrorFormType';
import AppLoadingSpinner from 'src/components/ui/AppLoadingSpinner';

const UsersDetail = () => {
  const { id } = useParams();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
    },
  });
  const [state, setState] = useState({
    loading: true,
    model: null,
  });

  const usersService = new UsersService();

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

      usersService.updateItem(state.model['_id'], data, okEditCallback, koEditCallback);
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
    reset({ first_name: state.model?.first_name, last_name: state.model?.last_name });
  };

  useEffect(() => {
    if (id) {
      const okGetCallback = (response) => {
        setValue('first_name', response.data.first_name);
        setValue('last_name', response.data.last_name);
        setState({ ...state, loading: false, model: { ...response.data } });
      };

      const koGetCallback = (error) => {
        const errorMessage = error?.data?.message || 'Nessun errore';
        setState({ ...state, loading: false, error: errorMessage });
        throw new Error(errorMessage);
      };

      usersService.getItem(id, okGetCallback, koGetCallback);
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
      type="utente"
      saveAction={handleSubmit(onSubmit)}
      resetAction={handleReset}
    >
      <section id="users-detail">
        <CForm
          className="row g-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CRow>
            <CCol md={6}>
              <Controller
                name="first_name"
                control={control}
                rules={{ required: true }}
                defaultValue=""
                render={({ field }) => (
                  <CFormInput
                    invalid={!!errors.first_name}
                    feedback={errors?.first_name ? composeErrorFormType(errors.first_name) : null}
                    type="text"
                    id="user-first_name"
                    label="Nome utente"
                    placeholder="Inserisci nome utente"
                    {... field}
                  />
                )}
              />
            </CCol>
            <CCol md={6}>
              <Controller
                name="last_name"
                control={control}
                rules={{ required: true }}
                defaultValue=""
                render={({ field }) => (
                  <CFormInput
                    invalid={!!errors.last_name}
                    feedback={errors?.last_name ? composeErrorFormType(errors.last_name) : null}
                    type="text"
                    id="user-last_name"
                    label="Cognome utente"
                    placeholder="Inserisci cognome utente"
                    {... field}
                  />
                )}
              />
            </CCol>
          </CRow>
        </CForm>
      </section>
    </AppBaseDetail>
  );
};

export default UsersDetail;
