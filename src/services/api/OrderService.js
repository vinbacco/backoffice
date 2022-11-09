import ApiProxyService from './apiProxyService';

const config = require('../../environment');

export default class OrderService extends ApiProxyService {
    constructor() {
      super();
    }

    getList(paginate = 10, page = 1, filters, okCallback, koCallback) {
      let queryParams = { paginate, page, lookup: '[product_id]' }
      if (filters) {
        queryParams = {...queryParams, ...filters};
      }
      const path = '/orders';
      super.getList(path, queryParams, okCallback, koCallback)
    }
}