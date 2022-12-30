/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CContainer, CSpinner } from '@coreui/react';

// routes config
import routes from '../routes';

function AppContent() {
  const userData = useSelector((state) => state.user.value);

  const evalRolesAndPermissions = (requiredRoles, requiredPermissions) => {
    let acceptedRole = true;
    let acceptedPermissions = true;
    if (typeof requiredRoles !== 'undefined') {
      acceptedRole = requiredRoles.includes(userData.user_group);
    }
    if (typeof requiredPermissions !== 'undefined') {
      acceptedPermissions = requiredPermissions.every(
        (element) => userData.permissions.includes(element),
      );
    }
    return (acceptedRole && acceptedPermissions);
  };

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => (
            route.element && evalRolesAndPermissions(route.roles, route.permissions) && (
            <Route
              key={idx}
              path={route.path}
              exact={route.exact}
              name={route.name}
              element={<route.element />}
            />
            )
          ))}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  );
}

export default React.memo(AppContent);
