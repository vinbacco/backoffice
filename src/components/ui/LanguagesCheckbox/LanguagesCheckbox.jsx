/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CCol, CFormCheck, CRow } from '@coreui/react';
import TourService from 'src/services/api/TourService';

function LanguagesCheckbox(props) {
  const { data, onChange } = props;
  const [languagesData, setLanguagesData] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  useEffect(() => {
    const tourService = new TourService();
    const okCallback = (res) => {
      setLanguagesData(res);
      setSelectedLanguages(data);
    };

    const koCallback = (err) => {
      console.err(err);
    };

    tourService.getTourAvailableLanguages(okCallback, koCallback);
  }, []);

  const isLanguageSelected = (languageId) => {
    const languageIndex = selectedLanguages.findIndex((current) => current._id === languageId);
    return languageIndex >= 0;
  };

  const toggleSelectedService = (serviceData) => {
    const languageIndex = selectedLanguages.findIndex((current) => current._id === serviceData._id);
    const newSelectedLanguages = [...selectedLanguages];
    if (languageIndex >= 0) {
      newSelectedLanguages.splice(languageIndex, 1);
    } else {
      newSelectedLanguages.push(serviceData);
    }
    setSelectedLanguages(newSelectedLanguages);
    onChange(newSelectedLanguages);
  };

  return (
    <>
      <CRow className="pb-4">
        <h4>Linguaggi del tour</h4>
      </CRow>
      <CRow className="pb-4">
        {languagesData.map((currentLanguage) => (
          <CCol md={3} className="pb-4" key={`${currentLanguage._id}_language-checkbox_key`}>
            <CFormCheck
              inline
              id={`${currentLanguage._id}_language-checkbox`}
              label={currentLanguage.tag}
              checked={isLanguageSelected(currentLanguage._id)}
              onChange={() => toggleSelectedService(currentLanguage)}
            />
          </CCol>
        ))}
      </CRow>
    </>
  );
}

LanguagesCheckbox.propTypes = {
  data: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

LanguagesCheckbox.defaultProps = {
  data: [],
};

export default LanguagesCheckbox;
