import React from 'react';
import { CToast, CToastBody, CToastClose } from '@coreui/react';
import { useSelector } from 'react-redux';

const AppToast = () => {
  const toast = useSelector((state) => state.app.toast);
  return (
    <CToast
      autohide
      visible={toast.show}
      color="primary"
      className="text-white align-items-center"
    >
      <div className="d-flex">
        <CToastBody>
          {toast.msg}
        </CToastBody>
        <CToastClose className="me-2 m-auto" white />
      </div>
    </CToast>
  );
};

export default AppToast;
