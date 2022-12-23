/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CRow,
  CCol,
  CFormCheck,
} from '@coreui/react';

import TimeInput from './TimeInput';

function TimeTable(props) {
  const { data, onChange } = props;
  const [timeTable, setTimeTable] = useState({
    monday: {
      closed: false,
      timetables: {
        morning: {
          start: '00:00',
          end: '00:00',
        },
        evening: {
          start: '00:00',
          end: '00:00',
        },
      },
    },
    tuesday: {
      closed: false,
      timetables: {
        morning: {
          start: '00:00',
          end: '00:00',
        },
        evening: {
          start: '00:00',
          end: '00:00',
        },
      },
    },
    wednesday: {
      closed: false,
      timetables: {
        morning: {
          start: '00:00',
          end: '00:00',
        },
        evening: {
          start: '00:00',
          end: '00:00',
        },
      },
    },
    thursday: {
      closed: false,
      timetables: {
        morning: {
          start: '00:00',
          end: '00:00',
        },
        evening: {
          start: '00:00',
          end: '00:00',
        },
      },
    },
    friday: {
      closed: false,
      timetables: {
        morning: {
          start: '00:00',
          end: '00:00',
        },
        evening: {
          start: '00:00',
          end: '00:00',
        },
      },
    },
    saturday: {
      closed: false,
      timetables: {
        morning: {
          start: '00:00',
          end: '00:00',
        },
        evening: {
          start: '00:00',
          end: '00:00',
        },
      },
    },
    sunday: {
      closed: false,
      timetables: {
        morning: {
          start: '00:00',
          end: '00:00',
        },
        evening: {
          start: '00:00',
          end: '00:00',
        },
      },
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
      day, period, block, value,
    } = params;
    const newTimeTable = { ...timeTable };
    newTimeTable[day].timetables[period][block] = value;
    setTimeTable(newTimeTable);
    onChange(newTimeTable);
  };

  return (
    <>
      <CRow className="pb-4">
        <h4>Orari del tour</h4>
      </CRow>
      <CRow className="pb-4">
        <CCol md={4}>
          <h4>LUNEDÌ</h4>
          <CFormCheck
            inline
            id="mondayAvailableCheckbox"
            label="Chiusura"
            checked={timeTable.monday.closed}
            onChange={() => toggleDayAvailability('monday')}
          />
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Mattina</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.monday.closed}
                id="monday-morning-start"
                label="Dalle"
                value={timeTable.monday.timetables.morning.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'monday', period: 'morning', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.monday.closed}
                id="monday-morning-end"
                label="Alle"
                value={timeTable.monday.timetables.morning.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'monday', period: 'morning', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Pomeriggio</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.monday.closed}
                id="monday-evening-start"
                label="Dalle"
                value={timeTable.monday.timetables.evening.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'monday', period: 'evening', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.monday.closed}
                id="monday-evening-end"
                label="Alle"
                value={timeTable.monday.timetables.evening.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'monday', period: 'evening', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CRow className="pb-4"><hr /></CRow>
      <CRow className="pb-4">
        <CCol md={4}>
          <h4>MARTEDÌ</h4>
          <CFormCheck
            inline
            id="tuesdayAvailableCheckbox"
            label="Chiusura"
            checked={timeTable.tuesday.closed}
            onChange={() => toggleDayAvailability('tuesday')}
          />
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Mattina</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.tuesday.closed}
                id="tuesday-morning-start"
                label="Dalle"
                value={timeTable.tuesday.timetables.morning.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'tuesday', period: 'morning', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.tuesday.closed}
                id="tuesday-morning-end"
                label="Alle"
                value={timeTable.tuesday.timetables.morning.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'tuesday', period: 'morning', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Pomeriggio</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.tuesday.closed}
                id="tuesday-evening-start"
                label="Dalle"
                value={timeTable.tuesday.timetables.evening.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'tuesday', period: 'evening', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.tuesday.closed}
                id="tuesday-evening-end"
                label="Alle"
                value={timeTable.tuesday.timetables.evening.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'tuesday', period: 'evening', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CRow className="pb-4"><hr /></CRow>
      <CRow className="pb-4">
        <CCol md={4}>
          <h4>MERCOLEDÌ</h4>
          <CFormCheck
            inline
            id="wednesdayAvailableCheckbox"
            label="Chiusura"
            checked={timeTable.wednesday.closed}
            onChange={() => toggleDayAvailability('wednesday')}
          />
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Mattina</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.wednesday.closed}
                id="wednesday-morning-start"
                label="Dalle"
                value={timeTable.wednesday.timetables.morning.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'wednesday', period: 'morning', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.wednesday.closed}
                id="wednesday-morning-end"
                label="Alle"
                value={timeTable.wednesday.timetables.morning.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'wednesday', period: 'morning', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Pomeriggio</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.wednesday.closed}
                id="wednesday-evening-start"
                label="Dalle"
                value={timeTable.wednesday.timetables.evening.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'wednesday', period: 'evening', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.wednesday.closed}
                id="wednesday-evening-end"
                label="Alle"
                value={timeTable.wednesday.timetables.evening.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'wednesday', period: 'evening', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CRow className="pb-4"><hr /></CRow>
      <CRow className="pb-4">
        <CCol md={4}>
          <h4>GIOVEDÌ</h4>
          <CFormCheck
            inline
            id="thursdayAvailableCheckbox"
            label="Chiusura"
            checked={timeTable.thursday.closed}
            onChange={() => toggleDayAvailability('thursday')}
          />
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Mattina</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.thursday.closed}
                id="thursday-morning-start"
                label="Dalle"
                value={timeTable.thursday.timetables.morning.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'thursday', period: 'morning', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.thursday.closed}
                id="thursday-morning-end"
                label="Alle"
                value={timeTable.thursday.timetables.morning.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'thursday', period: 'morning', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Pomeriggio</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.thursday.closed}
                id="thursday-evening-start"
                label="Dalle"
                value={timeTable.thursday.timetables.evening.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'thursday', period: 'evening', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.thursday.closed}
                id="thursday-evening-end"
                label="Alle"
                value={timeTable.thursday.timetables.evening.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'thursday', period: 'evening', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CRow className="pb-4"><hr /></CRow>
      <CRow className="pb-4">
        <CCol md={4}>
          <h4>VENERDÌ</h4>
          <CFormCheck
            inline
            id="fridayAvailableCheckbox"
            label="Chiusura"
            checked={timeTable.friday.closed}
            onChange={() => toggleDayAvailability('friday')}
          />
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Mattina</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.friday.closed}
                id="friday-morning-start"
                label="Dalle"
                value={timeTable.friday.timetables.morning.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'friday', period: 'morning', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.friday.closed}
                id="friday-morning-end"
                label="Alle"
                value={timeTable.friday.timetables.morning.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'friday', period: 'morning', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Pomeriggio</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.friday.closed}
                id="friday-evening-start"
                label="Dalle"
                value={timeTable.friday.timetables.evening.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'friday', period: 'evening', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.friday.closed}
                id="friday-evening-end"
                label="Alle"
                value={timeTable.friday.timetables.evening.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'friday', period: 'evening', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CRow className="pb-4"><hr /></CRow>
      <CRow className="pb-4">
        <CCol md={4}>
          <h4>SABATO</h4>
          <CFormCheck
            inline
            id="saturdayAvailableCheckbox"
            label="Chiusura"
            checked={timeTable.saturday.closed}
            onChange={() => toggleDayAvailability('saturday')}
          />
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Mattina</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.saturday.closed}
                id="saturday-morning-start"
                label="Dalle"
                value={timeTable.saturday.timetables.morning.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'saturday', period: 'morning', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.saturday.closed}
                id="saturday-morning-end"
                label="Alle"
                value={timeTable.saturday.timetables.morning.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'saturday', period: 'morning', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Pomeriggio</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.saturday.closed}
                id="saturday-evening-start"
                label="Dalle"
                value={timeTable.saturday.timetables.evening.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'saturday', period: 'evening', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.saturday.closed}
                id="saturday-evening-end"
                label="Alle"
                value={timeTable.saturday.timetables.evening.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'saturday', period: 'evening', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CRow className="pb-4"><hr /></CRow>
      <CRow className="pb-4">
        <CCol md={4}>
          <h4>DOMENICA</h4>
          <CFormCheck
            inline
            id="sundayAvailableCheckbox"
            label="Chiusura"
            checked={timeTable.sunday.closed}
            onChange={() => toggleDayAvailability('sunday')}
          />
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Mattina</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.sunday.closed}
                id="sunday-morning-start"
                label="Dalle"
                value={timeTable.sunday.timetables.morning.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'sunday', period: 'morning', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.sunday.closed}
                id="sunday-morning-end"
                label="Alle"
                value={timeTable.sunday.timetables.morning.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'sunday', period: 'morning', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
        </CCol>
        <CCol md={4}>
          <h5 style={{ textAlign: 'center' }}>Pomeriggio</h5>
          <CRow>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.sunday.closed}
                id="sunday-evening-start"
                label="Dalle"
                value={timeTable.sunday.timetables.evening.start}
                onChange={(value) => handleChangeTimetable({
                  day: 'sunday', period: 'evening', block: 'start', value,
                })}
              />
            </CCol>
            <CCol md={6}>
              <TimeInput
                disabled={timeTable.sunday.closed}
                id="sunday-evening-end"
                label="Alle"
                value={timeTable.sunday.timetables.evening.end}
                onChange={(value) => handleChangeTimetable({
                  day: 'sunday', period: 'evening', block: 'end', value,
                })}
              />
            </CCol>
          </CRow>
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
