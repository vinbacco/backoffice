/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/**
 * TODO:
 * Pulire array selezionati dopo la risposta del elimina, una volta sia implementato.
 */
import React from 'react';
import AsyncSelect from 'react-select/async';
import {
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';

import ZonesService from 'src/services/api/ZonesService';
import ProductCategoriesService from 'src/services/api/ProductCategoriesService';
import AppList from 'src/components/ui/List/AppList';
import composeErrorFormType from 'src/utils/composeErrorFormType';

function ZonesList() {
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
    filters['?^parent_id'] = 'null';
    productCategoriesService.getList({
      filters,
      okCallback: (res) => okGetProductCategories(res),
      koCallback: (err) => koGetProductCategories(err),
    });
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
              id="zone-name"
              label="Zona"
              placeholder="Inserisci zona"
              {... field}
            />
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
    <section id="zones">
      <AppList
        sectionId="zones"
        sectionTitle="Lista Zone"
        SectionServiceClass={ZonesService}
        sectionPath="/zones"
        mapListFn={mapListFn}
        buildColumnsFn={buildColumnsFn}
        buildRowsFn={buildRowsFn}
        creationTitle="Nuova Zona"
        creationBodyFn={() => creationBodyFn()}
        evalCreation={handleSubmit}
        clearCreationModel={() => reset({})}
      />
    </section>
  );
}

export default ZonesList;
