/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import {
  CForm,
  CRow,
  CCol,
  CFormInput,
} from '@coreui/react';

import composeErrorFormType from 'src/utils/composeErrorFormType';

const ServiceForm = ({
  defaultValues = null, submit, formId, parentProps,
}) => {
  const {
    control, handleSubmit, reset, formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      service_name: '',
    },
  });

  useEffect(() => {
    if (typeof parentProps?.show !== 'undefined') {
      if (parentProps.show === false) {
        reset();
      } else {
        reset(parentProps?.target?.data || {});
      }
    }
  }, [parentProps.show]);

  return (
    <CForm id={formId} onSubmit={handleSubmit(submit)}>
      <CRow>
        <CCol>
          <Controller
            name="service_name"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field }) => (
              <CFormInput
                invalid={!!errors.service_name}
                feedback={errors?.service_name ? composeErrorFormType(errors.service_name) : null}
                type="text"
                id="service_name"
                label="Servizio"
                placeholder="Inserisci servizio"
                {... field}
              />
            )}
          />
          <div className="mb-3" />
        </CCol>
      </CRow>
    </CForm>
  );
};

ServiceForm.propTypes = {
  defaultValues: PropTypes.shape({
    service_name: PropTypes.string,
  }),
  submit: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  parentProps: PropTypes.shape({
    show: PropTypes.bool,
    target: PropTypes.shape({
      data: PropTypes.shape({
        service_name: PropTypes.string,
        id: PropTypes.number,
      }),
    }) || null,
  }),
};

ServiceForm.defaultProps = {
  defaultValues: {
    service_name: '',
  },
  parentProps: {},
};

export default ServiceForm;
