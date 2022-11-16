/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/**
 * TODO:
 * Sistemare formulario creazione con pacchetto da discutere con Marco,
 * inclusa validazione prima di salvare
 * Pulire array selezionati dopo la risposta del elimina, una volta sia implementato.
 */
import React, { useState } from 'react';
import {
  CCol,
  CFormInput,
  CRow,
} from '@coreui/react';

import FeedsService from 'src/services/api/FeedsService';
import AppList from 'src/components/ui/List/AppList';

function FeedsList() {
  const [creationModel, setCreationModel] = useState({});
  /** END */
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

  const onChangeCreationModel = (event) => {
    const newCreationModel = { ...creationModel };
    newCreationModel[event.target.name] = event.target.value;
    console.log(`newCreationModel = ${JSON.stringify(newCreationModel)}`);
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
          placeholder="Inserisci feed"
          label="Nome del feed"
          value={creationModel?.name || ''}
          onChange={onChangeCreationModel}
        />
      </CCol>
      <CCol md={6}>
        <CFormInput
          type="text"
          id="code"
          name="code"
          placeholder="Inserisci codice feed"
          label="Codice feed"
          value={creationModel?.name || ''}
          onChange={onChangeCreationModel}
        />
      </CCol>
    </CRow>
  );

  return (
    <section id="feeds">
      <AppList
        sectionTitle="Lista Feeds"
        SectionServiceClass={FeedsService}
        sectionPath="/feeds"
        mapListFn={mapListFn}
        buildColumnsFn={buildColumnsFn}
        buildRowsFn={buildRowsFn}
        creationTitle="Nuovo Feed"
        creationBodyFn={() => creationBodyFn()}
        creationModel={creationModel}
        evalCreation={() => evalCreation()}
        clearCreationModel={() => setCreationModel({})}
      />
    </section>
  );
}
export default FeedsList;
