/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useLocation } from 'react-router-dom';

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';
import routes from '../routes';

function AppBreadcrumb() {
  const currentLocation = useLocation().pathname;

  const getRouteName = (pathname, appRoutes) => {
    const currentRoute = appRoutes.find((route) => route.path === pathname);
    return currentRoute ? currentRoute.name : false;
  };

  const getBreadcrumbs = (location) => {
    const breadcrumbs = [];
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`;
      const routeName = getRouteName(currentPathname, routes);
      if (routeName) {
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length,
        });
      }
      return currentPathname;
    });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
          key={index}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  );
}

export default React.memo(AppBreadcrumb);
