import ApiProxyService from './apiProxyService';

export default class TourService extends ApiProxyService {
  TOUR_PRODUCT_TYPE_ID = '633dbfe8c843f55df6fa2a0e';

  getList(paginate, page, order, sort, filters, okCallback, koCallback) {
    let queryParams = {
      paginate, page, order_by: order, sort_by: sort, lookup: '[contact_id,product_category_id]',
    };
    if (filters) {
      queryParams = { ...queryParams, ...filters, product_type_id: this.TOUR_PRODUCT_TYPE_ID };
    }
    const path = '/products';
    super.getList(path, queryParams, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    const path = '/products';
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
    super.addItem(path, creationData, okCallback, koCallback);
  }
}
