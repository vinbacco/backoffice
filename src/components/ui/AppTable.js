import { cilChevronBottom, cilChevronTop } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
} from '@coreui/react';
import React from 'react';
import AppLoadingSpinner from './AppLoadingSpinner';

function AppTable({
  loading = false, columns, items, rowAction = null, sortBy = '', orderBy = 'asc', onChangeOrderSort = null,
}) {
  /**
    key: 'select',
    label: <CFormCheck checked={Array.isArray(data) && data.length  === state.selectedItems.length } onChange={(event) => toggleSelectAllRows(event)} />,
    _style: { width: '1%' },
    _props: { scope: 'col' },
   */

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
        {loading === false && items.map((currentItem, itemIndex) => (
          <CTableRow key={`row-${itemIndex}`} onDoubleClick={() => rowAction(currentItem._id)}>
            {columns.map((currentColumn, rowIndex) => (
              <CTableDataCell key={`${itemIndex}-${currentColumn.key}-${rowIndex}`}>{currentItem[currentColumn.key]}</CTableDataCell>
            ))}
          </CTableRow>
        ))}
        {/* <CTableRow>
          <CTableDataCell>1</CTableDataCell>
          <CTableDataCell>Mark</CTableDataCell>
          <CTableDataCell>Otto</CTableDataCell>
          <CTableDataCell>@mdo</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>2</CTableDataCell>
          <CTableDataCell>Jacob</CTableDataCell>
          <CTableDataCell>Thornton</CTableDataCell>
          <CTableDataCell>@fat</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableDataCell>3</CTableDataCell>
          <CTableDataCell colSpan="2">Larry the Bird</CTableDataCell>
          <CTableDataCell>@twitter</CTableDataCell>
        </CTableRow> */}
      </CTableBody>
    </CTable>
  );
}

export default AppTable;
