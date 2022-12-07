/* eslint-disable no-unused-vars */
import ApiProxyService from './apiProxyService';

import utils from './utils/utils';

export default class TourService extends ApiProxyService {
  TOUR_PRODUCT_TYPE_ID = '633dbfe8c843f55df6fa2a0e';

  BASE_PATH = '/products';

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
      paginate, page, order_by: order, sort_by: sort, lookup: '[contact_id,product_category_id]',
    };
    if (filters) {
      queryParams = { ...queryParams, ...filters, product_type_id: this.TOUR_PRODUCT_TYPE_ID };
    }
    const path = this.BASE_PATH;
    super.getList(path, queryParams, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    const path = this.BASE_PATH;
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

  getItem(itemId, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}`;
    const pathWithQueryParams = utils.buildPathWithQueryParams(path, { lookup: '[contact_id,product_category_id]' });
    super.getItem(pathWithQueryParams, okCallback, koCallback);
  }

  updateItem(itemId, itemData, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}`;
    super.updateItem(path, itemData, okCallback, koCallback);
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

  addMediaContent(itemId, fileData, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}/media_contents`;
    super.uploadItem(path, fileData, okCallback, koCallback);
  }

  updateMediaContent(itemId, fileId, fileData, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}/media_contents/${fileId}`;
    super.uploadItem(path, fileData, okCallback, koCallback);
  }

  orderMediaContent(itemId, mediaContents, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}/order_media_contents`;
    super.postItem(path, mediaContents, okCallback, koCallback);
  }

  deleteMediaContent(itemId, mediaId, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}/media_contents/${mediaId}`;
    super.deleteItem(path, okCallback, koCallback);
  }
}
