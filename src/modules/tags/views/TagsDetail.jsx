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
import TagsService from 'src/services/api/TagsService';
import FeedsService from 'src/services/api/FeedsService';
import composeErrorFormType from 'src/utils/composeErrorFormType';
// COMPONENTS
import AppBaseDetail from 'src/components/ui/Detail/AppBaseDetail';

const TagsDetail = () => {
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

  const tagsService = new TagsService();

  const loadFeeds = () => new Promise((resolve) => {
    const feedsService = new FeedsService();
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
    feedsService.getList({
      filters,
      okCallback: (res) => okCallback(res),
      koCallback: (err) => koCallback(err),
    });
  });

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

      tagsService.updateItem(state.model['_id'], data, okEditCallback, koEditCallback);
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
    reset({ tag: state.model?.tag });
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
      type="tags"
      saveAction={handleSubmit(onSubmit)}
      resetAction={handleReset}
    >
      <section id="tags-detail">
        <CForm
          className="row g-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CRow>
            <CCol md={6} sm={12}>
              <Controller
                name="product_type_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <>
                    <CFormLabel htmlFor="feed_id">Feed</CFormLabel>
                    <AsyncSelect
                      inputId="feed_id"
                      isClearable
                      defaultOptions
                      loadOptions={loadFeeds}
                      {...field}
                    />
                    {errors.feed_id ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.feed_id)}</div> : null}
                  </>
                )}
              />
            </CCol>
            <CCol md={4} sm={10}>
              <Controller
                name="tag"
                defaultValue=""
                control={control}
                render={({ field }) => (
                  <CFormInput
                    label="Nome tag"
                    {...field}
                  />
                )}
              />
            </CCol>
            <CCol md={2} sm={2}>
              <Controller
                name="color"
                control={control}
                defaultValue="#ffffff"
                render={({ field }) => (
                  <CFormInput
                    type="color"
                    id="tagColorInput"
                    label="Colore"
                    title="Scegli il colore del tag"
                    {...field}
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

export default TagsDetail;
