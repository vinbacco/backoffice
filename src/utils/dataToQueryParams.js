const dataToQueryParams = (data) => {
  const queryParams = [];
  let queryParamsAsString = '';

  if ((typeof data.paginate === 'string' && data.paginate.length > 0) || (typeof data.paginate === 'number' && data.paginate > 0)) {
    queryParams.push(`paginate=${data.paginate}`);
  }
  if ((typeof data.page === 'string' && data.page.length > 0) || (typeof data.page === 'number' && data.page > 0)) {
    queryParams.push(`page=${data.page}`);
  }
  if ((typeof data.order === 'string' && data.order.length > 0) || (typeof data.order === 'number' && data.order > 0)) {
    queryParams.push(`order=${data.order}`);
  }
  if ((typeof data.sort === 'string' && data.sort.length > 0) || (typeof data.sort === 'number' && data.sort > 0)) {
    queryParams.push(`sort=${data.sort}`);
  }
  if ((typeof data.search === 'string' && data.search.length > 0) || (typeof data.search === 'number' && data.search > 0)) {
    queryParams.push(`search=${data.search}`);
  }

  if (queryParams.length > 0) {
    queryParamsAsString = `?${queryParams.join('&')}`;
  }

  return queryParamsAsString;
};

export default dataToQueryParams;
