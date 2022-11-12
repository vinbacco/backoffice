import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react';
import { cilChevronBottom, cilChevronTop } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import AppLoadingSpinner from './AppLoadingSpinner';

function Autocomplete({
  name, label, options, value, dynamic, loading, onChange, onFilter,
}) {
  const [state, setState] = useState({
    filter: '',
    open: false,
  });
  const elementRef = useRef(null);

  useEffect(() => {
    const evalMouseDown = (event) => {
      const parentElement = elementRef.current;
      if (parentElement.contains(event.target) === false) {
        const newState = { ...state };
        if (state.open === true) {
          newState.open = false;
          if (value && value.label) {
            newState.filter = value.label;
          }
          setState(newState);
        }
      }
    };

    document.addEventListener('mousedown', evalMouseDown);

    return () => {
      document.removeEventListener('mousedown', evalMouseDown);
    };
  }, []);

  const changeState = (event) => {
    const newState = { ...state };
    newState[event.target.name] = event.target.value;
    setState(newState);
  };

  const onChangeFilter = (newFilterValue) => {
    const newState = { ...state };
    newState.filter = newFilterValue;
    setState(newState);
    onFilter(newFilterValue);
  };

  const onSelectOption = (selection) => {
    const newState = { ...state };
    newState.filter = selection.label;
    newState.open = false;
    setState(newState);
    onChange({ target: { name, value: selection } });
  };

  const renderOptions = () => {
    let optionsToRender = [];
    if (dynamic) {
      optionsToRender = [...options];
    } else {
      optionsToRender = options.filter(
        (currentOption) => currentOption.label.toLowerCase().includes(state.filter.toLowerCase()),
      );
    }
    return optionsToRender.map((currentOption) => (
      <button key={`${label}_${currentOption.value}`} className="app-autocomplete-option" onClick={() => { onSelectOption(currentOption); }} type="button">
        {currentOption.label}
      </button>
    ));
  };

  const evalAutocompleteProps = () => {
    if ((dynamic === true && loading === false) || (dynamic === false)) {
      if (options.length > 0) {
        return renderOptions();
      }
      return (<span className="app-autocomplete-option null-option"><i>Nessuna opzione</i></span>);
    }
    return (<span className="app-autocomplete-option loading-options"><AppLoadingSpinner /></span>);
  };

  return (
    <>
      <CFormLabel htmlFor={`autocomplete-${label}`}>{label}</CFormLabel>
      <div className="app-autocomplete" ref={elementRef}>
        <CInputGroup>
          <CFormInput
            autoComplete="off"
            type="text"
            id={`autocomplete-${label}`}
            aria-label={label}
            name="filter"
            placeholder="Cerca qui..."
            value={state.filter}
            onChange={(event) => onChangeFilter(event.target.value)}
            onFocus={() => changeState({ target: { name: 'open', value: true } })}
          />
          <CInputGroupText className="cursor-pointer" id="addon-wrapping" name="open" onClick={() => changeState({ target: { name: 'open', value: !state.open } })}><CIcon icon={state.open ? cilChevronTop : cilChevronBottom} /></CInputGroupText>
        </CInputGroup>
        <div className={`form-control app-autocomplete-options${state.open ? ' open' : ''}`}>
          {evalAutocompleteProps()}
        </div>
      </div>
    </>
  );
}

Autocomplete.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.shape(
    { label: PropTypes.string, value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) },
  ),
  options: PropTypes.arrayOf(
    PropTypes.shape(
      { label: PropTypes.string, value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]) },
    ),
  ),
  dynamic: PropTypes.bool,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  onFilter: PropTypes.func,
};

Autocomplete.defaultProps = {
  label: 'Autocomplete',
  value: null,
  options: [],
  dynamic: false,
  loading: false,
  onChange: null,
  onFilter: null,
};

export default Autocomplete;
