/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
  CCol,
  CFormInput,
  CRow,
} from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';

import ProductTypesService from 'src/services/api/ProductTypesService';
import AppList from 'src/components/ui/List/AppList';
import composeErrorFormType from 'src/utils/composeErrorFormType';

function ProductTypesList() {
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
              id="product-type-name"
              label="Tipo prodotto"
              placeholder="Inserisci tipo prodotto"
              {... field}
            />
          )}
        />
      </CCol>
    </CRow>
  );

  return (
    <section id="product-types">
      <AppList
        sectionTitle="Lista Tipi Prodotti"
        SectionServiceClass={ProductTypesService}
        sectionPath="/product-types"
        mapListFn={mapListFn}
        buildColumnsFn={buildColumnsFn}
        buildRowsFn={buildRowsFn}
        creationTitle="Nuovo Tipo Prodotto"
        creationBodyFn={() => creationBodyFn()}
        evalCreation={handleSubmit}
        clearCreationModel={() => reset({})}
      />
    </section>
  );
}
export default ProductTypesList;
