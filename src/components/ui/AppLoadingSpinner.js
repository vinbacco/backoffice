import React from 'react';
import { CSpinner } from '@coreui/react';

function AppLoadingSpinner({ color = 'primary' }) {
  return (
    <div className="spinner-placeholder">
      <CSpinner color={color} />
    </div>
  );
}

export default AppLoadingSpinner;
