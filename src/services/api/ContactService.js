import ApiProxyService from './apiProxyService';

export default class TourService extends ApiProxyService {
  getList(params, okCallback, koCallback) {
    const callParams = { ...params };
    const path = '/contacts';
    super.getList(path, callParams, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    const path = '/contacts';
    super.addItem(path, body, okCallback, koCallback);
  }
}
