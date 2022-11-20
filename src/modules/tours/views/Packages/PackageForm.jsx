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
      id: null,
      name_option: null,
      price: '',
      price_type_option: null,
      services: [],
    },
  });
  const [state, setState] = useState(defaultValues || {
    id: null,
    name_option: '',
    price: '',
    price_type_option: '',
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

  const insertService = (data, formProps) => {
    const newState = { ...getValues() };
    newState.services.push(data);
    setValue('services', [...newState.services]);
    setState(newState);
    formProps.closeModal();
  };

  const editService = (data, formProps) => {
    const newState = { ...getValues() };
    if (typeof data.id === 'number' && data.id >= 0) {
      const clearData = { ...data };
      delete clearData.id;
      newState.services[data.id] = (clearData);
      setValue('services', [...newState.services]);
      setState(newState);
    }
    formProps.closeModal();
  };

  const deleteService = (data) => {
    const newState = { ...getValues() };
    if (typeof data.id === 'number' && data.id >= 0) {
      newState.services.splice(data.id, 1);
      setValue('services', [...newState.services]);
      setState(newState);
    }
  };

  useEffect(() => {
    if (typeof parentProps?.show !== 'undefined') {
      if (parentProps.show === false) {
        reset();
        setState(defaultValues || {});
      } else {
        let resolveId = parentProps?.target?.data?.id;
        if (typeof resolveId !== 'number') resolveId = null;
        const newData = {
          id: resolveId,
          name_option: parentProps?.target?.data?.name_option || null,
          price: parentProps?.target?.data?.price || '',
          price_type_option: parentProps?.target?.data?.price_type_option || null,
          services: [...(parentProps?.target?.data?.services || [])],
        };
        reset(newData);
        setState(newData);
      }
    }
  }, [parentProps.show]);

  return (
    <>
      <CForm id={formId} onSubmit={handleSubmit(submit)}>
        <CRow>
          <CCol md={6} sm={12}>
            <Controller
              name="name_option"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <CFormLabel htmlFor="package-name_option">Nome</CFormLabel>
                  <AsyncSelect
                    inputId="package-name_option"
                    isClearable
                    defaultOptions
                    loadOptions={loadTags}
                    {...field}
                  />
                  {errors.name_option ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.name_option)}</div> : null}
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
              defaultValue=""
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
              name="price_type_option"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <CFormLabel htmlFor="package-price_type_option">Tipologia prezzo</CFormLabel>
                  <AsyncSelect
                    inputId="package-price_type_option"
                    isClearable
                    defaultOptions
                    loadOptions={loadPriceTypes}
                    {...field}
                  />
                  {errors.price_type_option ? <div className="invalid-feedback d-block">{composeErrorFormType(errors.price_type_option)}</div> : null}
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
          formId: 'create_servizio-pacchetto',
          submit: (data) => insertService(data, CreateFormProps),
          parentProps: {
            show: CreateFormProps.show,
          },
        })}
        editFormComponent={(EditFormProps) => ServiceForm({
          formId: 'edit_servizio-pacchetto',
          submit: (data) => editService(data, EditFormProps),
          parentProps: {
            show: EditFormProps.show,
            target: EditFormProps.target,
          },
        })}
        deleteFunction={(deleteProps) => deleteService({
          id: deleteProps.target,
        })}
        data={state.services || null}
        columns={['service_name']}
        modalAlign="center"
      />
    </>
  );
};

PackageForm.propTypes = {
  defaultValues: PropTypes.shape({
    name_option: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
    price: PropTypes.number,
    price_type_option: PropTypes.shape({
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
    target: PropTypes.shape({
      data: PropTypes.shape({
        id: PropTypes.number,
        name_option: PropTypes.string,
        price: PropTypes.string,
        price_type_option: PropTypes.string,
        services: PropTypes.arrayOf(PropTypes.string),
      }),
    }) || null,
  }),
};

PackageForm.defaultProps = {
  defaultValues: {
    id: null,
    name_option: null,
    price: '',
    price_type_option: null,
    services: [],
  },
  parentProps: {},
};

export default PackageForm;
