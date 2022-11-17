import ApiProxyService from './apiProxyService';

export default class TagsService extends ApiProxyService {
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
      queryParams = { ...queryParams, ...filters };
    }
    const path = '/tags';
    super.getList(path, queryParams, okCallback, koCallback);
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
