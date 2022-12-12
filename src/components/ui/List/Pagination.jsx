import React from 'react';
import PropTypes from 'prop-types';
import {
  CCol,
  CPagination,
  CPaginationItem,
  CRow,
} from '@coreui/react';

const Pagination = ({
  tableData,
  setSelectedItems,
  setTableData,
}) => {
  const changePage = (value) => {
    if (tableData.data !== null) {
      const newTableData = { ...tableData };
      newTableData.page = value;
      newTableData.data = null;
      setSelectedItems({ selectedItems: [] });
      setTableData(newTableData);
    }
  };
  const totalsText = tableData.total ? `Pagina ${tableData.page} 
                      di ${Math.ceil(tableData.total / tableData.paginate)}
                      (${tableData.total} risultat${tableData.total === 1 ? 'o' : 'i'})
  ` : '';
  return (
    <CRow className="align-items-center mb-5">
      <CCol>
        <CPagination>
          <CPaginationItem
            onClick={() => changePage(tableData.page - 1)}
            className={tableData.page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}
            disabled={tableData.data === null || tableData.page === 1}
          >
            Pagina precedente
          </CPaginationItem>
          <CPaginationItem
            onClick={() => changePage(tableData.page + 1)}
            className={
              tableData.page === Math.ceil(tableData.total / tableData.paginate)
                ? 'cursor-not-allowed'
                : 'cursor-pointer'
            }
            disabled={
              tableData.data === null
              || tableData.page === Math.ceil(tableData.total / tableData.paginate)
            }
          >
            Pagina successiva
          </CPaginationItem>
        </CPagination>
      </CCol>
      <CCol className="text-end">
        {totalsText}
      </CCol>
    </CRow>
  );
};

Pagination.propTypes = {
  tableData: PropTypes.shape({
    paginate: PropTypes.number,
    page: PropTypes.number,
    total: PropTypes.number,
    order: PropTypes.oneOf(['asc', 'desc']),
    sort: PropTypes.string,
    search: PropTypes.string,
    data: PropTypes.array || null,
  }),
  setSelectedItems: PropTypes.func.isRequired,
  setTableData: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  tableData: {
    paginate: 10,
    page: 1,
    total: 0,
    order: 'asc',
    sort: 'name',
    search: '',
    data: null,
  },
};

export default Pagination;
