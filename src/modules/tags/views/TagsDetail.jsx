/* eslint-disable dot-notation */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { useToasts } from 'react-toast-notifications';
import { useParams } from 'react-router-dom';
import {
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
} from '@coreui/react';
// SERVICES
import TagsService from 'src/services/api/TagsService';
import ProductTypesService from 'src/services/api/ProductTypesService';
import composeErrorFormType from 'src/utils/composeErrorFormType';
// COMPONENTS
import AppBaseDetail from 'src/components/ui/Detail/AppBaseDetail';

const TagsDetail = () => {
  const { id } = useParams();
  const { addToast } = useToasts();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tag: '',
      product_type_id: '',
      color: '',
    },
  });
  const [state, setState] = useState({
    loading: true,
    model: null,
  });

  const tagsService = new TagsService();

  const loadProductTypes = () => new Promise((resolve) => {
    const productTypesService = new ProductTypesService();
    const okCallback = (response) => {
      let responseData = [];
      if (Array.isArray(response.data) && response.data.length > 0) {
        responseData = response.data.map((currentItem) => (
          { value: currentItem['_id'], label: currentItem.name }
        ));
      }
      resolve(responseData);
    };
    const koCallback = () => resolve([]);
    const filters = {
      paginate: 5,
      page: 1,
    };
    productTypesService.getList({
      filters,
      okCallback: (res) => okCallback(res),
      koCallback: (err) => koCallback(err),
    });
  });

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
    reset({ tag: state.model?.tag, code: state.model?.code });
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
                name="product_type_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <>
                    <CFormLabel htmlFor="product_type_id">Tipo prodotto</CFormLabel>
                    <AsyncSelect
                      inputId="product_type_id"
                      isClearable
                      defaultOptions
                      loadOptions={loadProductTypes}
                      {...field}
                    />
                    {errors.product_type_id ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.product_type_id)}</div> : null}
                  </>
                )}
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md={6}>
              <Controller
                name="tag"
                control={control}
                render={({ field }) => (
                  <CFormInput
                    label="Nome tag"
                    {...field}
                  />
                )}
              />
            </CCol>
            <div className="mb-3" />
          </CRow>
          <CRow>
            <CCol md={6}>
              <Controller
                name="colore"
                control={control}
                render={({ field }) => (
                  <CFormInput
                    {...field}
                  />
                )}
              />
              <small id="emailHelp" className="form-text text-muted">Valore in formato esadecimale (Es: #ff0000)</small>
            </CCol>
          </CRow>
        </CForm>
      </section>
    </AppBaseDetail>
  );
};

export default TagsDetail;
