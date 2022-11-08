import ApiProxyService from './apiProxyService';

const config = require('../../environment');

export default class TourService extends ApiProxyService {
    constructor() {
      super();
    }

    getList(paginate = 10, page = 1, okCallback, koCallback) {
      const path = '/products';
      super.getList(path, { paginate, page, lookup: '[contact_id,product_category_id]' }, okCallback, koCallback)
    }
}