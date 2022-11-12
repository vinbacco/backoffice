/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/forbid-prop-types */
import { cilChevronBottom, cilChevronTop } from '@coreui/icons';
import PropTypes from 'prop-types';
import CIcon from '@coreui/icons-react';
import {
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
} from '@coreui/react';
import React from 'react';
import AppLoadingSpinner from './AppLoadingSpinner';

function AppTable({
  loading = false, columns, items, rowAction = null, sortBy = '', orderBy = 'asc', onChangeOrderSort = null,
}) {
  const evalAndChangeOrderSort = (value) => {
    const newOrderSort = { order: orderBy, sort: sortBy };
    if (value === sortBy) {
      if (orderBy.toLowerCase() === 'asc') newOrderSort.order = 'desc';
      else newOrderSort.order = 'asc';
    } else {
      newOrderSort.sort = value;
      newOrderSort.order = 'asc';
    }
    return onChangeOrderSort(newOrderSort);
  };

  return (
    <CTable striped bordered>
      <CTableHead>
        <CTableRow>
          {columns.map((currentColumn) => (
            <CTableHeaderCell className={currentColumn.sortable ? 'cursor-pointer' : ''} key={currentColumn.key} onClick={() => (currentColumn.sortable ? evalAndChangeOrderSort(currentColumn.key) : null)} scope="col" {...currentColumn._style} {...currentColumn._props}>
              {currentColumn.label}
              {currentColumn.sortable && currentColumn.key === sortBy && <CIcon className="ms-2" icon={orderBy.toLowerCase() === 'asc' ? cilChevronTop : cilChevronBottom} />}
            </CTableHeaderCell>
          ))}
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {loading === true && (
          <CTableRow>
            <CTableDataCell colSpan={columns.length}><AppLoadingSpinner /></CTableDataCell>
          </CTableRow>
        )}
        {loading === false && items.length <= 0 && (
          <CTableRow>
            <CTableDataCell colSpan={columns.length}><span className="table-no-results">Non ci sono risultati.</span></CTableDataCell>
          </CTableRow>
        )}
        {loading === false && items.length > 0 && items.map((currentItem, itemIndex) => (
          <CTableRow key={`row-${itemIndex}`} onDoubleClick={() => rowAction(currentItem._id)}>
            {columns.map((currentColumn, rowIndex) => (
              <CTableDataCell key={`${itemIndex}-${currentColumn.key}-${rowIndex}`}>{currentItem[currentColumn.key]}</CTableDataCell>
            ))}
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
}

AppTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  columns: PropTypes.any.isRequired,
  items: PropTypes.any.isRequired,
  rowAction: PropTypes.func,
  sortBy: PropTypes.string.isRequired,
  orderBy: PropTypes.oneOf(['asc', 'desc']).isRequired,
  onChangeOrderSort: PropTypes.func,
};

AppTable.defaultProps = {
  rowAction: null,
  onChangeOrderSort: null,
};

export default AppTable;
