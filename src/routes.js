import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const OrdersList = React.lazy(() => import('./modules/orders/views/OrdersList'))
const OrdersDetail = React.lazy(() => import('./modules/orders/views/OrdersDetail'))
const NotFound = React.lazy(() => import('./views/pages/page404/Page404'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/orders', name: 'Orders', element: OrdersList },
  { path: '/order/:id', name: 'Order', element: OrdersDetail },
  { path: '*', name: 'NotFound', element: NotFound },
]

export default routes
