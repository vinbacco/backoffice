/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CRow,
  CCol,
  CFormCheck,
} from '@coreui/react';

import TimesCheckbox from '../TimesCheckbox/TimesCheckbox';

const TOUR_BOOKING_OPTIONS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
];

function TimeTable(props) {
  const { data, onChange } = props;
  const [timeTable, setTimeTable] = useState({
    availableDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    availableHours: [],
  });

  useEffect(() => {
    const newTimeTable = { ...timeTable, ...data };
    setTimeTable(newTimeTable);
  }, []);

  const toggleDayAvailability = (dayName) => {
    const newTimeTable = { ...timeTable };
    newTimeTable.availableDays[dayName] = !newTimeTable.availableDays[dayName];
    setTimeTable(newTimeTable);
    onChange(newTimeTable);
  };

  const handleChangeTimetable = (params) => {
    const {
      value,
    } = params;
    const newTimeTable = { ...timeTable };
    newTimeTable.availableHours = value;
    setTimeTable(newTimeTable);
    onChange(newTimeTable);
  };

  return (
    <>
      <CRow className="pb-4">
        <h4>Orari e giorni del tour</h4>
      </CRow>
      <CRow className="pb-4">
        <CCol md={4}>
          <CRow>
            <CCol md={6}>
              <h4>LUNEDÌ</h4>
            </CCol>
            <CCol md={6}>
              <CFormCheck
                inline
                id="mondayAvailableCheckbox"
                label="Chiusura"
                checked={timeTable.availableDays.monday}
                onChange={() => toggleDayAvailability('monday')}
              />
            </CCol>
          </CRow>
          <hr />
          <CRow>
            <CCol md={6}>
              <h4>MARTEDÌ</h4>
            </CCol>
            <CCol md={6}>
              <CFormCheck
                inline
                id="tuesdayAvailableCheckbox"
                label="Chiusura"
                checked={timeTable.availableDays.tuesday}
                onChange={() => toggleDayAvailability('tuesday')}
              />
            </CCol>
          </CRow>
          <hr />
          <CRow>
            <CCol md={6}>
              <h4>MERCOLEDÌ</h4>
            </CCol>
            <CCol md={6}>
              <CFormCheck
                inline
                id="wednesdayAvailableCheckbox"
                label="Chiusura"
                checked={timeTable.availableDays.wednesday}
                onChange={() => toggleDayAvailability('wednesday')}
              />
            </CCol>
          </CRow>
          <hr />
          <CRow>
            <CCol md={6}>
              <h4>GIOVEDÌ</h4>
            </CCol>
            <CCol md={6}>
              <CFormCheck
                inline
                id="thursdayAvailableCheckbox"
                label="Chiusura"
                checked={timeTable.availableDays.thursday}
                onChange={() => toggleDayAvailability('thursday')}
              />
            </CCol>
          </CRow>
          <hr />
          <CRow>
            <CCol md={6}>
              <h4>VENERDÌ</h4>
            </CCol>
            <CCol md={6}>
              <CFormCheck
                inline
                id="fridayAvailableCheckbox"
                label="Chiusura"
                checked={timeTable.availableDays.friday}
                onChange={() => toggleDayAvailability('friday')}
              />
            </CCol>
          </CRow>
          <hr />
          <CRow>
            <CCol md={6}>
              <h4>SABATO</h4>
            </CCol>
            <CCol md={6}>
              <CFormCheck
                inline
                id="saturdayAvailableCheckbox"
                label="Chiusura"
                checked={timeTable.availableDays.saturday}
                onChange={() => toggleDayAvailability('saturday')}
              />
            </CCol>
          </CRow>
          <hr />
          <CRow>
            <CCol md={6}>
              <h4>DOMENICA</h4>
            </CCol>
            <CCol md={6}>
              <CFormCheck
                inline
                id="sundayAvailableCheckbox"
                label="Chiusura"
                checked={timeTable.availableDays.sunday}
                onChange={() => toggleDayAvailability('sunday')}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={8}>
          <TimesCheckbox
            title="Orario"
            description="Seleziona l'orario disponibile per le prenotazioni"
            data={timeTable.availableHours}
            options={TOUR_BOOKING_OPTIONS}
            onChange={(value) => handleChangeTimetable({ value })}
          />
        </CCol>
      </CRow>
    </>
  );
}

TimeTable.propTypes = {
  data: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

TimeTable.defaultProps = {
  data: {},
};

export default TimeTable;
