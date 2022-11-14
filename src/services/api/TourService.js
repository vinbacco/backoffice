import ApiProxyService from './apiProxyService';

export default class TourService extends ApiProxyService {
  TOUR_PRODUCT_TYPE_ID = '633dbfe8c843f55df6fa2a0e';

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

  addItem(body, okCallback, koCallback) {
    const path = '/products';
    super.addItem(path, body, okCallback, koCallback);
  }
}
