import ApiProxyService from './apiProxyService';

export default class UserService extends ApiProxyService {
    constructor() {
        super();
    }

    getMe(okCallback, koCallback) {
        const path = '/users/me';
        this.getItem(path, okCallback, koCallback)
    }
}