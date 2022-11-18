/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
  CCol,
  CFormInput,
  CRow,
} from '@coreui/react';
import { useForm, Controller } from 'react-hook-form';

import TagsService from 'src/services/api/TagsService';
import AppList from 'src/components/ui/List/AppList';
import composeErrorFormType from 'src/utils/composeErrorFormType';

function TagsList() {
  const {
    control, handleSubmit, reset, getValues, formState: { errors },
  } = useForm();

  const buildColumnsFn = () => ([
    {
      key: 'tag',
      label: 'Tag',
      sortable: true,
      _props: { scope: 'col' },
    },
  ]);

  const buildRowsFn = (item) => ({
    _id: item._id,
    tag: item.tag,
  });

  const mapListFn = (item) => ({
    _id: item._id,
    tag: item.tag,
  });

  const creationBodyFn = () => (
    <CRow md={{ cols: 2, gutter: 2 }}>
      <CCol md={6}>
        <Controller
          name="tag"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => (
            <CFormInput
              invalid={!!errors.tag}
              feedback={errors?.tag ? composeErrorFormType(errors.tag) : null}
              type="text"
              id="tag-tag"
              label="Nome del tag"
              placeholder="Inserisci tag"
              {... field}
            />
          )}
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
        evalCreation={handleSubmit}
        clearCreationModel={() => reset({})}
      />
    </section>
  );
}
export default TagsList;
