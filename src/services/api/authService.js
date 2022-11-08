//GLOBAL
import axios from 'axios';

const config = require('../../environment');

export default class AuthService {
  constructor(baseUrl) {
    this.axiosInstance = axios.create({
      baseURL: `${config.API_PATH}${config.API_VERSION}${config.API_ENDPOINT}`,
      timeout: 5000
    });
  }

  getLoginURI() {
    return window.location.origin + '/login';
  }

  registerUser(user, executeRecaptcha, okCallback, koCallback, order_id) {
    this.deleteAuthData();

    const path = '/users';
    const body = user;

    const processRegistration = (recaptcha) => {
      const config = {
        headers: {
          'X-Recaptcha-Token': recaptcha,
        }
      };

      if (order_id) {
        config.params = { order_id: order_id };
      }

      return this.axiosInstance.post(path, body, config)
        .then(okCallback.bind(this))
        .catch(koCallback.bind(this));
    };

    try {
      return executeRecaptcha(path)
        .then((res) => processRegistration(res))
        .catch(koCallback.bind(this))
    } catch (error) {
      console.error("error: ", error);
    }

  };

  login = (loginData, okCallback, koCallback) => {
    this.deleteAuthData();
    const path = '/users/login';

    let body = { ...loginData };

    const okCallBack = (res) => {
      this.refreshTokenSuccessCallback(res.jsonBody);
      if (okCallback) {
        okCallback(res);
      }
    };

    let koCallBack = (error) => {
      this.refreshTokenErrorCallback(error);
      if (koCallback) {
        koCallback(error);
      }
    }

    return this.axiosInstance.post(path, body)
      .then(okCallBack.bind(this))
      .catch(koCallBack.bind(this));
  }

  resetPassword(username, executeRecaptcha, okCallback, koCallback) {
    let path = '/users/forgot_password';
    let body = {
      email: username,
      redirect_url: window.location.href.replace('forgot-password', 'forgotten-password') + '?code={code}'
    };

    const processPassword = (recaptcha) => {
      const config = {
        headers: {
          'X-Recaptcha-Token': recaptcha,
        }
      }

      return this.axiosInstance.post(path, body, config)
        .then(okCallback.bind(this))
        .catch(koCallback.bind(this));
    }

    return executeRecaptcha(path)
      .then(res => processPassword(res))
      .catch(koCallback.bind(this));
  }

  renewPassword(code, password, executeRecaptcha, okCallback, koCallback) {
    let path = '/users/reset_password/' + code;
    let body = {
      new_password: password,
    };

    const processRenewPassword = (recaptcha) => {
      const config = {
        headers: {
          'X-Recaptcha-Token': recaptcha,
        }
      }

      return this.axiosInstance.post(path, body, config)
        .then(okCallback.bind(this))
        .catch(koCallback.bind(this));
    }

    return executeRecaptcha(path)
      .then(res => processRenewPassword(res))
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
        timestamp: auth.timestamp
      };

      return tokenObject;
    }
    return {};
  }

  setAuthData(auth) {
    if (auth) {
      auth.timestamp = (new Date()).getTime();
    }
    window.localStorage.setItem('authFE', JSON.stringify(auth));
  }

  deleteAuthData() {
    window.localStorage.removeItem('authFE');
  }

  isScopeLogged(scope) {
    let auth = this.getAuthData();
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

      let path = '/users/refresh';
      let body = {
        refresh_token: auth.refreshToken,
      };

      return this.axiosInstance.post(path, body);
    }
    return null;
  }

  refreshTokenSuccessCallback(auth) {
    if (auth) {
      auth.timestamp = (new Date()).getTime();
      window.localStorage.setItem('authFE', JSON.stringify(auth));
    }
  }

  refreshTokenErrorCallback() {
    window.localStorage.removeItem('authFE');
  }

}