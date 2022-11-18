import ApiProxyService from './apiProxyService';

export default class ContactCategoriesService extends ApiProxyService {
  getList({
    paginate,
    page,
    order = 'name',
    sort = 'ASC',
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
    const path = '/cities';
    super.getList(path, queryParams, okCallback, koCallback);
  }

  getItem(itemId, okCallback, koCallback) {
    const path = `/cities/${itemId}`;
    super.getItem(path, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    const path = '/cities';
    super.addItem(path, body, okCallback, koCallback);
  }
}
