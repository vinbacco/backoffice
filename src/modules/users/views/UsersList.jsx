/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */

import React from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import {
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';

import UsersService, { USER_GROUPS, getUserGroup } from 'src/services/api/UsersService';
import AppList from 'src/components/ui/List/AppList';
import ContactsService from 'src/services/api/ContactsService';
import composeErrorFormType from 'src/utils/composeErrorFormType';

function UsersList() {
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

  // Tipologia di permessi, Nome Utente, E-mail Utente, Tipologia Contatto
  const buildColumnsFn = () => ([
    {
      key: 'user_group',
      label: 'Tipologia permessi',
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
    {
      key: 'contact',
      label: 'Contatto',
      sortable: true,
      _props: { scope: 'col' },
    },
  ]);

  const buildRowsFn = (item) => ({
    _id: item._id,
    user_group: item.user_group || '-',
    name: item.name || '-',
    email: item.email || '-',
    contact: item.contact || '-',
  });

  const mapListFn = (item) => ({
    _id: item._id,
    user_group: getUserGroup(item.user_group)?.label || '-',
    name: item.name || '-',
    email: item.email || '-',
    contact: item.contact?.business_name || '-',
  });

  const creationBodyFn = () => (
    <>
      <CRow className="mb-3" md={{ cols: 2, gutter: 2 }}>
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
        <CCol md={6}>
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field }) => (
              <CFormInput
                invalid={!!errors.email}
                feedback={errors?.email ? composeErrorFormType(errors.email) : null}
                type="email"
                id="user-email"
                label="Email"
                placeholder="Inserisci email"
                {... field}
              />
            )}
          />
        </CCol>
        <CCol md={6}>
          <Controller
            name="user_group"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <CFormLabel htmlFor="user-user_group">Tipologia permessi</CFormLabel>
                <Select
                  inputId="user-user_group"
                  defaultOptions
                  options={USER_GROUPS}
                  {...field}
                />
                {errors.user_group ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.user_group)}</div> : null}
              </>
            )}
          />
        </CCol>
        <CCol md={6}>
          <Controller
            name="contact_id"
            control={control}
            render={({ field }) => (
              <>
                <CFormLabel htmlFor="user-contact">Contatto</CFormLabel>
                <AsyncSelect
                  inputId="user-contact"
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
      </CRow>
      <CRow className="mb-3" md={{ cols: 2, gutter: 2 }}>
        <CCol md={6}>
          <Controller
            name="password"
            control={control}
            rules={{
              required: true,
            }}
            defaultValue=""
            render={({ field }) => (
              <CFormInput
                invalid={!!errors.password}
                feedback={errors?.password ? composeErrorFormType(errors.password) : null}
                type="password"
                id="user-password"
                label="Password"
                minLength={8}
                placeholder="Inserisci password"
                {... field}
              />
            )}
          />
        </CCol>
        <CCol md={6}>
          <Controller
            name="password_repeat"
            control={control}
            rules={{
              required: true,
              validate: {
                equalPassword: (v) => v === getValues().password,
              },
            }}
            defaultValue=""
            render={({ field }) => (
              <CFormInput
                invalid={!!errors.password_repeat}
                feedback={errors?.password_repeat
                  ? composeErrorFormType(errors.password_repeat)
                  : null}
                type="password"
                id="user-password_repeat"
                label="Ripete password"
                placeholder="Ripete  password"
                minLength={8}
                {... field}
              />
            )}
          />
        </CCol>
      </CRow>
    </>
  );

  return (
    <section id="users">
      <AppList
        sectionId="users"
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
