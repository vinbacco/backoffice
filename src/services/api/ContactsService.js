import ApiProxyService from './apiProxyService';
import utils from './utils/utils';

export default class ContactsService extends ApiProxyService {
  getList({
    paginate,
    page,
    order = 'business_name',
    sort = 'ASC',
    filters,
    okCallback,
    koCallback,
  }) {
    let queryParams = {
      paginate, page, order_by: order, sort_by: sort, lookup: '[contact_category_id]',
    };
    if (filters) {
      queryParams = { ...queryParams, ...filters };
    }
    const path = '/contacts';
    super.getList(path, queryParams, okCallback, koCallback);
  }

  getItem(itemId, okCallback, koCallback) {
    const path = `/contacts/${itemId}`;
    const pathWithQueryParams = utils.buildPathWithQueryParams(path, { lookup: '[contact_category_id,registered_city_id]' });

    super.getItem(pathWithQueryParams, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    const path = '/contacts';
    super.addItem(path, body, okCallback, koCallback);
  }
}
