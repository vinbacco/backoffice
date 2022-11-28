/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */

import React from 'react';
import {
  CCol,
  CFormInput,
  CRow,
} from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';

import UsersService, { getUserGroup } from 'src/services/api/UsersService';
import AppList from 'src/components/ui/List/AppList';
import composeErrorFormType from 'src/utils/composeErrorFormType';

function UsersList() {
  const {
    control, handleSubmit, reset, getValues, formState: { errors },
  } = useForm();

  // Tipologia di permessi, Nome Utente, E-mail Utente, Tipologia Contatto
  const buildColumnsFn = () => ([
    {
      key: 'user_group',
      label: 'Tipologia contatto',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      _props: { scope: 'col' },
    },
  ]);

  const buildRowsFn = (item) => ({
    _id: item._id,
    user_group: item.user_group || '',
    name: item.name || '-',
    email: item.email || '-',
  });

  const mapListFn = (item) => ({
    _id: item._id,
    user_group: getUserGroup(item.user_group)?.label || '',
    name: item.name || '-',
    email: item.email || '-',
  });

  const creationBodyFn = () => (
    <CRow md={{ cols: 2, gutter: 2 }}>
      <CCol md={6}>
        <Controller
          name="first_name"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.first_name}
              feedback={errors?.first_name ? composeErrorFormType(errors.first_name) : null}
              type="text"
              id="user-first_name"
              label="Nome utente"
              placeholder="Inserisci nome utente"
              {... field}
            />
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="last_name"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.last_name}
              feedback={errors?.last_name ? composeErrorFormType(errors.last_name) : null}
              type="text"
              id="user-last_name"
              label="Cognome utente"
              placeholder="Inserisci cognome utente"
              {... field}
            />
          )}
        />
      </CCol>
    </CRow>
  );

  return (
    <section id="users">
      <AppList
        sectionTitle="Lista Utenti"
        SectionServiceClass={UsersService}
        sectionPath="/users"
        mapListFn={mapListFn}
        buildColumnsFn={buildColumnsFn}
        buildRowsFn={buildRowsFn}
        creationTitle="Nuovo utente"
        creationBodyFn={() => creationBodyFn()}
        evalCreation={handleSubmit}
        clearCreationModel={() => reset({})}
      />
    </section>
  );
}
export default UsersList;
