/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CCol, CFormCheck, CRow } from '@coreui/react';
import TourService from 'src/services/api/TourService';

// const TASTING_TIMES_VALUES = [
//   '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
//   '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
//   '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
// ];

const TASTING_TIMES_VALUES = [
  '10:30', '11:00', '14:00', '16:00', '17:00', '18:00',
];

function TastingTimesCheckbox(props) {
  const { data, onChange } = props;
  const [selectedTimes, setSelectedTimes] = useState([]);

  useEffect(() => {
    setSelectedTimes(data);
  }, []);

  const isTimeSelected = (timeValue) => {
    const timeIndex = selectedTimes.findIndex((current) => current === timeValue);
    return timeIndex >= 0;
  };

  const toggleSelectedTime = (timeValue) => {
    const timeIndex = selectedTimes.findIndex((current) => current === timeValue);
    const newSelectedTimes = [...selectedTimes];
    if (timeIndex >= 0) {
      newSelectedTimes.splice(timeIndex, 1);
    } else {
      newSelectedTimes.push(timeValue);
    }
    setSelectedTimes(newSelectedTimes);
    onChange(newSelectedTimes);
  };

  return (
    <>
      <CRow className="pb-4">
        <h4>Orari di degustazione</h4>
        <small>Seleziona gli orari in cui offri il tuo servizio di degustazione</small>
      </CRow>
      <CRow className="pb-4">
        <CCol>
          <div className="checkbox-container-grid">
            {TASTING_TIMES_VALUES.map((currentTime) => (
              <CFormCheck
                inline
                disabled={!isTimeSelected(currentTime) && selectedTimes.length === 6}
                id={`${currentTime}_tasting-time-checkbox`}
                label={currentTime}
                checked={isTimeSelected(currentTime)}
                onChange={() => toggleSelectedTime(currentTime)}
              />
            ))}
          </div>
        </CCol>
      </CRow>
    </>
  );
}

TastingTimesCheckbox.propTypes = {
  data: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

TastingTimesCheckbox.defaultProps = {
  data: [],
};

export default TastingTimesCheckbox;
