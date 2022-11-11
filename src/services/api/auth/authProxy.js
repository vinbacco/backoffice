import RefreshTokenHandler from './refreshTokenHandler';

function AuthProxy(refreshTokenConfig, apiMethod, successCallback, errorCallback) {
  const { getAuthData, refreshTokenMethod, refreshTokenErrorCallback } = refreshTokenConfig;
  const refreshTokenHandler = new RefreshTokenHandler(refreshTokenConfig);

  if (!getAuthData().refreshToken || (!refreshTokenMethod || typeof refreshTokenMethod !== 'function')) {
    const errorNoTokenForRequiredAuth = {
      ok: false,
      status: 401,
      code: 'Unauthorized',
    };
    if (!!refreshTokenErrorCallback && typeof refreshTokenErrorCallback === 'function') refreshTokenErrorCallback(errorNoTokenForRequiredAuth);
    if (!!errorCallback && typeof errorCallback === 'function') errorCallback(errorNoTokenForRequiredAuth);
    return;
  }

  const eventCallback = () => {
    const listener = () => {
      apiMethod().then((res) => {
        window.removeEventListener('token', listener);
        if (!!successCallback && typeof successCallback === 'function') successCallback(res);
      })
        .catch((apiMethodError) => {
          if (!!errorCallback && typeof errorCallback === 'function') errorCallback(apiMethodError);
        });
    };

    apiMethod().then((res) => {
      window.removeEventListener('token', eventCallback);
      if (!!successCallback && typeof successCallback === 'function') successCallback(res);
    }).catch((err) => {
      console.error(err);
      if (err.response && err.response.status === 401) {
        window.addEventListener('token', listener);
        try {
          refreshTokenHandler.sem.take(() => { refreshTokenHandler.refreshToken(); });
        } catch (e) {
          if (!!errorCallback && typeof errorCallback === 'function') errorCallback(e);
        }
      } else if (!!errorCallback && typeof errorCallback === 'function') errorCallback(err.response);
    });
  };

  try {
    eventCallback();
  } catch (e) {
    if (!!errorCallback && typeof errorCallback === 'function') errorCallback(e);
  }
}

export default AuthProxy;
