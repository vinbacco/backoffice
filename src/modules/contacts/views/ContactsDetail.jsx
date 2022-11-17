/* eslint-disable dot-notation */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import { useParams } from 'react-router-dom';
import {
  CForm,
  CRow,
  CCol,
  CFormInput,
} from '@coreui/react';
// SERVICES
import ContactsService from 'src/services/api/ContactsService';
import AppBaseDetail from 'src/components/ui/Detail/AppBaseDetail';

const ContactsDetails = () => {
  const { id } = useParams();
  const { addToast } = useToasts();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      business_name: '',
    },
  });
  const [state, setState] = useState({
    loading: true,
    model: null,
  });

  const contactsService = new ContactsService();

  const onSubmit = (data) => {
    const okEditCallback = (response) => {
      setState({ loading: false, model: { ...response.data } });
      addToast('Dato modificato con successo!', {
        appearance: 'success',
        autoDismiss: true,
      });
    };

    const koEditCallback = (response) => {
      setState({ loading: false, error: response?.error });
      addToast('Ops, si è verificato un errore!', {
        appearance: 'error',
        autoDismiss: true,
      });
    };

    contactsService.updateItem(state.model['_id'], data, okEditCallback, koEditCallback);
  };

  const handleReset = () => {
    reset({ business_name: state.model?.business_name });
  };

  useEffect(() => {
    if (id) {
      const okGetCallback = (response) => {
        setValue('business_name', response.data.business_name);
        setState({ ...state, loading: false, model: { ...response.data } });
      };

      const koGetCallback = (error) => {
        const errorMessage = error?.data?.message || 'Nessun errore';
        setState({ ...state, loading: false, error: errorMessage });
        throw new Error(errorMessage);
      };

      contactsService.getItem(id, okGetCallback, koGetCallback);
    }
  }, [id]);

  return (
    <AppBaseDetail
      name="contatto"
      saveAction={handleSubmit(onSubmit)}
      resetAction={handleReset}
    >
      <section id="contacts-detail">
        <CForm
          className="row g-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CRow>
            <CCol md={6}>
              <Controller
                name="business_name"
                control={control}
                render={({ field }) => (
                  <CFormInput
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

export default ContactsDetails;
