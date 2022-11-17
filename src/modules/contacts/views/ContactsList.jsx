/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/**
 * TODO:
 * Pulire array selezionati dopo la risposta del elimina, una volta sia implementato.
 */
import React, { useState } from 'react';
import { CCol, CFormInput, CRow } from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';

import ContactsService from 'src/services/api/ContactService';
import AppList from 'src/components/ui/List/AppList';
import composeErrorFormType from 'src/utils/composeErrorFormType';

function ContactsList() {
  const {
    control, handleSubmit, reset, getValues, formState: { errors },
  } = useForm({
    defaultValues: {
      business_name: '',
    },
  });

  /** END */
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

  const creationBodyFn = () => (
    <CRow md={{ cols: 2, gutter: 2 }}>
      <CCol md={6}>
        <Controller
          name="business_name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => <CFormInput invalid={errors.business_name} feedback={errors?.business_name ? composeErrorFormType(errors.business_name) : null} type="text" id="contact-business_name" label="Nome cantina" placeholder="Inserisci nome cantina" {... field} />}
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
      />
    </section>
  );
}

export default ContactsList;
