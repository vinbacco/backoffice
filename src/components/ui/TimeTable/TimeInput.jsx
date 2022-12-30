/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const REGEX_HOURS = /^(2[0-3]|[01]?[0-9])$/;
const REGEX_MINUTES = /^(([0]?[0-9])|([1-5][0-9]))$/;

function TimeInput(props) {
  const {
    label, value, id, disabled, onChange,
  } = props;

  const [timeValue, setTimeValue] = useState({
    hour: '00',
    minute: '00',
  });

  useEffect(() => {
    const propValueFormat = value.split(':');
    setTimeValue({
      hour: propValueFormat[0] || '00',
      minute: propValueFormat[1] || '00',
    });
  }, [value]);

  const handleChangeTime = (fieldName, fieldValue) => {
    let valueIsValid = true;
    const newTimeValue = { ...timeValue };
    let newFieldValue = '';
    if (fieldValue.length > 0) {
      newFieldValue = parseInt(fieldValue, 10);
      if (Number.isNaN(newFieldValue)) newFieldValue = '';
      else if (fieldName === 'hour') valueIsValid = REGEX_HOURS.test(newFieldValue);
      else if (fieldName === 'minute') valueIsValid = REGEX_MINUTES.test(newFieldValue);
    }
    if (valueIsValid) {
      newTimeValue[fieldName] = newFieldValue;
      setTimeValue(newTimeValue);
    }
  };

  const handleKeyDown = (fieldName, event) => {
    const keyPressed = event.key;
    const newTimeValue = { ...timeValue };
    let newFieldValue = parseInt(timeValue[fieldName], 10);
    if (keyPressed === 'ArrowUp' || keyPressed === 'ArrowDown' || keyPressed === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      if (keyPressed === 'Enter') {
        event.target.blur();
        return;
      }
      if (keyPressed === 'ArrowUp') {
        newFieldValue += 1;
      } else if (keyPressed === 'ArrowDown') {
        newFieldValue -= 1;
      }
      if (fieldName === 'hour') {
        if (newFieldValue > 23) newFieldValue = 0;
        if (newFieldValue < 0) newFieldValue = 23;
      } else if (fieldName === 'minute') {
        if (newFieldValue > 59) newFieldValue = 0;
        if (newFieldValue < 0) newFieldValue = 59;
      }
      newTimeValue[fieldName] = newFieldValue > 9 ? `${newFieldValue}` : `0${newFieldValue}`;
      setTimeValue(newTimeValue);
    }
  };

  const handleBlurTime = (fieldName) => {
    const newTimeValue = { ...timeValue };
    let newFieldValue = parseInt(timeValue[fieldName] || 0, 10);
    if (fieldName === 'hour') {
      if (newFieldValue > 23) newFieldValue = 0;
      if (newFieldValue < 0) newFieldValue = 23;
    } else if (fieldName === 'minute') {
      if (newFieldValue > 59) newFieldValue = 0;
      if (newFieldValue < 0) newFieldValue = 59;
    }
    newTimeValue[fieldName] = newFieldValue > 9 ? `${newFieldValue}` : `0${newFieldValue}`;
    setTimeValue(newTimeValue);
    onChange(`${newTimeValue.hour}:${newTimeValue.minute}`);
  };

  return (
    <div className="time-input-container">
      <label className="time-input-label" htmlFor={`time-input-field-hour_${id}`}>{label}</label>
      <div className="time-input-fields">
        <input
          disabled={disabled}
          type="text"
          id={`time-input-field-hour_${id}`}
          className="time-input-field-hour"
          value={timeValue.hour}
          onBlur={() => handleBlurTime('hour')}
          onKeyDown={(event) => handleKeyDown('hour', event)}
          onChange={(event) => handleChangeTime('hour', event.target.value)}
        />
        <span className="time-input-field-separator">:</span>
        <input
          disabled={disabled}
          type="text"
          id={`time-input-field-minute_${id}`}
          className="time-input-field-minute"
          value={timeValue.minute}
          onBlur={() => handleBlurTime('minute')}
          onKeyDown={(event) => handleKeyDown('minute', event)}
          onChange={(event) => handleChangeTime('minute', event.target.value)}
        />
      </div>
    </div>
  );
}

TimeInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

TimeInput.defaultProps = {
  label: 'Time',
  id: 'time-input-id',
  disabled: false,
};

export default TimeInput;
