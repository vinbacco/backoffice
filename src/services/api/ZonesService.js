import ApiProxyService from './apiProxyService';

export default class ZonesService extends ApiProxyService {
  BASE_PATH = '/product_categories';

  TOUR_PRODUCT_TYPE_ID = '633dbfe8c843f55df6fa2a0e';

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
      queryParams =
      {
        ...queryParams,
        ...filters,
        ...{ product_type_id: this.TOUR_PRODUCT_TYPE_ID, '!!parent_id': null },
      };
    }
    super.getList(this.BASE_PATH, queryParams, okCallback, koCallback);
  }

  getZones({
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
    super.getList(this.BASE_PATH, queryParams, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    const creationData = { ...body };
    creationData.contact_id = creationData?.contact_id?.value || null;
    creationData.product_category_id = creationData?.product_category_id?.value || null;
    creationData.product_type_id = this.TOUR_PRODUCT_TYPE_ID;
    creationData.attributes = {};
    creationData.translations = {
      it: {
        name: creationData.name,
      },
    };
    super.addItem(this.BASE_PATH, creationData, okCallback, koCallback);
  }

  getItem(itemId, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}`;
    super.getItem(path, okCallback, koCallback);
  }
}
