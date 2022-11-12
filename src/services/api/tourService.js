import ApiProxyService from './apiProxyService';

export default class TourService extends ApiProxyService {
  getList(paginate, page, order, sort, filters, okCallback, koCallback) {
    let queryParams = {
      paginate, page, order_by: order, sort_by: sort, lookup: '[contact_id,product_category_id]',
    };
    if (filters) {
      queryParams = { ...queryParams, ...filters };
    }
    const path = '/products';
    super.getList(path, queryParams, okCallback, koCallback);
  }
}
