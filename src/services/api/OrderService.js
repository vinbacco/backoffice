import ApiProxyService from './apiProxyService';

export default class OrderService extends ApiProxyService {
  getList(paginate, page, filters, okCallback, koCallback) {
    let queryParams = { paginate, page, lookup: '[product_id]' };
    if (filters) {
      queryParams = { ...queryParams, ...filters };
    }
    const path = '/orders';
    super.getList(path, queryParams, okCallback, koCallback);
  }
}
