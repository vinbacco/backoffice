import ApiProxyService from './apiProxyService';

export default class FeedsService extends ApiProxyService {
  getList({
    paginate,
    page,
    order,
    sort,
    filters,
    okCallback,
    koCallback,
  }) {
    let queryParams = {
      paginate, page, order_by: order, sort_by: sort,
    };
    if (filters) {
      queryParams = { ...queryParams, ...filters, product_type_id: this.TOUR_PRODUCT_TYPE_ID };
    }
    const path = '/feeds';
    super.getList(path, queryParams, okCallback, koCallback);
  }

  getItem(itemId, okCallback, koCallback) {
    const path = `/feeds/${itemId}`;
    super.getItem(path, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    const path = '/feeds';
    super.addItem(path, body, okCallback, koCallback);
  }
}
