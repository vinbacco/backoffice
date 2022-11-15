/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  CForm, CCol, CFormInput, CFormSelect, CFormCheck, CButton, CRow,
} from '@coreui/react';

import TourService from 'src/services/api/TourService';
import ContactService from 'src/services/api/ContactService';
import ProductCategoriesService from 'src/services/api/ProductCategoriesService';

import AppLoadingSpinner from 'src/components/ui/AppLoadingSpinner';
import AppMultiData from 'src/components/ui/MultiData/AppMultiData';

function ToursDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: null });
  const {
    control, handleSubmit, reset, getValues,
  } = useForm({
    defaultValues: {
      name: '',
      contact_name: '',
      category_name: '',
      url_friendly_name: '',
    },
  });

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

        Promise.all([contactPromise, categoryPromise]).then((promisesValues) => {
          const tourModelData = {};
          tourModelData.name = tourResponseData.name;
          tourModelData.url_friendly_name = tourResponseData.url_friendly_name;
          tourModelData.contact_name = promisesValues[0].business_name;
          tourModelData.category_name = promisesValues[1].translations.it.name;
          reset(tourModelData || {});
          setState({ ...state, loading: false });
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

  if (state.loading === true) return <AppLoadingSpinner />;

  if (state.error) return <p>NO DATA</p>;

  return (
    <>
      <CRow className="mb-4">
        <CCol>
          <h2>{getValues('name')}</h2>
          <small>{`Pagina sito: /${getValues('url_friendly_name')}`}</small>
        </CCol>
      </CRow>
      <CForm className="row g-3">
        <CCol md={6}>
          <Controller
            name="category_name"
            control={control}
            render={({ field }) => <CFormInput readOnly disabled type="text" id="tour-category_name" label="Zona" {... field} />}
          />
        </CCol>
        <CCol md={6}>
          <Controller
            name="contact_name"
            control={control}
            render={({ field }) => <CFormInput readOnly disabled type="text" id="tour-contact_name" label="Contatto" {... field} />}
          />
        </CCol>
        <CCol>
          <AppMultiData title="Pacchetti"/>
        </CCol>
      </CForm>
    </>
  );
}

export default ToursDetail;
