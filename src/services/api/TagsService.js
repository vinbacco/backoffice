import ApiProxyService from './apiProxyService';

export default class TagsService extends ApiProxyService {
  getList(params, okCallback, koCallback) {
    const callParams = { ...params };
    const path = '/tags';
    super.getList(path, callParams, okCallback, koCallback);
  }

  getItem(itemId, okCallback, koCallback) {
    const path = `/tags/${itemId}`;
    super.getItem(path, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    const path = '/tags';
    super.addItem(path, body, okCallback, koCallback);
  }
}
