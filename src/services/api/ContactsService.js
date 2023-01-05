import ApiProxyService from './apiProxyService';
import utils from './utils/utils';

export default class ContactsService extends ApiProxyService {
  BASE_PATH = '/contacts';

  CONTACT_CATEGORY_ID_WINERY = '63495f81b1bc41beb9fb70fd';

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

    const okHandler = (response) => {
      const newResponse = { ...response };
      newResponse.data = response.data.map((currentData) => {
        const newCurrentData = { ...currentData };
        if (newCurrentData.holder && newCurrentData.holder.toUpperCase() === 'FAKE') {
          newCurrentData.holder = null;
        }
        return newCurrentData;
      });
      return okCallback(newResponse);
    };

    super.getList(path, queryParams, okHandler, koCallback);
  }

  getItem(itemId, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}`;
    const pathWithQueryParams = utils.buildPathWithQueryParams(path, { lookup: '[contact_category_id,registered_city_id]' });

    const okHandler = (response) => {
      const newResponse = { ...response };
      if (response.data && response.data.holder && response.data.holder.toUpperCase() === 'FAKE') {
        newResponse.data.holder = '';
      }
      return okCallback(newResponse);
    };

    super.getItem(pathWithQueryParams, okHandler, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    const path = this.BASE_PATH;
    const newBody = { ...body };
    newBody.contact_category_id = this.CONTACT_CATEGORY_ID_WINERY;
    newBody.registered_city_id = body.registered_city_id.value;
    super.addItem(path, newBody, okCallback, koCallback);
  }

  updateItem(itemId, itemData, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}`;
    const newBody = { ...itemData };
    newBody.registered_city_id = itemData.registered_city.value;
    super.updateItem(path, newBody, okCallback, koCallback);
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
