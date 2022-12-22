/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CCol, CFormCheck, CRow } from '@coreui/react';
import TourService from 'src/services/api/TourService';

function ServicesCheckbox(props) {
  const { data, onChange } = props;
  const [servicesData, setServicesData] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    const tourService = new TourService();
    const okCallback = (res) => {
      setServicesData(res);
      setSelectedServices(data);
    };

    const koCallback = (err) => {
      console.err(err);
    };

    tourService.getTourGenericServices(okCallback, koCallback);
  }, []);

  const isServiceSelected = (serviceId) => {
    const serviceIndex = selectedServices.findIndex((current) => current._id === serviceId);
    return serviceIndex >= 0;
  };

  const toggleSelectedService = (serviceData) => {
    const serviceIndex = selectedServices.findIndex((current) => current._id === serviceData._id);
    const newSelectedServices = [...selectedServices];
    if (serviceIndex >= 0) {
      newSelectedServices.splice(serviceIndex, 1);
    } else {
      newSelectedServices.push(serviceData);
    }
    setSelectedServices(newSelectedServices);
    onChange(newSelectedServices);
  };

  return (
    <>
      <CRow className="pb-4">
        <h4>Servizi del tour</h4>
      </CRow>
      <CRow className="pb-4">
        {servicesData.map((currentService) => (
          <CCol md={3} className="pb-4" key={`${currentService._id}_service-checkbox_key`}>
            <CFormCheck
              inline
              id={`${currentService._id}_service-checkbox`}
              label={currentService.tag}
              checked={isServiceSelected(currentService._id)}
              onChange={() => toggleSelectedService(currentService)}
            />
          </CCol>
        ))}
      </CRow>
    </>
  );
}

ServicesCheckbox.propTypes = {
  data: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

ServicesCheckbox.defaultProps = {
  data: [],
};

export default ServicesCheckbox;
