import React, { useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import {
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormLabel,
} from '@coreui/react';

import composeErrorFormType from 'src/utils/composeErrorFormType';
import TagsService from 'src/services/api/TagsService';

const WinesForm = ({
  defaultValues = null, submit, formId, parentProps,
}) => {
  const {
    control, handleSubmit, reset, formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      name: '',
      type_tag: null,
    },
  });

  const loadTags = (filter) => new Promise((resolve) => {
    const tagsService = new TagsService();
    const okGetTags = (response) => {
      let responseData = [];
      if (Array.isArray(response.data) && response.data.length > 0) {
        responseData = response.data.map((currentItem) => (
          { value: currentItem._id, label: currentItem.tag }
        ));
      }
      resolve(responseData);
    };
    const koGetTags = () => resolve([]);
    const filters = {
      paginate: 5,
      page: 1,
      feed_id: '637524cccd28fc0016e880cf', // Feed di nome "Tipo Vino"
    };
    if (filter.length > 0) filters['??^tag'] = filter;
    tagsService.getList({
      filters,
      okCallback: (res) => okGetTags(res),
      koCallback: (err) => koGetTags(err),
    });
  });

  useEffect(() => {
    if (typeof parentProps?.show !== 'undefined') {
      if (parentProps.show === false) {
        reset();
      } else {
        let resolveId = parentProps?.target?.data?.id;
        if (typeof resolveId !== 'number') resolveId = null;
        const newData = {
          id: resolveId,
          name: parentProps?.target?.data?.name || '',
          type_tag: parentProps?.target?.data?.type_tag || null,
        };
        reset(newData);
      }
    }
  }, [parentProps.show]);

  return (
    <CForm id={formId} onSubmit={handleSubmit(submit)}>
      <CRow>
        <CCol>
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
                id="name"
                label="Nome"
                placeholder="Inserisci nome vino"
                {... field}
              />
            )}
          />
          <div className="mb-3" />
        </CCol>
        <CCol md={6} sm={12}>
          <Controller
            name="type_tag"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <CFormLabel htmlFor="package-type_tag">Tipo di vino</CFormLabel>
                <AsyncSelect
                  inputId="package-type_tag"
                  isClearable
                  defaultOptions
                  loadOptions={loadTags}
                  {...field}
                />
                {errors.type_tag ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.type_tag)}</div> : null}
              </>
            )}
          />
          <div className="mb-3" />
        </CCol>
      </CRow>
    </CForm>
  );
};

WinesForm.propTypes = {
  defaultValues: PropTypes.shape({
    name: PropTypes.string,
    type_tag: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  }),
  submit: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  parentProps: PropTypes.shape({
    show: PropTypes.bool,
    target: PropTypes.shape({
      data: PropTypes.shape({
        name: PropTypes.string,
        type_tag: PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        }),
        id: PropTypes.number,
      }),
    }) || null,
  }),
};

WinesForm.defaultProps = {
  defaultValues: {
    name: '',
    type_tag: null,
  },
  parentProps: {},
};

export default WinesForm;
