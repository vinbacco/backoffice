/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  CCol,
  CFormInput,
  CRow,
} from '@coreui/react';

import TagsService from 'src/services/api/TagsService';
import AppList from 'src/components/ui/List/AppList';

function TagsList() {
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
          placeholder="Inserisci Tag"
          label="Nome del tag"
          value={creationModel?.name || ''}
          onChange={onChangeCreationModel}
        />
      </CCol>
      <CCol md={6}>
        <CFormInput
          type="text"
          id="code"
          name="code"
          placeholder="Inserisci codice tag"
          label="Codice tag"
          value={creationModel?.name || ''}
          onChange={onChangeCreationModel}
        />
      </CCol>
    </CRow>
  );

  return (
    <section id="tags">
      <AppList
        sectionTitle="Lista Tags"
        SectionServiceClass={TagsService}
        sectionPath="/tags"
        mapListFn={mapListFn}
        buildColumnsFn={buildColumnsFn}
        buildRowsFn={buildRowsFn}
        creationTitle="Nuovo Tag"
        creationBodyFn={() => creationBodyFn()}
        creationModel={creationModel}
        evalCreation={() => evalCreation()}
        clearCreationModel={() => setCreationModel({})}
      />
    </section>
  );
}
export default TagsList;
