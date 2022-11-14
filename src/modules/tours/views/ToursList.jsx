/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/**
 * TODO:
 * Sistemare formulario creazione con pacchetto da discutere con Marco,
 * inclusa validazione prima di salvare
 * Pulire array selezionati dopo la risposta del elimina, una volta sia implementato.
 */
import React from 'react';
import TourService from 'src/services/api/TourService';
import ContactService from 'src/services/api/ContactService';
import ProductCategoriesService from 'src/services/api/ProductCategoriesService';
import AppList from 'src/components/ui/List/AppList';

function ToursList() {
    const loadContacts = (filter) => new Promise((resolve) => {
    const contactService = new ContactService();
    const okGetContacts = (response) => {
      let responseData = [];
      if (Array.isArray(response.data) && response.data.length > 0) {
        responseData = response.data.map((currentItem) => (
          { value: currentItem._id, label: currentItem.business_name }
        ));
      }
      resolve(responseData);
    };
    const koGetContacts = () => resolve([]);
    const filters = {
      paginate: 5,
      page: 1,
    };
    if (filter.length > 0) filters['??^business_name'] = filter;
    contactService.getList(
      filters,
      (res) => okGetContacts(res),
      (err) => koGetContacts(err),
    );
  });

  const loadProductCategories = (filter) => new Promise((resolve) => {
    const productCategoriesService = new ProductCategoriesService();
    const okGetProductCategories = (response) => {
      let responseData = [];
      if (Array.isArray(response.data) && response.data.length > 0) {
        responseData = response.data.map((currentItem) => (
          { value: currentItem._id, label: currentItem.name }
        ));
      }
      resolve(responseData);
    };
    const koGetProductCategories = () => resolve([]);
    const filters = {
      paginate: 5,
      page: 1,
    };
    if (filter.length > 0) filters['??^name'] = filter;
    productCategoriesService.getList(
      filters,
      (res) => okGetProductCategories(res),
      (err) => koGetProductCategories(err),
    );
  });

  const buildColumnsFn = (tableDataParam, stateParam) => [(
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      _props: { scope: 'col' },
    },
    {
      key: 'contact.business_name',
      label: 'Cantina',
      sortable: true,
      _props: { scope: 'col' },
    }
  )];

  const buildRowsFn = (item) => ({
    name: item.name,
    'contact.business_name': item.business_name,
  });

  const mapListFn = (item) => ({
    _id: item._id,
    name: item.name,
    business_name: item.contact.business_name,
  });
  
  return (
    <AppList
      title="Lista Tour"
      SectionServiceClass={TourService}
      sectionPath="/tours"
      mapListFn={mapListFn}
      buildColumnsFn={buildColumnsFn}
      buildRowsFn={buildRowsFn}
    />
  );
}
export default ToursList;
