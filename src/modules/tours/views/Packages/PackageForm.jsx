/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes, { string } from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import {
  CForm,
  CFormInput,
  CInputGroup,
  CRow, CCol,
} from '@coreui/react';

const PackageForm = ({ defaultValues = null, submit = () => {} }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: defaultValues || {
      name: '',
      price: '',
      price_type: '',
      services: [],
    },
  });

  return (
    <CForm style={{ padding: '60px 40px' }} onSubmit={handleSubmit(submit || ((data) => console.log(data)))}>
      <CRow>
        <CCol>
          <CInputGroup>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <CFormInput
                  {...field}
                  type="text"
                  placeholder="Inserisci nome"
                  aria-label="Nome"
                  aria-describedby="Nome"
                />
              )}
            />
          </CInputGroup>
          <div className="mb-3" />
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CInputGroup>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <CFormInput
                  {...field}
                  type="text"
                  placeholder="Inserisci prezzo"
                  aria-label="prezzo"
                  aria-describedby="prezzo"
                />
              )}
            />
          </CInputGroup>
          <div className="mb-3" />
        </CCol>
      </CRow>
      <CInputGroup>
        <Controller
          name="price_type"
          control={control}
          render={({ field }) => (
            <CFormInput
              {...field}
              type="text"
              placeholder="Inserisci tipo prezzo"
              aria-label="tipo prezzo"
              aria-describedby="tipo prezzo"
            />
          )}
        />
      </CInputGroup>
      <h3>Servizi</h3>
    </CForm>
  );
};

PackageForm.propTypes = {
  defaultValues: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    price_type: PropTypes.string,
    services: PropTypes.arrayOf({
      _id: string,
      description: string,
    }) || null,
  }),
  submit: PropTypes.func.isRequired,
};

PackageForm.defaultProps = {
  defaultValues: {
    name: '',
    price: '',
    price_type: '',
    services: [],
  },
};

export default PackageForm;
