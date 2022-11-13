import { useEffect } from 'react';

import dataToQueryParams from 'src/utils/dataToQueryParams';

export const processData = ({
  currentTableData,
  setIsLoadingData,
  getDataFn, // module service instance getList function 
  setFetchData,
  setTableData,
  setData
}) => {
  const filters = {};
  // TODO: GENERALIZZARE
  if (currentTableData.search.length > 0) filters['^name'] = currentTableData.search;
  setIsLoadingData(true);
  const newTableData = { ...currentTableData };
  getDataFn(
    currentTableData.paginate,
    currentTableData.page,
    currentTableData.order,
    currentTableData.sort,
    filters,
    (response) => {
      newTableData.total = response?.headers?.total || 0;
      setFetchData(false);
      setTableData(newTableData);
      setIsLoadingData(false);
      setData(response.data.map((item) => ({
        _id: item._id,
        name: item.name,
        business_name: item.contact.business_name,
      })));
    },
    () => {
      setData([]);
      setIsLoadingData(false);
    },
  );
};

const useListData = ({
  path,
  tableData,
  setTableData,
  currentTableData,
  fetchData,
  setFetchData,
  navigate,
  currentTableData,
  setIsLoadingData,
  getDataFn, // module service instance getList function 
  setData,
  processDataFnParam // use another processData function if you want 
}) => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const newTableData = { ...tableData };
    newTableData.paginate = queryParams.get('paginate') || 10;
    newTableData.page = queryParams.get('page') || 1;
    newTableData.order = queryParams.get('order') || 'asc';
    newTableData.sort = queryParams.get('sort') || 'name';
    newTableData.search = queryParams.get('search') || '';
    setTableData(newTableData);
    if (!data) {
      setFetchData(true);
    }
  }, []);
  
  useEffect(() => {
    if (fetchData === true) {
      const queryParams = dataToQueryParams(tableData);
      navigate(`${path}${queryParams}`, { replace: true });
      const processDataFn = processDataFnParam || processData;
      processDataFn({
        currentTableData,
        setIsLoadingData,
        getDataFn, 
        setFetchData,
        setTableData,
        setData
      });
    }
  }, [fetchData]);
};

export default useListData;
