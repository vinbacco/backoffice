import React from 'react';
import { ToastProvider } from 'react-toast-notifications';
import {
  AppContent, AppSidebar, AppFooter, AppHeader,
} from '../components/index';

function DefaultLayout() {
  return (
    <ToastProvider>
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <AppHeader />
          <div className="body flex-grow-1 px-3">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      </div>
    </ToastProvider>
  );
}

export default DefaultLayout;
