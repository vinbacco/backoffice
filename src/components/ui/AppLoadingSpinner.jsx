import React from 'react';
import PropTypes from 'prop-types';
import { CSpinner } from '@coreui/react';

function AppLoadingSpinner({ color }) {
  return (
    <div className="spinner-placeholder">
      <CSpinner color={color} />
    </div>
  );
}

AppLoadingSpinner.propTypes = {
  color: PropTypes.string,
};

AppLoadingSpinner.defaultProps = {
  color: 'primary',
};

export default AppLoadingSpinner;
