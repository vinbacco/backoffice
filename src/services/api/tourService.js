import ApiProxyService from './apiProxyService';

export default class TourService extends ApiProxyService {
  getList(paginate, page, filters, okCallback, koCallback) {
    let queryParams = { paginate, page, lookup: '[contact_id,product_category_id]' };
    if (filters) {
      queryParams = { ...queryParams, ...filters };
    }
    const path = '/products';
    super.getList(path, queryParams, okCallback, koCallback);
  }
}
