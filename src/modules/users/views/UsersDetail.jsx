/* eslint-disable dot-notation */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
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
  CFormLabel,
  CButton,
} from '@coreui/react';
// SERVICES
import UsersService, { USER_GROUPS, getUserGroup } from 'src/services/api/UsersService';
import AppBaseDetail from 'src/components/ui/Detail/AppBaseDetail';
import composeErrorFormType from 'src/utils/composeErrorFormType';
import AppLoadingSpinner from 'src/components/ui/AppLoadingSpinner';

const UsersDetail = () => {
  const { id } = useParams();
  const {
    control,
    unregister,
    handleSubmit,
    setValue,
    getValues,
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
  const [changePassword, setChangePassword] = useState(false);

  const usersService = new UsersService();

  const onSubmit = (data) => {
    const savePromise = new Promise((resolve, reject) => {
      const okEditCallback = (response) => {
        setState({ loading: false, model: { ...response.data } });
        if (changePassword === true) {
          unregister('password');
          unregister('password_repeat');
          setChangePassword(false);
        }
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
    reset({
      first_name: state.model?.first_name,
      last_name: state.model?.last_name,
    });
  };

  useEffect(() => {
    if (id) {
      const okGetCallback = (response) => {
        setValue('first_name', response.data.first_name);
        setValue('last_name', response.data.last_name);
        setValue('email', response.data.email);
        setValue('user_group', getUserGroup(response.data.user_group));
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

  const toggleChangePassword = () => {
    const newChangePassword = !changePassword;
    if (newChangePassword === false) {
      unregister('password');
      unregister('password_repeat');
    }
    setChangePassword(newChangePassword);
  };

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
          className="row g-3 mt-3 mb-3"
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
            <CCol md={6}>
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                defaultValue=""
                render={({ field }) => (
                  <CFormInput
                    invalid={!!errors.email}
                    feedback={errors?.email ? composeErrorFormType(errors.email) : null}
                    type="email"
                    id="user-email"
                    label="Email"
                    placeholder="Inserisci email"
                    {... field}
                  />
                )}
              />
            </CCol>
            <CCol md={6}>
              <Controller
                name="user_group"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <>
                    <CFormLabel htmlFor="user-user_group">Tipologia permessi</CFormLabel>
                    <Select
                      inputId="user-user_group"
                      isClearable
                      defaultOptions
                      options={USER_GROUPS}
                      {...field}
                    />
                    {errors.user_group ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.user_group)}</div> : null}
                  </>
                )}
              />
            </CCol>
          </CRow>
          {changePassword === true && (
            <CRow className="mt-3 mb-3">
              <CCol md={6}>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  defaultValue=""
                  render={({ field }) => (
                    <CFormInput
                      invalid={!!errors.password}
                      feedback={errors?.password ? composeErrorFormType(errors.password) : null}
                      type="password"
                      id="user-password"
                      label="Password"
                      minLength={8}
                      placeholder="Inserisci password"
                      {... field}
                    />
                  )}
                />
              </CCol>
              <CCol md={6}>
                <Controller
                  name="password_repeat"
                  control={control}
                  rules={{
                    required: true,
                    validate: {
                      equalPassword: (v) => v === getValues().password,
                    },
                  }}
                  defaultValue=""
                  render={({ field }) => (
                    <CFormInput
                      invalid={!!errors.password_repeat}
                      feedback={errors?.password_repeat
                        ? composeErrorFormType(errors.password_repeat)
                        : null}
                      type="password"
                      id="user-password_repeat"
                      label="Ripete password"
                      placeholder="Ripete  password"
                      minLength={8}
                      {... field}
                    />
                  )}
                />
              </CCol>
            </CRow>
          )}
          <div className="d-grid gap-2">
            <CButton onClick={toggleChangePassword}>{changePassword === false ? 'Cambia password' : 'Annulla cambia password'}</CButton>
          </div>
        </CForm>
      </section>
    </AppBaseDetail>
  );
};

export default UsersDetail;
