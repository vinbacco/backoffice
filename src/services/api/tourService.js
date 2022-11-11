import ApiProxyService from './apiProxyService';

const config = require('../../environment');

export default class TourService extends ApiProxyService {
  constructor() {
    super();
  }

  getList(paginate = 10, page = 1, filters, okCallback, koCallback) {
    let queryParams = { paginate, page, lookup: '[contact_id,product_category_id]' };
    if (filters) {
      queryParams = { ...queryParams, ...filters };
    }
    const path = '/products';
    super.getList(path, queryParams, okCallback, koCallback);
  }
}
