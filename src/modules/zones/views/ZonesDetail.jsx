/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import {
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormTextarea,
  CFormLabel,
} from '@coreui/react';

// SERVICES
import ProductCategoriesService from 'src/services/api/ProductCategoriesService';
import ZonesService from 'src/services/api/ZonesService';
import AppBaseDetail from 'src/components/ui/Detail/AppBaseDetail';
import Gallery from 'src/components/ui/Images/Gallery';
import AppLoadingSpinner from 'src/components/ui/AppLoadingSpinner';

const ZonesDetail = () => {
  const { id } = useParams();
  const {
    control,
    handleSubmit,
    reset,
  } = useForm();
  const [state, setState] = useState({
    loading: true,
    model: null,
  });
  const [mediaContents, setMediaContents] = useState([]);

  const zonesService = new ZonesService();

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

      zonesService.updateItem(state.model['_id'], data, okEditCallback, koEditCallback);
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
    reset({ tag: state.model?.tag, code: state.model?.code });
  };

  const loadProductCategories = (filter) => new Promise((resolve) => {
    const productCategoriesService = new ProductCategoriesService();
    const okGetProductCategories = (response) => {
      let responseData = [];
      if (Array.isArray(response.data) && response.data.length > 0) {
        responseData = response.data.map((currentItem) => (
          { value: currentItem._id, label: currentItem.name }
        ));
      }
      resolve(responseData);
    };
    const koGetProductCategories = () => resolve([]);
    const filters = {
      paginate: 5,
      page: 1,
    };
    if (filter.length > 0) filters['??^name'] = filter;
    filters['?^parent_id'] = 'null';
    productCategoriesService.getList({
      filters,
      okCallback: (res) => okGetProductCategories(res),
      koCallback: (err) => koGetProductCategories(err),
    });
  });

  useEffect(() => {
    if (id) {
      const okGetCallback = (response) => {
        const zoneResponseData = { ...response?.data || {} };
        const zoneModelData = {};

        zoneModelData.name = zoneResponseData?.name || '';
        zoneModelData.description = zoneResponseData?.description || '';

        reset(zoneModelData || {});
        setState({ ...state, loading: false, model: zoneModelData });
        setMediaContents([...zoneResponseData.media_contents.filter((current) => current.type === 'region_image').sort((a, b) => a.order - b.order)]);
      };

      const koGetCallback = (error) => {
        const errorMessage = error?.data?.message || 'Nessun errore';
        setState({ ...state, loading: false, error: errorMessage });
        throw new Error(errorMessage);
      };
      zonesService.getItem(id, okGetCallback, koGetCallback);
    }
  }, [id]);

  if (state.loading === true) return <AppLoadingSpinner />;

  if (state.error) return <p>NO DATA</p>;

  return (
    <AppBaseDetail
      type="zona"
      saveAction={handleSubmit(onSubmit)}
      resetAction={handleReset}
    >
      <section id="zone-detail">
        <CForm
          className="row g-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CRow>
            <CCol md={6} sm={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <CFormInput
                    label="Nome Zona"
                    placeholder="Inserisci nome zona"
                    {...field}
                  />
                )}
              />
            </CCol>
            <CCol md={6}>
              <Controller
                name="product_category_id"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <>
                    <CFormLabel htmlFor="new-tour-category">Regione</CFormLabel>
                    <AsyncSelect
                      inputId="new-tour-category"
                      isClearable
                      defaultOptions
                      loadOptions={loadProductCategories}
                      {...field}
                    />
                  </>
                )}
              />
            </CCol>
            <CCol md={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <CFormTextarea
                    label="Descrizione"
                    placeholder="Inserisci descrizione zona"
                    rows={10}
                    {...field}
                  />
                )}
              />
            </CCol>
            <Gallery
              contentId={id}
              contentType="region_image"
              Service={ZonesService}
              title="Galleria zona"
              data={mediaContents}
              onUpdate={(imagesArray) => setMediaContents(imagesArray)}
            />
            <div className="mb-3" />
          </CRow>
        </CForm>
      </section>
    </AppBaseDetail>
  );
};

export default ZonesDetail;
