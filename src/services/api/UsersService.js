import ApiProxyService from './apiProxyService';

export const USER_GROUPS = [
  {
    value: 'admin',
    label: 'Amministratore',
  },
  {
    value: 'cantina',
    label: 'Cantina',
  },
  {
    value: 'publisher',
    label: 'Publisher',
  },
  {
    value: 'customer',
    label: 'Cliente',
  },
];

export const getUserGroup = (value) => (USER_GROUPS.find((current) => current.value === value));

export default class UsersService extends ApiProxyService {
  BASE_PATH = '/users';

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
      queryParams = { ...queryParams, ...filters };
    }
    const path = `${this.BASE_PATH}`;
    super.getList(path, queryParams, okCallback, koCallback);
  }

  getItem(itemId, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${itemId}`;
    super.getItem(path, okCallback, koCallback);
  }

  addItem(body, okCallback, koCallback) {
    const path = `${this.BASE_PATH}`;

    const creationData = { ...body };
    creationData.name = `${creationData.first_name} ${creationData.last_name}`;
    creationData.user_group = creationData?.user_group?.value || null;

    super.addItem(path, creationData, okCallback, koCallback);
  }

  updateItem(id, body, okCallback, koCallback) {
    const path = `${this.BASE_PATH}/${id}`;

    const creationData = { ...body };
    creationData.name = `${creationData.first_name} ${creationData.last_name}`;
    creationData.user_group = creationData?.user_group?.value || null;

    super.updateItem(path, creationData, okCallback, koCallback);
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
}
