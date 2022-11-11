import ApiProxyService from './apiProxyService';

export default class UserService extends ApiProxyService {
  getMe(okCallback, koCallback) {
    const path = '/users/me';
    super.getItem(path, okCallback, koCallback);
  }
}
