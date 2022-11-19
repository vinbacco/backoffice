import React from 'react';
import { Toaster } from 'react-hot-toast';

import {
  AppContent, AppSidebar, AppFooter, AppHeader,
} from '../components/index';

function DefaultLayout() {
  return (
    <>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <Toaster position="top-right" reverseOrder={false} />
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </>
  );
}

export default DefaultLayout;
