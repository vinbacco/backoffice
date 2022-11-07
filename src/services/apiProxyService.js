import AbstractService from './abstractService';
import AuthService from './authService';
import AuthProxy from './auth/authProxy';

const config = require('../environment');

export default class ApiProxyService extends AbstractService {

  constructor() {
    let baseUrl = `${config.API_PATH}${config.API_VERSION}${config.API_ENDPOINT}`;
    super(baseUrl);

    this.authService = new AuthService(baseUrl);
  }

  getItem(path, okCallback, koCallback) {
    return AuthProxy(this.authService, super.get.bind(this, path, null), okCallback, koCallback);
  }

  addItem(path, body, okCallback, koCallback) {
    return AuthProxy(this.authService, super.post.bind(this, path, body), okCallback, koCallback);
  }

  updateItem(path, body, okCallback, koCallback) {
    return AuthProxy(this.authService, super.put.bind(this, path, body), okCallback, koCallback);
  }

  deleteItem(path, okCallback, koCallback) {
    return AuthProxy(this.authService, super.delete.bind(this, path, null), okCallback, koCallback);
  }
}