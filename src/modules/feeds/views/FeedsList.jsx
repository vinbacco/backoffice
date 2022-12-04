/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/**
 * TODO:
 * Pulire array selezionati dopo la risposta del elimina, una volta sia implementato.
 */
import React from 'react';
import {
  CCol,
  CFormInput,
  CRow,
} from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';

import FeedsService from 'src/services/api/FeedsService';
import AppList from 'src/components/ui/List/AppList';
import composeErrorFormType from 'src/utils/composeErrorFormType';

function FeedsList() {
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
      key: 'code',
      label: 'Codice',
      sortable: true,
      _props: { scope: 'col' },
    },
  ]);

  const buildRowsFn = (item) => ({
    _id: item._id,
    name: item.name,
    code: item.code,
  });

  const mapListFn = (item) => ({
    _id: item._id,
    name: item.name,
    code: item.code,
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
              id="feed-name"
              label="Nome del feed"
              placeholder="Inserisci feed"
              {... field}
            />
          )}
        />
      </CCol>
      <CCol md={6}>
        <Controller
          name="code"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.code}
              feedback={errors?.code ? composeErrorFormType(errors.code) : null}
              type="text"
              id="feed-code"
              label="Codice feed"
              placeholder="Inserisci codice feed"
              {... field}
            />
          )}
        />
      </CCol>
    </CRow>
  );

  return (
    <section id="feeds">
      <AppList
        sectionId="feeds"
        sectionTitle="Lista Feeds"
        SectionServiceClass={FeedsService}
        sectionPath="/feeds"
        mapListFn={mapListFn}
        buildColumnsFn={buildColumnsFn}
        buildRowsFn={buildRowsFn}
        creationTitle="Nuovo Feed"
        creationBodyFn={() => creationBodyFn()}
        evalCreation={handleSubmit}
        clearCreationModel={() => reset({})}
      />
    </section>
  );
}
export default FeedsList;
