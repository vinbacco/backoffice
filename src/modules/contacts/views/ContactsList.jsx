/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/**
 * TODO:
 * Pulire array selezionati dopo la risposta del elimina, una volta sia implementato.
 */
import React from 'react';
import AsyncSelect from 'react-select/async';
import {
  CCol, CFormInput, CFormLabel, CRow,
} from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';

import ContactsService from 'src/services/api/ContactsService';
import AppList from 'src/components/ui/List/AppList';
import composeErrorFormType from 'src/utils/composeErrorFormType';
import ContactCategoriesService from 'src/services/api/ContactCategoriesService';
import CitiesService from 'src/services/api/CitiesService';

function ContactsList() {
  const {
    control, handleSubmit, reset, getValues, formState: { errors },
  } = useForm();

  const loadContactCategories = () => new Promise((resolve) => {
    const contactCategoriesService = new ContactCategoriesService();
    const okGetContactCategories = (response) => {
      let responseData = [];
      if (Array.isArray(response.data) && response.data.length > 0) {
        responseData = response.data.map((currentItem) => (
          { value: currentItem._id, label: currentItem.category_name }
        ));
      }
      resolve(responseData);
    };
    const koGetContactCategories = () => resolve([]);
    const filters = {
      paginate: 5,
      page: 1,
    };
    contactCategoriesService.getList({
      filters,
      okCallback: (res) => okGetContactCategories(res),
      koCallback: (err) => koGetContactCategories(err),
    });
  });

  const loadCities = () => new Promise((resolve) => {
    const citiesService = new CitiesService();
    const okGetCities = (response) => {
      let responseData = [];
      if (Array.isArray(response.data) && response.data.length > 0) {
        responseData = response.data.map((currentItem) => (
          { value: currentItem._id, label: currentItem.city_name }
        ));
      }
      resolve(responseData);
    };
    const koGetCities = () => resolve([]);
    const filters = {
      paginate: 5,
      page: 1,
    };
    citiesService.getList({
      filters,
      okCallback: (res) => okGetCities(res),
      koCallback: (err) => koGetCities(err),
    });
  });

  const buildColumnsFn = () => [
    {
      key: 'business_name',
      label: 'Nome Cantina',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'holder',
      label: 'Titolare/i',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'registered_address',
      label: 'Indirizzo (Sede legale)',
      sortable: true,
      _props: { scope: 'col' },
    },
  ];

  const buildRowsFn = (item) => ({
    _id: item._id,
    business_name: item.business_name,
    holder: item.holder,
    registered_address: item.registered_address,
  });

  const mapListFn = (item) => ({
    _id: item._id,
    business_name: item.business_name,
    holder: item.holder,
    registered_address: item.registered_address,
  });

  const formatCreationData = (data) => {
    const newData = { ...data };
    newData.contact_category_id = newData.contact_category_id.value;
    newData.registered_city_id = newData.registered_city_id.value;
    return newData;
  };

  const creationBodyFn = () => (
    <CRow md={{ cols: 2, gutter: 2 }}>
      <CCol md={6}>
        <Controller
          name="business_name"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.business_name}
              feedback={errors?.business_name ? composeErrorFormType(errors.business_name) : null}
              type="text"
              id="contact-business_name"
              label="Nome cantina"
              placeholder="Inserisci nome cantina"
              {... field}
            />
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="contact_category_id"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <>
              <CFormLabel htmlFor="new-contact-category">Categoria contatto</CFormLabel>
              <AsyncSelect
                inputId="new-contact-category"
                isClearable
                defaultOptions
                loadOptions={loadContactCategories}
                {...field}
              />
              {errors.contact_category_id ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.contact_category_id)}</div> : null}
            </>
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="holder"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.holder}
              feedback={errors?.holder ? composeErrorFormType(errors.holder) : null}
              type="text"
              id="contact-holder"
              label="Titolare/i"
              placeholder="Inserisci titolare/i"
              {... field}
            />
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="foundation_year"
          defaultValue=""
          control={control}
          rules={{ required: true, pattern: /^\d{4}$/i }}
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.foundation_year}
              feedback={errors?.foundation_year
                ? composeErrorFormType(errors.foundation_year, 'Devono essere 4 cifre numeriche')
                : null}
              type="number"
              id="contact-foundation_year"
              label="Anno di fondazione"
              placeholder="Inserisci anno di fondazione"
              {... field}
            />
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="certified_email"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.certified_email}
              feedback={errors?.certified_email
                ? composeErrorFormType(errors.certified_email)
                : null}
              type="email"
              id="contact-certified_email"
              label="PEC"
              placeholder="Inserisci PEC"
              {... field}
            />
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="registered_address"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.registered_address}
              feedback={errors?.registered_address
                ? composeErrorFormType(errors.registered_address)
                : null}
              type="text"
              id="contact-registered_address"
              label="Indirizzo (sede legale)"
              placeholder="Inserisci indirizzo"
              {... field}
            />
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="registered_city_id"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <>
              <CFormLabel htmlFor="new-contact-registered_city_id">Città (sede legale)</CFormLabel>
              <AsyncSelect
                inputId="new-contact-registered_city_id"
                isClearable
                defaultOptions
                loadOptions={loadCities}
                {...field}
              />
              {errors.registered_city_id ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.registered_city_id)}</div> : null}
            </>
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="registered_zip_code"
          defaultValue=""
          control={control}
          rules={{ required: true, pattern: /^\d{5}$/i }}
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.registered_zip_code}
              feedback={errors?.registered_zip_code
                ? composeErrorFormType(errors.registered_zip_code, 'Devono essere 5 cifre numeriche')
                : null}
              type="number"
              id="contact-registered_zip_code"
              label="CAP (sede legale)"
              placeholder="Inserisci CAP"
              {... field}
            />
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="vat_code"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.vat_code}
              feedback={errors?.vat_code ? composeErrorFormType(errors.vat_code) : null}
              type="text"
              id="contact-vat_code"
              label="Codice fiscale"
              placeholder="Inserisci codice fiscale"
              {... field}
            />
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="commercial_ref_name"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.commercial_ref_name}
              feedback={errors?.commercial_ref_name
                ? composeErrorFormType(errors.commercial_ref_name)
                : null}
              type="text"
              id="contact-commercial_ref_name"
              label="Nome e Cognome rif. Commerciale"
              placeholder="Inserisci riferimento commerciale"
              {... field}
            />
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="commercial_ref_phone"
          defaultValue=""
          control={control}
          rules={{ required: true, pattern: /^[+]?\d{3,}$/i }}
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.commercial_ref_phone}
              feedback={errors?.commercial_ref_phone
                ? composeErrorFormType(errors.commercial_ref_phone)
                : null}
              type="text"
              id="contact-commercial_ref_phone"
              label="Cellulare rif. Commerciale"
              placeholder="Inserisci cellulare rif. commerciale"
              {... field}
            />
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="commercial_ref_email"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.commercial_ref_email}
              feedback={errors?.commercial_ref_email
                ? composeErrorFormType(errors.commercial_ref_email)
                : null}
              type="email"
              id="contact-commercial_ref_email"
              label="Email rif. Commerciale"
              placeholder="Inserisci Email rif. Commerciale"
              {... field}
            />
          )}
        />
      </CCol>
    </CRow>
  );

  return (
    <section id="contacts">
      <AppList
        sectionTitle="Lista Contatti"
        SectionServiceClass={ContactsService}
        sectionPath="/contacts"
        mapListFn={mapListFn}
        buildColumnsFn={buildColumnsFn}
        buildRowsFn={buildRowsFn}
        creationTitle="Nuovo Contacto"
        creationBodyFn={() => creationBodyFn()}
        evalCreation={handleSubmit}
        clearCreationModel={() => reset({})}
        formatCreationData={formatCreationData}
        initialSortField="business_name"
      />
    </section>
  );
}

export default ContactsList;
