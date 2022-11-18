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

import RegionsService from 'src/services/api/RegionsService';
import AppList from 'src/components/ui/List/AppList';
import composeErrorFormType from 'src/utils/composeErrorFormType';

function RegionsList() {
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
  ]);

  const buildRowsFn = (item) => ({
    _id: item._id,
    name: item.name,
  });

  const mapListFn = (item) => ({
    _id: item._id,
    name: item.name,
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
              id="region-name"
              label="Regione"
              placeholder="Inserisci regione"
              {... field}
            />
          )}
        />
      </CCol>
    </CRow>
  );

  return (
    <section id="regions">
      <AppList
        sectionTitle="Lista Regioni"
        SectionServiceClass={RegionsService}
        sectionPath="/regions"
        mapListFn={mapListFn}
        buildColumnsFn={buildColumnsFn}
        buildRowsFn={buildRowsFn}
        creationTitle="Nuova Regione"
        creationBodyFn={() => creationBodyFn()}
        evalCreation={handleSubmit}
        clearCreationModel={() => reset({})}
      />
    </section>
  );
}
export default RegionsList;
