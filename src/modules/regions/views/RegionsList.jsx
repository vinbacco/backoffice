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

import RegionsService from 'src/services/api/RegionsService';
import AppList from 'src/components/ui/List/AppList';

function RegionsList() {
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
          placeholder="Inserisci regione"
          label="Regione"
          value={creationModel?.name || ''}
          onChange={onChangeCreationModel}
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
        creationModel={creationModel}
        evalCreation={() => evalCreation()}
        clearCreationModel={() => setCreationModel({})}
      />
    </section>
  );
}
export default RegionsList;
