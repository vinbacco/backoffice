import ApiProxyService from './apiProxyService';
import utils from './utils/utils';

export default class ContactsService extends ApiProxyService {
  BASE_PATH = '/contacts';

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
    const path = this.BASE_PATH;
    super.getList(path, queryParams, okCallback, koCallback);
  }

  getItem(itemId, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}`;
    const pathWithQueryParams = utils.buildPathWithQueryParams(path, { lookup: '[contact_category_id,registered_city_id]' });

    super.getItem(pathWithQueryParams, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    const path = this.BASE_PATH;
    super.addItem(path, body, okCallback, koCallback);
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
