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
    monday: {
      closed: false,
      timetable: [],
    },
    tuesday: {
      closed: false,
      timetable: [],
    },
    wednesday: {
      closed: false,
      timetable: [],
    },
    thursday: {
      closed: false,
      timetable: [],
    },
    friday: {
      closed: false,
      timetable: [],
    },
    saturday: {
      closed: false,
      timetable: [],
    },
    sunday: {
      closed: false,
      timetable: [],
    },
  });

  useEffect(() => {
    const newTimeTable = { ...timeTable, ...data };
    setTimeTable(newTimeTable);
  }, []);

  const toggleDayAvailability = (dayName) => {
    const newTimeTable = { ...timeTable };
    newTimeTable[dayName].closed = !newTimeTable[dayName].closed;
    setTimeTable(newTimeTable);
    onChange(newTimeTable);
  };

  const handleChangeTimetable = (params) => {
    const {
      day, value,
    } = params;
    const newTimeTable = { ...timeTable };
    newTimeTable[day].timetable = value;
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
                checked={timeTable.monday.closed}
                onChange={() => toggleDayAvailability('monday')}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={8}>
          <TimesCheckbox
            disabled={timeTable.monday.closed === true}
            title="Orario"
            description="Seleziona l'orario disponibile per le prenotazioni"
            data={timeTable.monday.timetable}
            options={TOUR_BOOKING_OPTIONS}
            onChange={(value) => handleChangeTimetable({ day: 'monday', value })}
          />
        </CCol>
      </CRow>
      <hr />
      <CRow className="pb-4">
        <CCol md={4}>
          <CRow>
            <CCol md={6}>
              <h4>MARTEDÌ</h4>
            </CCol>
            <CCol md={6}>
              <CFormCheck
                inline
                id="tuesdayAvailableCheckbox"
                label="Chiusura"
                checked={timeTable.tuesday.closed}
                onChange={() => toggleDayAvailability('tuesday')}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={8}>
          <TimesCheckbox
            disabled={timeTable.tuesday.closed === true}
            title="Orario"
            description="Seleziona l'orario disponibile per le prenotazioni"
            data={timeTable.tuesday.timetable}
            options={TOUR_BOOKING_OPTIONS}
            onChange={(value) => handleChangeTimetable({ day: 'tuesday', value })}
          />
        </CCol>
      </CRow>
      <hr />
      <CRow className="pb-4">
        <CCol md={4}>
          <CRow>
            <CCol md={6}>
              <h4>MERCOLEDÌ</h4>
            </CCol>
            <CCol md={6}>
              <CFormCheck
                inline
                id="wednesdayAvailableCheckbox"
                label="Chiusura"
                checked={timeTable.wednesday.closed}
                onChange={() => toggleDayAvailability('wednesday')}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={8}>
          <TimesCheckbox
            disabled={timeTable.wednesday.closed === true}
            title="Orario"
            description="Seleziona l'orario disponibile per le prenotazioni"
            data={timeTable.wednesday.timetable}
            options={TOUR_BOOKING_OPTIONS}
            onChange={(value) => handleChangeTimetable({ day: 'wednesday', value })}
          />
        </CCol>
      </CRow>
      <hr />
      <CRow className="pb-4">
        <CCol md={4}>
          <CRow>
            <CCol md={6}>
              <h4>GIOVEDÌ</h4>
            </CCol>
            <CCol md={6}>
              <CFormCheck
                inline
                id="thursdayAvailableCheckbox"
                label="Chiusura"
                checked={timeTable.thursday.closed}
                onChange={() => toggleDayAvailability('thursday')}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={8}>
          <TimesCheckbox
            disabled={timeTable.thursday.closed === true}
            title="Orario"
            description="Seleziona l'orario disponibile per le prenotazioni"
            data={timeTable.thursday.timetable}
            options={TOUR_BOOKING_OPTIONS}
            onChange={(value) => handleChangeTimetable({ day: 'thursday', value })}
          />
        </CCol>
      </CRow>
      <hr />
      <CRow className="pb-4">
        <CCol md={4}>
          <CRow>
            <CCol md={6}>
              <h4>VENERDÌ</h4>
            </CCol>
            <CCol md={6}>
              <CFormCheck
                inline
                id="fridayAvailableCheckbox"
                label="Chiusura"
                checked={timeTable.friday.closed}
                onChange={() => toggleDayAvailability('friday')}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={8}>
          <TimesCheckbox
            disabled={timeTable.friday.closed === true}
            title="Orario"
            description="Seleziona l'orario disponibile per le prenotazioni"
            data={timeTable.friday.timetable}
            options={TOUR_BOOKING_OPTIONS}
            onChange={(value) => handleChangeTimetable({ day: 'friday', value })}
          />
        </CCol>
      </CRow>
      <hr />
      <CRow className="pb-4">
        <CCol md={4}>
          <CRow>
            <CCol md={6}>
              <h4>SABATO</h4>
            </CCol>
            <CCol md={6}>
              <CFormCheck
                inline
                id="saturdayAvailableCheckbox"
                label="Chiusura"
                checked={timeTable.saturday.closed}
                onChange={() => toggleDayAvailability('saturday')}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={8}>
          <TimesCheckbox
            disabled={timeTable.saturday.closed === true}
            title="Orario"
            description="Seleziona l'orario disponibile per le prenotazioni"
            data={timeTable.saturday.timetable}
            options={TOUR_BOOKING_OPTIONS}
            onChange={(value) => handleChangeTimetable({ day: 'saturday', value })}
          />
        </CCol>
      </CRow>
      <hr />
      <CRow className="pb-4">
        <CCol md={4}>
          <CRow>
            <CCol md={6}>
              <h4>DOMENICA</h4>
            </CCol>
            <CCol md={6}>
              <CFormCheck
                inline
                id="sundayAvailableCheckbox"
                label="Chiusura"
                checked={timeTable.sunday.closed}
                onChange={() => toggleDayAvailability('sunday')}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={8}>
          <TimesCheckbox
            disabled={timeTable.sunday.closed === true}
            title="Orario"
            description="Seleziona l'orario disponibile per le prenotazioni"
            data={timeTable.sunday.timetable}
            options={TOUR_BOOKING_OPTIONS}
            onChange={(value) => handleChangeTimetable({ day: 'sunday', value })}
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
