class RefreshTokenHandler {
  constructor(refreshTokenConfig) {
    this.refreshTokenConfig = refreshTokenConfig;
    if (!RefreshTokenHandler.instance) {
      RefreshTokenHandler.instance = this;
      RefreshTokenHandler.instance.sem = require('semaphore')(1);
    }

    return RefreshTokenHandler.instance;
  }

  refreshToken() {
    this.refreshTokenConfig.refreshTokenMethod().then((resp) => {
      this.refreshTokenConfig.refreshTokenSuccessCallback(resp.data);
      const event = new Event('token');
      window.dispatchEvent(event);
      RefreshTokenHandler.instance.sem = require('semaphore')(1);
    }).catch((err) => {
      if (err.response && err.response.status === 401) {
        RefreshTokenHandler.instance.sem = require('semaphore')(1);
        this.refreshTokenConfig.refreshTokenErrorCallback(err.response);
      } else {
        throw err;
      }
    });
  }
}

export default RefreshTokenHandler;
