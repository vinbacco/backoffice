import { CSpinner } from '@coreui/react'
import React, { Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './scss/style.scss'
import UserService from './services/userService'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))

const App = () => {
  const [ appInit, setAppInit ] = useState(false)
  const [ isUser, setIsUser ] = useState(false)
  const userService = new UserService()

  useEffect(() => {
    const okGetUser = (responseUserMe) => {
      console.log(responseUserMe) //TODO: Dove salvare i dati che arrivano? Local storage? Redux? HELP!
      setAppInit(true)
      setIsUser(true)
    }

    const koGetUser = () => {
      setAppInit(true)
    }

    userService.getMe(okGetUser, koGetUser)
  }, [])

  const loading = (
    <div className="spinner-placeholder">
      <CSpinner color="primary"/>
    </div>
  )

  if( appInit === false) {
    return loading;
  } else {
    return (
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={isUser === false ? <Login setIsUser={setIsUser} /> : <Navigate to="/dashboard" />} />
            <Route exact path="/register" name="Register Page" element={isUser === false ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="*" name="Home" element={isUser === true ? <DefaultLayout /> : <Navigate to="/login" /> } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
  }

}

export default App
