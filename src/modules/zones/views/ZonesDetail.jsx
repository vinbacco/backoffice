/* eslint-disable no-unused-vars */
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
  CFormTextarea,
} from '@coreui/react';
// SERVICES
import ZonesService from 'src/services/api/ZonesService';
import AppBaseDetail from 'src/components/ui/Detail/AppBaseDetail';
import Gallery from 'src/components/ui/Gallery/Gallery';

const ZonesDetail = () => {
  const { id } = useParams();
  const { addToast } = useToasts();
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

    zonesService.updateItem(state.model['_id'], data, okEditCallback, koEditCallback);
  };

  const handleReset = () => {
    reset({ tag: state.model?.tag, code: state.model?.code });
  };

  const uploadMediaContent = (fileData, type) => {
    const mediaContentData = {};

    const okUploadMediaContent = (categoryResponse) => {
      console.log(categoryResponse?.data);
    };

    const koUploadMediaContent = (error) => {
      console.log(error);
    };

    zonesService
      .addMediaContent(id, mediaContentData, okUploadMediaContent, koUploadMediaContent);
  };

  useEffect(() => {
    if (id) {
      const okGetCallback = (response) => {
        const zoneResponseData = { ...response?.data || {} };
        const zoneModelData = {};

        zoneModelData.name = zoneResponseData?.name || '';
        zoneModelData.description = zoneResponseData?.description || '';

        reset(zoneModelData || {});
        setState({ ...state, loading: false, model: zoneModelData });
        setMediaContents([...zoneResponseData.media_contents.filter((current) => current.type === 'region_image')]);
      };

      const koGetCallback = (error) => {
        const errorMessage = error?.data?.message || 'Nessun errore';
        setState({ ...state, loading: false, error: errorMessage });
        throw new Error(errorMessage);
      };
      zonesService.getItem(id, okGetCallback, koGetCallback);
    }
  }, [id]);

  return (
    <AppBaseDetail
      name="zona"
      saveAction={handleSubmit(onSubmit)}
      resetAction={handleReset}
    >
      <section id="zone-detail">
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
                    label="Nome Zona"
                    placeholder="Inserisci nome zona"
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
                    placeholder="Inserisci descrizione zona"
                    rows={10}
                    {...field}
                  />
                )}
              />
            </CCol>
            <Gallery
              title="Galleria zona"
              data={mediaContents}
              onUpload={(file) => uploadMediaContent(file, 'region_image')}
              onChangeOrder={(imagesArray) => setMediaContents(imagesArray)}
            />
            <div className="mb-3" />
          </CRow>
        </CForm>
      </section>
    </AppBaseDetail>
  );
};

export default ZonesDetail;
