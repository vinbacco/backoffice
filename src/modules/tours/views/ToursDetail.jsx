/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  CForm, CCol, CFormInput, CRow, CFormTextarea, CInputGroupText, CInputGroup, CFormLabel,
} from '@coreui/react';

import TourService from 'src/services/api/TourService';

import AppDetail from 'src/components/ui/Detail/AppDetail';
import AppLoadingSpinner from 'src/components/ui/AppLoadingSpinner';
import AppMultiData from 'src/components/ui/MultiData/AppMultiData';
import Gallery from 'src/components/ui/Images/Gallery';
import ImageWithPreview from 'src/components/ui/Images/ImageWithPreview';
import PackageForm from './Packages/PackageForm';

function ToursDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: null });
  const {
    control, reset, getValues, setValue,
  } = useForm({
    defaultValues: {
      name: '',
      meta_title: '',
      meta_keywords: '',
      meta_description: '',
      base_price: 0,
      abstract: '',
      description: '',
      contact_name: '',
      category_name: '',
      url_friendly_name: '',
      tour_warnings: '',
      attributes: {
        purchase_options: [],
      },
      tags: [],
    },
  });
  const [tourPreviewImage, setTourPreviewImage] = useState(null);
  const [tourMediaContents, setTourMediaContents] = useState([]);

  const formatModel = (response) => {
    const tourResponseData = { ...response?.data || {} };
    const tourModelData = {};
    tourModelData.product_category_id = tourResponseData.product_category_id;
    tourModelData.contact_id = tourResponseData.contact_id;
    tourModelData.name = tourResponseData.name;
    tourModelData.base_price = tourResponseData.base_price;
    tourModelData.meta_title = tourResponseData.meta_title || '';
    tourModelData.meta_keywords = tourResponseData.meta_keywords || '';
    tourModelData.meta_description = tourResponseData.meta_description || '';
    tourModelData.abstract = tourResponseData?.abstract || '';
    tourModelData.description = tourResponseData?.description || '';
    tourModelData.url_friendly_name = tourResponseData.url_friendly_name;
    tourModelData.contact_name = tourResponseData?.contact?.business_name;
    tourModelData.category_name = tourResponseData?.product_category?.name;
    tourModelData.attributes = tourResponseData?.attributes || {
      purchase_options: [],
    };
    tourModelData.tags = tourResponseData?.tags || [];
    tourModelData.media_contents = tourResponseData?.media_contents || [];

    return tourModelData;
  };

  useEffect(() => {
    if (id !== null && typeof id !== 'undefined') {
      const tourService = new TourService();
      const okGetDetails = (response) => {
        const tourData = formatModel(response);
        reset(tourData);
        setState({ ...state, loading: false, model: tourData });
        if (
          Array.isArray(tourData.media_contents)
          && tourData.media_contents.length > 0
        ) {
          setTourMediaContents([...tourData.media_contents.filter((current) => current.type === 'tour_image')]);
          setTourPreviewImage(tourData.media_contents.find((current) => current.type === 'tour_preview_image'));
        }
      };

      const koGetDetails = (error) => {
        const errorMessage = error?.data?.message || 'Nessun errore';
        setState({ ...state, loading: false, error: errorMessage });
        throw new Error(errorMessage);
      };

      tourService.getItem(id, okGetDetails, koGetDetails);
    }
  }, []);

  const saveAction = (type) => {
    const savePromise = new Promise((resolve, reject) => {
      const okEditCallback = (response) => {
        const tourData = formatModel(response);
        reset(tourData);
        if (
          Array.isArray(tourData.media_contents)
          && tourData.media_contents.length > 0
        ) {
          setTourMediaContents([...tourData.media_contents.filter((current) => current.type === 'tour_image')]);
          setTourPreviewImage(tourData.media_contents.find((current) => current.type === 'tour_preview_image'));
        }
        setState({ ...state, loading: false, model: tourData });
        resolve();
      };

      const koEditCallback = (response) => {
        setState({ loading: false, error: response?.error });
        reject();
      };

      const tourService = new TourService();
      const formData = getValues();
      switch (type) {
        case 'publish':
          // Azione pubblica
          break;
        case 'publishNow':
          // Azione pubblica ora
          break;
        case 'save':
        default:
          tourService.updateItem(id, formData, okEditCallback, koEditCallback);
      }
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

  const getBasePrice = (purchaseOptions) => {
    if (purchaseOptions.length <= 0) return 0;
    if (purchaseOptions.length === 1) return purchaseOptions[0].price;
    const lowerPricePackage = purchaseOptions.reduce((prev, curr) => {
      const prevPrice = parseInt(prev.price, 10);
      const currPrice = parseInt(curr.price, 10);
      if (prevPrice <= currPrice) return prev; return curr;
    });
    return parseInt(lowerPricePackage.price, 10);
  };

  const insertPackage = (data, formProps) => {
    const newModel = { ...getValues() };
    const formatData = { ...data };
    delete formatData.id;
    if (!newModel.attributes) newModel.attributes = { purchase_options: [] };
    if (!newModel.attributes.purchase_options) newModel.attributes.purchase_options = [];
    newModel.attributes.purchase_options.push(formatData);
    newModel.base_price = getBasePrice(newModel.attributes.purchase_options);
    setValue('base_price', newModel.base_price);
    setValue('attributes', newModel.attributes);
    setState({ ...state, model: newModel });
    formProps.closeModal();
  };

  const editPackage = (data, formProps) => {
    const newModel = { ...getValues() };
    if (typeof data.id === 'number' && data.id >= 0) {
      const formatData = { ...data };
      delete formatData.id;
      newModel.attributes.purchase_options[data.id] = (formatData);
      newModel.base_price = getBasePrice(newModel.attributes.purchase_options);
      setValue('base_price', newModel.base_price);
      setValue('attributes', newModel.attributes);
      setState({ ...state, model: newModel });
    }
    formProps.closeModal();
  };

  const deletePackage = (data) => {
    const newModel = { ...getValues() };
    if (typeof data.id === 'number' && data.id >= 0) {
      newModel.attributes.purchase_options.splice(data.id, 1);
      newModel.base_price = getBasePrice(newModel.attributes.purchase_options);
      setValue('base_price', newModel.base_price);
      setValue('attributes', newModel.attributes);
      setState({ ...state, model: newModel });
    }
  };

  const handleChangePreviewImage = (response) => {
    if (response.job === 'delete') return setTourPreviewImage(null);
    return setTourPreviewImage(response.response.data);
  };

  if (state.loading === true) return <AppLoadingSpinner />;

  if (state.error) return <p>NO DATA</p>;

  return (
    <CForm>
      <AppDetail
        saveAction={saveAction}
        name={getValues('name')}
        urlFriendlyName={getValues('url_friendly_name')}
        tabsHeaders={[
          {
            index: 'main-tab',
            label: 'Dati principali',
          },
          {
            index: 'web-tab',
            label: 'Dati web',
          },
        ]}
        tabsContents={[
          {
            index: 'main-tab',
            content: (
              <CRow className="g-3">
                <CCol md={6} sm={12}>
                  <Controller
                    name="category_name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => <CFormInput readOnly disabled type="text" id="tour-category_name" label="Zona" {... field} />}
                  />
                </CCol>
                <CCol md={6} sm={12}>
                  <Controller
                    name="contact_name"
                    control={control}
                    defaultValue=""
                    render={({ field }) => <CFormInput readOnly disabled type="text" id="tour-contact_name" label="Cantina" {... field} />}
                  />
                </CCol>
                <CCol md={6} sm={12}>
                  <CFormLabel htmlFor="tour-base_price">Prezzo base</CFormLabel>
                  <CInputGroup>
                    <Controller
                      name="base_price"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <CFormInput readOnly disabled className="text-align-end" id="tour-base_price" aria-describedby="tour-base_price_append" type="number" label="" {... field} />
                      )}
                    />
                    <CInputGroupText id="tour-base_price_append">€</CInputGroupText>
                  </CInputGroup>
                </CCol>
                <CCol md={12}>
                  <AppMultiData
                    title="Pacchetti"
                    item="Pacchetto"
                    modalSize="xl"
                    formId="pacchetto"
                    createFormComponent={(formProps) => PackageForm({
                      formId: 'create_pacchetto',
                      submit: (data) => insertPackage(data, formProps),
                      parentProps: {
                        show: formProps.show,
                      },
                    })}
                    editFormComponent={(formProps) => PackageForm({
                      formId: 'edit_pacchetto',
                      submit: (data) => editPackage(data, formProps),
                      parentProps: {
                        show: formProps.show,
                        target: formProps.target,
                      },
                    })}
                    deleteFunction={(deleteData) => deletePackage(deleteData)}
                    columns={[
                      { index: 'name_tag', type: 'select' },
                      { index: 'price', type: 'currency' },
                      { index: 'price_type_tag', type: 'select' },
                    ]}
                    data={state?.model?.attributes?.purchase_options || null}
                  />
                </CCol>
              </CRow>
            ),
          },
          {
            index: 'web-tab',
            content: (
              <CRow className="g-3">
                <CCol>
                  <h4>Intestazione</h4>
                  <CRow className="g-3 mb-4">
                    <CCol md={6} sm={12}>
                      <Controller
                        name="meta_title"
                        control={control}
                        render={({ field }) => <CFormInput label="Titolo" placeholder="Inserisce titolo" id="tour-meta_title" {...field} />}
                      />
                    </CCol>
                    <CCol md={6} sm={12}>
                      <Controller
                        name="meta_keywords"
                        control={control}
                        render={({ field }) => <CFormInput label="Keywords" placeholder="Inserisce le parole separate da virgole" id="tour-meta_keywords" {...field} />}
                      />
                    </CCol>
                    <CCol md={12}>
                      <Controller
                        name="meta_description"
                        control={control}
                        render={({ field }) => <CFormTextarea label="Meta descrizione" placeholder="Inserisce qui la meta descrizione" id="tour-meta_description" rows="3" {...field} />}
                      />
                      <small>Non superare i 160 caratteri</small>
                    </CCol>
                  </CRow>
                  <ImageWithPreview
                    contentId={id}
                    contentType="tour_preview_image"
                    Service={TourService}
                    title="Immagine di anteprima"
                    data={tourPreviewImage}
                    onUpdate={(data) => handleChangePreviewImage(data)}
                  />
                  <h4>Contenuto</h4>
                  <CRow className="g-3 mb-4">
                    <CCol md={12}>
                      <Controller
                        name="abstract"
                        control={control}
                        render={({ field }) => <CFormTextarea label="Descrizione breve del tour" id="tour-abstract" rows="3" {...field} />}
                      />
                    </CCol>
                    <CCol md={12}>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => <CFormTextarea label="Descrizione completa del tour" id="tour-description" rows="5" {...field} />}
                      />
                    </CCol>
                    <CCol md={12}>
                      <Controller
                        name="tour_warnings"
                        control={control}
                        render={({ field }) => <CFormTextarea label="Avvertenze" id="tour-warnings" rows="5" {...field} />}
                      />
                    </CCol>
                  </CRow>
                  <Gallery
                    contentId={id}
                    contentType="tour_image"
                    Service={TourService}
                    title="Galleria del tour"
                    data={tourMediaContents}
                    onUpdate={(imagesArray) => setTourMediaContents(imagesArray)}
                  />
                </CCol>
              </CRow>
            ),
          },
        ]}
      />
    </CForm>
  );
}

export default ToursDetail;
