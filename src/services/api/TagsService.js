import ApiProxyService from './apiProxyService';

export default class TagsService extends ApiProxyService {
  BASE_PATH = '/tags';

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
    super.getList(this.BASE_PATH, queryParams, okCallback, koCallback);
  }

  getItem(itemId, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}`;
    super.getItem(path, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    super.addItem(this.BASE_PATH, body, okCallback, koCallback);
  }

  updateItem(id, body, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${id}`;
    super.updateItem(path, body, okCallback, koCallback);
    const updateItemBody = { ...body };
    updateItemBody.product_type_id = updateItemBody.product_type_id.value;
    super.updateItem(path, updateItemBody, okCallback, koCallback);
  }
}
