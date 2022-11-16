/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  CCol,
  CFormInput,
  CRow,
} from '@coreui/react';

import ProductTypesService from 'src/services/api/ProductTypesService';
import AppList from 'src/components/ui/List/AppList';

function ProductTypesList() {
  /** FIXME: Usare pacchetto formulari da discutere con Marco */
  const [creationModel, setCreationModel] = useState({});
  /** END */
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

  const onChangeCreationModel = (event) => {
    const newCreationModel = { ...creationModel };
    newCreationModel[event.target.name] = event.target.value;
    setCreationModel(newCreationModel);
  };

  const evalCreation = () => true;

  const creationBodyFn = () => (
    <CRow md={{ cols: 2, gutter: 2 }}>
      <CCol md={6}>
        <CFormInput
          type="text"
          id="name"
          name="name"
          placeholder="Inserisci tipo prodotto"
          label="Tipo prodotto"
          value={creationModel?.name || ''}
          onChange={onChangeCreationModel}
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
        creationModel={creationModel}
        evalCreation={() => evalCreation()}
        clearCreationModel={() => setCreationModel({})}
      />
    </section>
  );
}
export default ProductTypesList;
