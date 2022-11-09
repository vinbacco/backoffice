import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CCol, CPagination, CPaginationItem, CRow, CTable } from '@coreui/react'

import { setContent, setTotal } from 'src/redux/slices/listSlice'

import siteMap from 'src/services/app/siteMap'
import appUtils from 'src/utils/appUtils'

// const items = [
//   {
//     _id: 1,
//     contact_business_name: 'Vini buoni',
//     product_category_name: 'Rosso',
//     _cellProps: { id: { scope: 'row' } },
//   },
//   {
//     _id: 2,
//     contact_business_name: 'Vini estate',
//     product_category_name: 'Bianco',
//     _cellProps: { id: { scope: 'row' } },
//   },
//   {
//     _id: 3,
//     contact_business_name: 'Vini autunno',
//     product_category_name: 'Viola',
//     _cellProps: { id: { scope: 'row' }, class: { colSpan: 2 } },
//   },
// ]

const AppList = ({sectionName, children}) => {
  const listData = useSelector((state) => state.list)
  const dispatch = useDispatch()
  const sectionConfigurations = siteMap[sectionName]

  useEffect(() => {
    const okGetList = (response) => {
      const listTotal = response?.headers?.total || 0
      const listContent = response?.data || []
      dispatch(setContent(listContent))
      dispatch(setTotal(listTotal))
    }

    const koGetList = (error) => {
      console.log(error)
    }

    const processMainService = async () => {
      const mainService = await sectionConfigurations.mainService();
      mainService.getList(10, 1, okGetList, koGetList);
    }
    processMainService().catch(e => console.error(e)) 
    
  }, [])

  const mapListContent = () => {
    const currentListContent = []
    if (listData.content.length > 0) {
      listData.content.forEach((currentElement, elementArrayIndex) => {
        const currentElementObject = {}
        sectionConfigurations.columns.forEach(currentColumn => {
          if (currentColumn.key === 'index') currentElementObject.index = elementArrayIndex + 1
          else currentElementObject[currentColumn.key] = appUtils.nestedProperty(currentElement, currentColumn.collectionField)
        })
        currentListContent.push(currentElementObject)
      })
      
    }
    return currentListContent
  }

  return (
    <>
      <h1>{sectionConfigurations.title}</h1>
      <CTable striped bordered columns={sectionConfigurations.columns} items={mapListContent()} />
      <CRow className="align-items-center">
        <CCol>
          <CPagination aria-label={`Table pagination for ${sectionConfigurations.title}`}>
            <CPaginationItem className={listData.page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'} disabled={listData.page === 1}>Pagina precedente</CPaginationItem>
            <CPaginationItem className={listData.page === Math.ceil(listData.total / listData.paginate) ? 'cursor-not-allowed' : 'cursor-pointer'} disabled={listData.page === Math.ceil(listData.total / listData.paginate)}>Pagina successiva</CPaginationItem>
          </CPagination>
        </CCol>
        <CCol className="text-end">
          Pagina {listData.page} di {Math.ceil(listData.total / listData.paginate)} ({listData.total} risultat{listData.total === 1 ? 'o' : 'i'})
        </CCol>
      </CRow>
      {children}
    </>
  )
}

export default AppList
