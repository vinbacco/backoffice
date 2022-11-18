/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/**
 * TODO:
 * Pulire array selezionati dopo la risposta del elimina, una volta sia implementato.
 */
import React from 'react';
import AsyncSelect from 'react-select/async';
import { useForm, Controller } from 'react-hook-form';

import {
  CCol,
  CFormInput,
  CRow,
  CFormLabel,
} from '@coreui/react';

import TourService from 'src/services/api/TourService';
import ContactsService from 'src/services/api/ContactsService';
import ProductCategoriesService from 'src/services/api/ProductCategoriesService';
import AppList from 'src/components/ui/List/AppList';
import composeErrorFormType from 'src/utils/composeErrorFormType';

function ToursList() {
  const {
    control, handleSubmit, reset, getValues, formState: { errors },
  } = useForm();

  const loadContacts = (filter) => new Promise((resolve) => {
    const contactsService = new ContactsService();
    const okGetContacts = (response) => {
      let responseData = [];
      if (Array.isArray(response.data) && response.data.length > 0) {
        responseData = response.data.map((currentItem) => (
          { value: currentItem._id, label: currentItem.business_name }
        ));
      }
      resolve(responseData);
    };
    const koGetContacts = () => resolve([]);
    const filters = {
      paginate: 5,
      page: 1,
    };
    if (filter.length > 0) filters['??^business_name'] = filter;
    contactsService.getList({
      filters,
      okCallback: (res) => okGetContacts(res),
      koCallback: (err) => koGetContacts(err),
    });
  });

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
    productCategoriesService.getList({
      filters,
      okCallback: (res) => okGetProductCategories(res),
      koCallback: (err) => koGetProductCategories(err),
    });
  });

  const buildColumnsFn = () => ([
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'contact.business_name',
      label: 'Cantina',
      sortable: true,
      _props: { scope: 'col' },
    },
  ]);

  const buildRowsFn = (item) => ({
    _id: item._id,
    name: item.name,
    'contact.business_name': item.business_name,
  });

  const mapListFn = (item) => ({
    _id: item._id,
    name: item.name,
    business_name: item.contact.business_name,
  });

  const creationBodyFn = () => (
    <CRow md={{ cols: 2, gutter: 2 }}>
      <CCol md={6}>
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.name}
              feedback={errors?.name ? composeErrorFormType(errors.name) : null}
              type="text"
              id="tour-name"
              label="Nome del tour"
              placeholder="es. Tour degli ulivi"
              {... field}
            />
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="contact_id"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <>
              <CFormLabel htmlFor="new-tour-contact">Contatto</CFormLabel>
              <AsyncSelect
                inputId="new-tour-contact"
                isClearable
                defaultOptions
                loadOptions={loadContacts}
                {...field}
              />
              {errors.contact_id ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.contact_id)}</div> : null}
            </>
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
              {errors.product_category_id ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.product_category_id)}</div> : null}
            </>
          )}
        />
      </CCol>
    </CRow>
  );

  return (
    <section id="tour">
      <AppList
        title="Lista Tour"
        SectionServiceClass={TourService}
        sectionPath="/tours"
        mapListFn={mapListFn}
        buildColumnsFn={buildColumnsFn}
        buildRowsFn={buildRowsFn}
        creationTitle="Creare un nuovo Tour"
        creationBodyFn={() => creationBodyFn()}
        evalCreation={handleSubmit}
        clearCreationModel={() => reset({})}
      />
    </section>
  );
}
export default ToursList;
