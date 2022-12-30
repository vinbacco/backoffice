/* eslint-disable no-unused-vars */
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
  CFormTextarea,
} from '@coreui/react';
// SERVICES
import RegionsService from 'src/services/api/RegionsService';
import AppBaseDetail from 'src/components/ui/Detail/AppBaseDetail';
import Gallery from 'src/components/ui/Images/Gallery/Gallery';
import AppLoadingSpinner from 'src/components/ui/AppLoadingSpinner';

const RegionsDetail = () => {
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

  const regionsService = new RegionsService();

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

      regionsService.updateItem(state.model['_id'], data, okEditCallback, koEditCallback);
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

  useEffect(() => {
    if (id) {
      const okGetCallback = (response) => {
        const regionResponseData = { ...response?.data || {} };
        const regionModelData = {};

        regionModelData.name = regionResponseData?.name || '';
        regionModelData.description = regionResponseData?.description || '';

        reset(regionModelData || {});
        setState({ ...state, loading: false, model: regionModelData });
        setMediaContents([...regionResponseData.media_contents.filter((current) => current.type === 'region_image').sort((a, b) => a.order - b.order)]);
      };

      const koGetCallback = (error) => {
        const errorMessage = error?.data?.message || 'Nessun errore';
        setState({ ...state, loading: false, error: errorMessage });
        throw new Error(errorMessage);
      };
      regionsService.getItem(id, okGetCallback, koGetCallback);
    }
  }, [id]);

  if (state.loading === true) return <AppLoadingSpinner />;

  if (state.error) return <p>NO DATA</p>;

  return (
    <AppBaseDetail
      type="regione"
      saveAction={handleSubmit(onSubmit)}
      resetAction={handleReset}
    >
      <section id="region-detail">
        <CForm
          className="row g-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CRow>
            <CCol md={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <CFormInput
                    label="Nome Regione"
                    placeholder="Inserisci nome regione"
                    {...field}
                  />
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
                    placeholder="Inserisci descrizione regione"
                    rows={10}
                    {...field}
                  />
                )}
              />
            </CCol>
            <Gallery
              contentId={id}
              contentType="region_image"
              Service={RegionsService}
              title="Galleria regione"
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

export default RegionsDetail;
