import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilEnvelopeClosed, cilLockLocked } from '@coreui/icons'

import Logo from '../../../assets/images/logo/logo_lg.svg'
import AuthService from 'src/services/api/authService'
import UserService from 'src/services/api/userService'
import { setUser } from 'src/redux/slices/userSlice'


const Login = ({ setIsUser }) => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false)
  const [loginError, setLoginError] = useState(null)
  const authService = new AuthService()
  const userService = new UserService()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onChange = (event) => {
    const newLoginForm = Object.assign({}, loginForm)
    newLoginForm[event.target.name] = event.target.value
    setLoginForm(newLoginForm)
  }

  const doLogin = (event) => {
    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()
    if (validated === false) setValidated(true)
    if (form.checkValidity() === true) {
      setLoading(true)

      const okLogin = (responseLogin) => {
        const authData = responseLogin?.data || {}
        window.localStorage.setItem('authFE', JSON.stringify(authData))
        const okGetUser = (responseUserMe) => {
          dispatch(setUser(responseUserMe.data))
          setIsUser(true)
          navigate('/dashboard')
        }

        const koGetUser = (errorUserMe) => {
          const errorMessage = errorLogin?.response?.data?.message || 'No message'
          setLoading(false)
          setValidated(false)
          setLoginError(errorMessage)
        }

        userService.getMe(okGetUser, koGetUser)
      }

      const koLogin = (errorLogin) => {
        const errorMessage = errorLogin?.response?.data?.message || 'No message'
        setLoading(false)
        setValidated(false)
        setLoginError(errorMessage)
      }

      authService.login(loginForm, okLogin, koLogin)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8} lg={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CImage className="login-logo" src={Logo} />
                  <h1>Login</h1>
                  <p className="text-medium-emphasis">Sign In to your account</p>
                  {loginError !== null && (
                    <CAlert color="danger" dismissible onClose={() => {setLoginError(null)}}>{loginError}</CAlert>
                  )}
                  <CForm noValidate validated={validated} onSubmit={doLogin}>
                    <CFormLabel htmlFor="email">Email address</CFormLabel>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        value={loginForm.email}
                        onChange={onChange}
                        required
                        feedbackInvalid="Please insert a valid email address."
                        tooltipFeedback
                        onFocus={() => {setLoginError(null)}}
                      />
                    </CInputGroup>
                    <CFormLabel htmlFor="password">Password</CFormLabel>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={loginForm.password}
                        onChange={onChange}
                        required
                        feedbackInvalid="Please insert a password."
                        tooltipFeedback
                        onFocus={() => {setLoginError(null)}}
                      />
                    </CInputGroup>
                    <CRow>
                      {loading === true && (
                        <CCol xs={12} className="text-center" color='primary'>
                          <CSpinner/>
                        </CCol>
                      )}
                      {loading === false && (
                        <>
                          <CCol xs={6}>
                            <CButton  type="submit" disabled={loading === true} color="primary" className="px-4" >
                              Login
                            </CButton>
                          </CCol>
                          <CCol xs={6} className="text-right">
                            <Link to="/forgot-password">
                              <CButton disabled={loading === true} color="link" className="px-0">
                                Forgot password?
                              </CButton>
                            </Link>
                          </CCol>
                        </>
                      )}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
