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
import TagsService from 'src/services/api/TagsService';
import FeedsService from 'src/services/api/FeedsService';
import composeErrorFormType from 'src/utils/composeErrorFormType';
// COMPONENTS
import AppBaseDetail from 'src/components/ui/Detail/AppBaseDetail';
import AppLoadingSpinner from 'src/components/ui/AppLoadingSpinner';
import ImageWithPreview from 'src/components/ui/Images/ImageWithPreview';

const TagsDetail = () => {
  const { id } = useParams();
  const [tagPreviewImage, setTagPreviewImage] = useState(null);
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

  const handleReset = () => {
    reset({ ...state.model });
  };

  const formatModel = (response) => {
    const responseData = { ...response.data };
    let feedCurrent = null;
    if (response.data?.feed?._id && response.data?.feed?.name) {
      feedCurrent = { value: response.data.feed._id, label: response.data.feed.name };
    }

    if (feedCurrent !== null) responseData.feed_id = feedCurrent;

    if (Array.isArray(responseData.media_contents)) {
      const tagImage = responseData.media_contents.find((current) => current.type === 'tag_image');
      if (tagImage !== null || typeof tagImage !== 'undefined') setTagPreviewImage(tagImage);
    }

    setValue('tag', responseData.tag);
    setValue('color', responseData.color);
    setValue('feed_id', responseData.feed_id);
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

      tagsService.updateItem(state.model['_id'], data, okEditCallback, koEditCallback);
    });

    toast.promise(savePromise, {
      loading: 'Attendere, salvando le modifiche...',
      success: 'Dato modificato con successo!',
      error: 'Ops, si ?? verificato un errore!',
    }, {
      success: {
        duration: 5000,
      },
      error: {
        duration: 5000,
      },
    });
  };

  const onChangeTagPreviewImage = (response) => {
    if (response.job === 'delete') return setTagPreviewImage(null);
    return setTagPreviewImage(response.response.data);
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
      tagsService.getItem(id, okGetCallback, koGetCallback);
    }
  }, [id]);

  if (state?.loading === true) return <AppLoadingSpinner />;

  return (
    <AppBaseDetail
      type="tags"
      saveAction={handleSubmit(onSubmit)}
      resetAction={handleReset}
    >
      <section id="tags-detail">
        <CForm
          className="row g-3 mt-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CRow className="mb-3">
            <CCol md={8} sm={12}>
              <CRow className="mb-3">
                <CCol>
                  <Controller
                    name="feed_id"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={state?.model?.feed_id || null}
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
              </CRow>
              <CRow className="mb-3">
                <CCol>
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
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <Controller
                    name="color"
                    defaultValue="#ffffff"
                    control={control}
                    render={({ field }) => (
                      <CFormInput
                        label="Colore tag"
                        {...field}
                      />
                    )}
                  />
                </CCol>
              </CRow>
            </CCol>
            <CCol md={4} sm={12}>
              <ImageWithPreview
                contentId={id}
                contentType="tag_image"
                Service={TagsService}
                title="Immagine tag"
                data={tagPreviewImage}
                onUpdate={(data) => onChangeTagPreviewImage(data)}
              />
            </CCol>
          </CRow>
        </CForm>
      </section>
    </AppBaseDetail>
  );
};

export default TagsDetail;
