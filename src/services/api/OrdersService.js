import ApiProxyService from './apiProxyService';
import utils from './utils/utils';

export default class OrdersService extends ApiProxyService {
  BASE_PATH = '/orders';

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
      paginate, page, order_by: order, sort_by: sort, lookup: '[user_id]',
    };
    if (filters) {
      queryParams = { ...queryParams, ...filters };
    }
    const path = `${this.BASE_PATH}`;
    super.getList(path, queryParams, okCallback, koCallback);
  }

  getItem(itemId, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}`;
    const pathWithQueryParams = utils.buildPathWithQueryParams(path, { lookup: '[user_id,purchase_option_id]' });
    super.getItem(pathWithQueryParams, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    const path = `${this.BASE_PATH}`;
    super.addItem(path, body, okCallback, koCallback);
  }

  updateItem(id, body, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${id}`;
    super.updateItem(path, body, okCallback, koCallback);
  }

  deleteItem(deleteInfo, okCallback, koCallback) {
    const deletePromisesArray = [];
    if (typeof deleteInfo === 'string' || typeof deleteInfo === 'number') {
      deletePromisesArray.push(
        new Promise((resolve, reject) => {
          super.deleteItem(`${this.BASE_PATH}/${deleteInfo}`, (res) => resolve(res), (err) => reject(err));
        }),
      );
    } else if (Array.isArray(deleteInfo)) {
      deleteInfo.forEach((currentItem) => {
        deletePromisesArray.push(
          new Promise((resolve, reject) => {
            super.deleteItem(`${this.BASE_PATH}/${currentItem}`, (res) => resolve(res), (err) => reject(err));
          }),
        );
      });
    }
    Promise.allSettled(deletePromisesArray)
      .then((results) => {
        const rejectedPromises = results.filter((currentResult) => currentResult.status === 'rejected');
        if (rejectedPromises.length <= 0) okCallback();
        else koCallback([...rejectedPromises]);
      });
  }

  acceptOrderProductVariant(callParams, okCallback, koCallback) {
    const { orderId, childId, selectedVariant } = callParams;
    const path = `${this.BASE_PATH}/contact_confirmation`;
    const callBody = {
      order_id: orderId,
      child_id: childId,
      selected_variant: selectedVariant,
    };
    super.postItem(path, callBody, okCallback, koCallback);
  }

  rejectOrderProductVariant(callParams, okCallback, koCallback) {
    const { orderId, childId } = callParams;
    const path = `${this.BASE_PATH}/contact_rejection`;
    const callBody = {
      order_id: orderId,
      child_id: childId,
    };
    super.postItem(path, callBody, okCallback, koCallback);
  }
}
