/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import PropTypes, { string } from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import {
  CForm,
  CFormInput,
  CInputGroup,
  CRow, CCol, CFormLabel, CInputGroupText,
} from '@coreui/react';
import composeErrorFormType from 'src/utils/composeErrorFormType';
import TagsService from 'src/services/api/TagsService';
import AppMultiData from 'src/components/ui/MultiData/AppMultiData';
import ServiceForm from './ServiceForm';

const PackageForm = ({
  defaultValues, submit, formId, parentProps,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      name: null,
      price: '',
      price_type: null,
      services: [],
    },
  });
  const [state, setState] = useState(defaultValues || {
    name: '',
    price: '',
    price_type: '',
    services: [],
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
      feed_id: '63750cc287c76e0016974c14', // Feed di nome "Pacchetto"
    };
    if (filter.length > 0) filters['??^tag'] = filter;
    tagsService.getList({
      filters,
      okCallback: (res) => okGetTags(res),
      koCallback: (err) => koGetTags(err),
    });
  });

  const loadPriceTypes = (filter) => new Promise((resolve) => {
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
      feed_id: '63751cfe87c76e0016974c17', // Feed di nome "Tipo prezzo pacchetto"
    };
    if (filter.length > 0) filters['??^tag'] = filter;
    tagsService.getList({
      filters,
      okCallback: (res) => okGetTags(res),
      koCallback: (err) => koGetTags(err),
    });
  });

  const insertService = (data, CreateFormProps) => {
    const newState = { ...getValues() };
    newState.services.push(data);
    setValue('services', [...newState.services]);
    setState(newState);
    CreateFormProps.closeModal();
  };

  useEffect(() => {
    if (typeof parentProps?.show !== 'undefined' && parentProps.show === false) {
      reset();
      setState(defaultValues || {});
    }
  }, [parentProps.show]);

  return (
    <>
      <CForm id={formId} onSubmit={handleSubmit(submit)}>
        <CRow>
          <CCol md={6} sm={12}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <CFormLabel htmlFor="package-name">Nome</CFormLabel>
                  <AsyncSelect
                    inputId="package-name"
                    isClearable
                    defaultOptions
                    loadOptions={loadTags}
                    {...field}
                  />
                  {errors.tag_id ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.tag_id)}</div> : null}
                </>
              )}
            />
            <div className="mb-3" />
          </CCol>
        </CRow>
        <CRow>
          <CCol md={6} sm={12}>
            <Controller
              name="price"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CFormInput
                  invalid={!!errors.price}
                  feedback={errors?.price ? composeErrorFormType(errors.price) : null}
                  type="text"
                  id="price"
                  label="Prezzo (€)"
                  placeholder="Inserisci prezzo"
                  {... field}
                />
              )}
            />
            <div className="mb-3" />
          </CCol>
          <CCol md={6} sm={12}>
            <Controller
              name="price_type"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <CFormLabel htmlFor="package-price_type">Tipologia prezzo</CFormLabel>
                  <AsyncSelect
                    inputId="package-price_type"
                    isClearable
                    defaultOptions
                    loadOptions={loadPriceTypes}
                    {...field}
                  />
                  {errors.price_type_id ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.price_type_id)}</div> : null}
                </>
              )}
            />
            <div className="mb-3" />
          </CCol>
        </CRow>
      </CForm>
      <AppMultiData
        title="Servizi inclusi"
        item="Servizio"
        formId="servizio-pacchetto"
        createFormComponent={(CreateFormProps) => ServiceForm({
          formId: 'servizio-pacchetto',
          submit: (data) => insertService(data, CreateFormProps),
          parentProps: {
            show: CreateFormProps.show,
          },
        })}
        data={state.services || null}
        columns={['service']}
        modalAlign="center"
      />
    </>
  );
};

PackageForm.propTypes = {
  defaultValues: PropTypes.shape({
    name: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
    price: PropTypes.number,
    price_type: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
    services: PropTypes.arrayOf({
      _id: string,
      description: string,
    }) || null,
  }),
  formId: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
  parentProps: PropTypes.shape({
    show: PropTypes.bool,
  }),
};

PackageForm.defaultProps = {
  defaultValues: {
    name: null,
    price: '',
    price_type: null,
    services: [],
  },
  parentProps: {},
};

export default PackageForm;
