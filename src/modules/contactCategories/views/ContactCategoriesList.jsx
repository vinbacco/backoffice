/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */

import React from 'react';
import {
  CCol,
  CFormInput,
  CRow,
} from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';

import ContactCategoriesService from 'src/services/api/ContactCategoriesService';
import AppList from 'src/components/ui/List/AppList';
import composeErrorFormType from 'src/utils/composeErrorFormType';

function ContactCategoriesList() {
  const {
    control, handleSubmit, reset, getValues, formState: { errors },
  } = useForm();

  const buildColumnsFn = () => ([
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'category_name',
      label: 'Nome categoria',
      sortable: true,
      _props: { scope: 'col' },
    },
  ]);

  const buildRowsFn = (item) => ({
    _id: item._id,
    name: item.name,
    category_name: item.category_name,
  });

  const mapListFn = (item) => ({
    _id: item._id,
    name: item.name,
    category_name: item.category_name,
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
              id="contact-category-name"
              label="Nome"
              placeholder="Inserisci nome"
              {... field}
            />
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="category_name"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.category_name}
              feedback={errors?.category_name ? composeErrorFormType(errors.category_name) : null}
              type="text"
              id="contact-category-category_name"
              label="Categoria contatto"
              placeholder="Inserisci categoria contatto"
              {... field}
            />
          )}
        />
      </CCol>
    </CRow>
  );

  return (
    <section id="contact-categories">
      <AppList
        sectionTitle="Lista categorie contatto"
        SectionServiceClass={ContactCategoriesService}
        sectionPath="/contact-categories"
        mapListFn={mapListFn}
        buildColumnsFn={buildColumnsFn}
        buildRowsFn={buildRowsFn}
        creationTitle="Nuova categoria contatto"
        creationBodyFn={() => creationBodyFn()}
        evalCreation={handleSubmit}
        clearCreationModel={() => reset({})}
      />
    </section>
  );
}
export default ContactCategoriesList;
