import TourService from "../api/tourService";

const siteMap = {
  tours: {
    mainService: new TourService(),
    title: 'Tours',
    columns: [
      // {
      //   key: 'index',
      //   label: '#',
      //   _props: { scope: 'col' },
      // },
      {
        key: 'name',
        lookAt: 'name',
        label: 'Nome Tour',
        _props: { scope: 'col' },
      },
      {
        key: 'contact_business_name',
        lookAt: 'contact.business_name',
        label: 'Nome contatto',
        _props: { scope: 'col' },
      },
      {
        key: 'product_category_name',
        lookAt: 'product_category.name',
        label: 'Categoria',
        _props: { scope: 'col' },
      }
    ],
  }
}

export default siteMap;
