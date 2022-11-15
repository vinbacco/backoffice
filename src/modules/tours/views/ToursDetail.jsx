/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  CForm, CCol, CFormInput, CRow, CFormTextarea,
} from '@coreui/react';

import TourService from 'src/services/api/TourService';
import ContactService from 'src/services/api/ContactService';
import ProductCategoriesService from 'src/services/api/ProductCategoriesService';

import AppDetail from 'src/components/ui/Detail/AppDetail';
import AppLoadingSpinner from 'src/components/ui/AppLoadingSpinner';
import AppMultiData from 'src/components/ui/MultiData/AppMultiData';
import Gallery from 'src/components/ui/Gallery/Gallery';
import PackageForm from './Packages/PackageForm';

function ToursDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: null });
  const {
    control, handleSubmit, reset, getValues,
  } = useForm({
    defaultValues: {
      name: '',
      abstract: '',
      description: '',
      contact_name: '',
      category_name: '',
      url_friendly_name: '',
    },
  });
  const [tourMediaContents, setTourMediaContents] = useState([]);
  const [tourWineMediaContents, setTourWineMediaContents] = useState([]);

  useEffect(() => {
    if (id !== null && typeof id !== 'undefined') {
      const tourService = new TourService();
      const okGetDetails = (response) => {
        const tourResponseData = { ...response?.data || {} };
        /**
         * FIXME: Non funziona la chiamata con lookup.
         * attendere verifica dal BE per rimuovere le chiamate aggiuntive.
         */
        const contactPromise = new Promise((resolve) => {
          const contactService = new ContactService();
          const okGetContactData = (contactResponse) => resolve(contactResponse?.data);
          const koGetContactData = () => resolve(null);
          contactService.getItem(tourResponseData.contact_id, okGetContactData, koGetContactData);
        });

        const categoryPromise = new Promise((resolve) => {
          const productCategoriesService = new ProductCategoriesService();
          const okGetCategoryData = (categoryResponse) => resolve(categoryResponse?.data);
          const koGetCategoryData = () => resolve(null);
          productCategoriesService
            .getItem(tourResponseData.product_category_id, okGetCategoryData, koGetCategoryData);
        });

        Promise.all([
          contactPromise, categoryPromise,
        ]).then((promisesValues) => {
          const tourModelData = {};
          tourModelData.name = tourResponseData.name;
          tourModelData.abstract = tourResponseData?.translations?.it?.abstract || '';
          tourModelData.description = tourResponseData?.translations?.it?.description || '';
          tourModelData.url_friendly_name = tourResponseData.url_friendly_name;
          tourModelData.contact_name = promisesValues[0].business_name;
          tourModelData.category_name = promisesValues[1].translations.it.name;
          reset(tourModelData || {});
          setState({ ...state, loading: false });
          if (
            Array.isArray(tourResponseData.media_contents)
            && tourResponseData.media_contents.length > 0
          ) {
            setTourMediaContents([...tourResponseData.media_contents.filter((current) => current.type === 'tour_image')]);
            setTourWineMediaContents([...tourResponseData.media_contents.filter((current) => current.type === 'tour_wine_image')]);
          }
        });
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
    switch (type) {
      case 'publish':
        // Azione pubblica
        break;
      case 'publishNow':
        // Azione pubblica ora
        break;
      case 'save':
      default:
        // Azione salva
    }
  };

  if (state.loading === true) return <AppLoadingSpinner />;

  if (state.error) return <p>NO DATA</p>;

  return (
    <CForm>
      <AppDetail
        saveAction={saveAction}
        name={getValues('name')}
        urlFriendlyName={getValues('url_friendly_name')}
        tabContentMain={(
          <CRow className="g-3">
            <CCol md={6} sm={12}>
              <Controller
                name="category_name"
                control={control}
                render={({ field }) => <CFormInput readOnly disabled type="text" id="tour-category_name" label="Zona" {... field} />}
              />
            </CCol>
            <CCol md={6} sm={12}>
              <Controller
                name="contact_name"
                control={control}
                render={({ field }) => <CFormInput readOnly disabled type="text" id="tour-contact_name" label="Contatto" {... field} />}
              />
            </CCol>
            <CCol>
              <AppMultiData
                title="Pacchetti"
                createFormComponent={() => PackageForm({})}
              />
            </CCol>
          </CRow>
        )}
        tabContentWeb={(
          <CRow className="g-3">
            <CCol>
              <CRow className="g-3">
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
              </CRow>
              <Gallery title="Galleria del tour" data={tourMediaContents} />
              <Gallery title="Galleria dei vini del tour" data={tourWineMediaContents} />
            </CCol>
          </CRow>
        )}
      />
    </CForm>
  );
}

export default ToursDetail;
