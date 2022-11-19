import ApiProxyService from './apiProxyService';
import utils from './utils/utils';

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
    const pathWithQueryParams = utils.buildPathWithQueryParams(path, { lookup: '[feed_id]' });
    super.getItem(pathWithQueryParams, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    super.addItem(this.BASE_PATH, body, okCallback, koCallback);
  }

  updateItem(id, body, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${id}`;
    const updateItemBody = { ...body };
    updateItemBody.feed_id = updateItemBody.feed_id.value;
    super.updateItem(path, updateItemBody, okCallback, koCallback);
  }
}
