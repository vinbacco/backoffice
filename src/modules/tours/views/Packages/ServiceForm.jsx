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
      service: '',
    },
  });

  useEffect(() => {
    if (typeof parentProps?.show !== 'undefined' && parentProps.show === false) {
      reset();
    }
  }, [parentProps.show]);

  return (
    <CForm id={formId} onSubmit={handleSubmit(submit)}>
      <CRow>
        <CCol>
          <Controller
            name="service"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field }) => (
              <CFormInput
                invalid={!!errors.service}
                feedback={errors?.service ? composeErrorFormType(errors.service) : null}
                type="text"
                id="service"
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
    service: PropTypes.string,
  }),
  submit: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  parentProps: PropTypes.shape({
    show: PropTypes.bool,
  }),
};

ServiceForm.defaultProps = {
  defaultValues: {
    service: '',
  },
  parentProps: {},
};

export default ServiceForm;
