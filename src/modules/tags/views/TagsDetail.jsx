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
import TagsService from 'src/services/api/TagsService';
import AppBaseDetail from 'src/components/ui/Detail/AppBaseDetail';

const TagsDetail = () => {
  const { id } = useParams();
  const { addToast } = useToasts();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
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

  const tagsService = new TagsService();

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

    tagsService.updateItem(state.model['_id'], data, okEditCallback, koEditCallback);
  };

  const handleReset = () => {
    reset({ name: state.model?.tag, code: state.model?.code });
  };

  useEffect(() => {
    if (id) {
      const okGetCallback = (response) => {
        setValue('tag', response.data.tag);
        setState({ ...state, loading: false, model: { ...response.data } });
      };

      const koGetCallback = (error) => {
        const errorMessage = error?.data?.message || 'Nessun errore';
        setState({ ...state, loading: false, error: errorMessage });
        throw new Error(errorMessage);
      };
      tagsService.getItem(id, okGetCallback, koGetCallback);
    }
  }, [id]);

  return (
    <AppBaseDetail
      name="tags"
      saveAction={handleSubmit(onSubmit)}
      resetAction={handleReset}
    >
      <section id="tags-detail">
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

export default TagsDetail;
