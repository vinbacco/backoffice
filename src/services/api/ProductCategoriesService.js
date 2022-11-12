import ApiProxyService from './apiProxyService';

export default class ProductCategoriesService extends ApiProxyService {
  getList(paginate, page, filters, okCallback, koCallback) {
    let queryParams = { paginate, page, lookup: '[product_type_id]' };
    if (filters) {
      queryParams = { ...queryParams, ...filters };
    }
    const path = '/product_categories';
    super.getList(path, queryParams, okCallback, koCallback);
  }
}
