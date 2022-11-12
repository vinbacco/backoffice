/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
// GLOBAL
import axios from 'axios';

const config = require('../../environment');

export default class AuthService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${config.API_PATH}${config.API_VERSION}${config.API_ENDPOINT}`,
      timeout: 5000,
    });
  }

  getLoginURI() {
    return `${window.location.origin}/login`;
  }

  registerUser(user, executeRecaptcha, okCallback, koCallback, orderId) {
    this.deleteAuthData();

    const path = '/users';
    const body = user;

    const processRegistration = (recaptcha) => {
      const callConfig = {
        headers: {
          'X-Recaptcha-Token': recaptcha,
        },
      };

      if (orderId) {
        config.params = { order_id: orderId };
      }

      return this.axiosInstance.post(path, body, callConfig)
        .then(okCallback.bind(this))
        .catch(koCallback.bind(this));
    };

    try {
      return executeRecaptcha(path)
        .then((res) => processRegistration(res))
        .catch(koCallback.bind(this));
    } catch (error) {
      throw error('error: ', error);
    }
  }

  login = (loginData, okCallback, koCallback) => {
    this.deleteAuthData();
    const path = '/users/login';

    const body = { ...loginData };

    const okCallBack = (res) => {
      this.refreshTokenSuccessCallback(res.jsonBody);
      if (okCallback) {
        okCallback(res);
      }
    };

    const koCallBack = (error) => {
      this.refreshTokenErrorCallback(error);
      if (koCallback) {
        koCallback(error);
      }
    };

    return this.axiosInstance.post(path, body)
      .then(okCallBack.bind(this))
      .catch(koCallBack.bind(this));
  };

  resetPassword(username, executeRecaptcha, okCallback, koCallback) {
    const path = '/users/forgot_password';
    const body = {
      email: username,
      redirect_url: `${window.location.href.replace('forgot-password', 'forgotten-password')}?code={code}`,
    };

    const processPassword = (recaptcha) => {
      const callConfig = {
        headers: {
          'X-Recaptcha-Token': recaptcha,
        },
      };

      return this.axiosInstance.post(path, body, callConfig)
        .then(okCallback.bind(this))
        .catch(koCallback.bind(this));
    };

    return executeRecaptcha(path)
      .then((res) => processPassword(res))
      .catch(koCallback.bind(this));
  }

  renewPassword(code, password, executeRecaptcha, okCallback, koCallback) {
    const path = `/users/reset_password/${code}`;
    const body = {
      new_password: password,
    };

    const processRenewPassword = (recaptcha) => {
      const callConfig = {
        headers: {
          'X-Recaptcha-Token': recaptcha,
        },
      };

      return this.axiosInstance.post(path, body, callConfig)
        .then(okCallback.bind(this))
        .catch(koCallback.bind(this));
    };

    return executeRecaptcha(path)
      .then((res) => processRenewPassword(res))
      .catch(koCallback.bind(this));
  }

  getAuthData() {
    const auth = (window.localStorage.getItem('authFE')) ? JSON.parse(window.localStorage.getItem('authFE')) : null;
    if (auth) {
      const tokenObject = {
        accessToken: auth.access_token,
        refreshToken: auth.refresh_token,
        expiresIn: auth.expires_in,
        scopes: auth.scope,
        tokenType: auth.token_type,
        timestamp: auth.timestamp,
      };

      return tokenObject;
    }
    return {};
  }

  setAuthData(auth) {
    const newAuth = { ...auth };
    if (newAuth) {
      newAuth.timestamp = (new Date()).getTime();
    }
    window.localStorage.setItem('authFE', JSON.stringify(newAuth));
  }

  deleteAuthData() {
    window.localStorage.removeItem('authFE');
  }

  isScopeLogged(scope) {
    const auth = this.getAuthData();
    if (!auth || !auth.scopes) {
      return false;
    }
    return (auth.scopes.indexOf(scope) >= 0);
  }

  logout() {
    this.deleteAuthData();
    window.location.href = this.getLoginURI();
  }

  refreshTokenMethod() {
    const auth = this.getAuthData();
    if (auth) {
      window.localStorage.removeItem('authFE');

      const path = '/users/refresh';
      const body = {
        refresh_token: auth.refreshToken,
      };

      return this.axiosInstance.post(path, body);
    }
    return null;
  }

  refreshTokenSuccessCallback(auth) {
    const newAuth = { ...auth };
    if (newAuth) {
      newAuth.timestamp = (new Date()).getTime();
      window.localStorage.setItem('authFE', JSON.stringify(newAuth));
    }
  }

  refreshTokenErrorCallback() {
    window.localStorage.removeItem('authFE');
  }
}
