import dataToQueryParams from 'src/utils/dataToQueryParams';

export const processData = ({
  currentTableData,
  getDataFn, // module service instance getList function
  setTableData,
  mapDataFn,
}) => {
  const filters = {};
  // TODO: GENERALIZZARE
  if (currentTableData.search.length > 0) filters['^name'] = currentTableData.search;
  const newTableData = { ...currentTableData };
  getDataFn(
    currentTableData.paginate,
    currentTableData.page,
    currentTableData.order,
    currentTableData.sort,
    filters,
    (response) => {
      newTableData.total = parseInt(response?.headers?.total || 0, 10);
      const mappedData = response.data.map(mapDataFn);
      setTableData({ ...newTableData, ...{ data: mappedData } });
    },
    () => {
      setTableData({ ...currentTableData }, { ...{ data: [] } });
    },
  );
};

/**
 * Function to handle data lists into a useEffect
 * with pagination parameters dependencies
 * Es:
 * useEffect(() => effectDataLoad(...),[pageParam1,...])
 * Use it into Section List pages
 * @param {string} pathPageList - The path of the page including slash es '/page1'.
 * @param {Array} tableData - The collection of current dataset.
 * @param {Function} setTableData - The useState function to set data list.
 * @param {Function} navigate - The navigation function
 * @param {Function} getDataFn - The function to get data list.
 * @param {Function} mapDataFn - The function to map data list into columns.
 */

export const effectDataLoad = ({
  locationSearch,
  pathPageList,
  tableData,
  navigate,
  getDataFn, // module service instance getList function
  mapDataFn,
  setTableData,
}) => {
  const queryParams = new URLSearchParams(locationSearch);
  const newTableData = { ...tableData };
  let mustRelocate = false;
  const currentParams = {
    paginate: queryParams.get('paginate'),
    page: queryParams.get('page'),
    order: queryParams.get('order'),
    sort: queryParams.get('sort'),
    search: queryParams.get('search'),
  };

  if (currentParams.paginate !== null) {
    currentParams.paginate = parseInt(currentParams.paginate, 10);
  }
  if (currentParams.page !== null) {
    currentParams.page = parseInt(currentParams.page, 10);
  }

  if (currentParams.search === null) {
    currentParams.search = '';
  }

  if (tableData.paginate === null) {
    if (currentParams.paginate !== null) newTableData.paginate = currentParams.paginate;
    else newTableData.paginate = 10;
  }
  if (currentParams.paginate !== newTableData.paginate) {
    currentParams.paginate = newTableData.paginate;
    if (mustRelocate === false) mustRelocate = true;
  }

  if (tableData.page === null) {
    if (currentParams.page !== null) newTableData.page = currentParams.page;
    else newTableData.page = 1;
  }
  if (currentParams.page !== newTableData.page) {
    currentParams.page = newTableData.page;
    if (mustRelocate === false) mustRelocate = true;
  }

  if (tableData.order === null) {
    if (currentParams.order !== null) newTableData.order = currentParams.order;
    else newTableData.order = 'asc';
  }
  if (currentParams.order !== newTableData.order) {
    currentParams.order = newTableData.order;
    if (mustRelocate === false) mustRelocate = true;
  }

  if (tableData.sort === null) {
    if (currentParams.sort !== null) newTableData.sort = currentParams.sort;
    else newTableData.sort = 'name';
  }
  if (currentParams.sort !== newTableData.sort) {
    currentParams.sort = newTableData.sort;
    if (mustRelocate === false) mustRelocate = true;
  }

  if (tableData.search === null) {
    if (currentParams.search !== null) newTableData.search = currentParams.search;
    else newTableData.search = '';
  }
  if (currentParams.search !== newTableData.search) {
    currentParams.search = newTableData.search;
    if (mustRelocate === false) mustRelocate = true;
  }

  if (mustRelocate) {
    const mappedQueryParams = dataToQueryParams(newTableData);
    navigate(`${pathPageList}${mappedQueryParams}`, { replace: true });
  }

  if (newTableData.data === null) {
    processData({
      currentTableData: { ...newTableData },
      getDataFn, // module service instance getList function
      setNextTableData: setTableData,
      mapDataFn,
    });
  }
};
