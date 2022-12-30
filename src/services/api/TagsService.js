import ApiProxyService from './apiProxyService';
import utils from './utils/utils';

export default class TagsService extends ApiProxyService {
  BASE_PATH = '/tags';

  TOUR_SERVICES_TYPE_ID = '63a35d7fa0de56247399109f';

  TYPOLOGY_EXPERIENCE_TYPE_ID = '63a35e2da0de5624739910b1';

  ACTIVITIES_TYPE_ID = '63a35c45a0de562473991099';

  TASTING_TYPE_ID = '63a35b35a0de562473991094';

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
      paginate, page, order_by: order, sort_by: sort, lookup: '[feed_id]',
    };
    if (filters) {
      queryParams = { ...queryParams, ...filters };
    }
    super.getList(this.BASE_PATH, queryParams, okCallback, koCallback);
  }

  getItem(itemId, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}`;
    const pathWithQueryParams = utils.buildPathWithQueryParams(path, { lookup: '[feed_id]' });
    super.getItem(pathWithQueryParams, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    super.addItem(this.BASE_PATH, body, okCallback, koCallback);
  }

  updateItem(id, body, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${id}`;
    const updateItemBody = { ...body };
    updateItemBody.feed_id = updateItemBody.feed_id.value;
    const handleOkCallback = (response) => {
      this.getItem(id, okCallback, okCallback(response));
    };
    super.updateItem(path, updateItemBody, handleOkCallback, koCallback);
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

  deleteMediaContent(itemId, mediaId, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}/media_contents/${mediaId}`;
    super.deleteItem(path, okCallback, koCallback);
  }

  getGenericTags(tagType, okCallback, koCallback) {
    // FIXME: Rimuovere filtro manuale, usare quello della chiamata una volta torna funzionale.
    const handleOkCallback = (res) => {
      const { data } = res;

      let feedId = '';

      switch (tagType) {
        case 'experiences':
          feedId = this.TYPOLOGY_EXPERIENCE_TYPE_ID;
          break;
        case 'activities':
          feedId = this.ACTIVITIES_TYPE_ID;
          break;
        case 'tasting':
          feedId = this.TASTING_TYPE_ID;
          break;
        case 'tourServices':
        default:
          feedId = this.TOUR_SERVICES_TYPE_ID;
          break;
      }

      const filterServices = data.filter(
        (current) => current.feed_id === feedId,
      );

      return okCallback(filterServices);
    };

    const queryParams = {
      // feed_id: this.TOUR_PRODUCT_TYPE_ID,
    };
    const path = '/tags';
    super.getList(path, queryParams, handleOkCallback, koCallback);
  }
}
