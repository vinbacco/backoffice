import ApiProxyService from './apiProxyService';

export default class ProductCategoriesService extends ApiProxyService {
  getList(params, okCallback, koCallback) {
    const callParams = { ...params };
    const path = '/product_categories';
    super.getList(path, callParams, okCallback, koCallback);
  }
}
