import TourService from "../api/tourService";

const siteMap = {
  tours: {
    mainService: async () => {
      const TourService = await import("../api/tourService");
      return new TourService.default();
    },
    title: 'Tours',
    columns: [
      {
        key: 'name',
        collectionField: 'name',
        label: 'Nome Tour',
        _props: { scope: 'col' },
      },
      {
        key: 'contact_business_name',
        collectionField: 'contact.business_name',
        label: 'Nome contatto',
        _props: { scope: 'col' },
      },
      {
        key: 'product_category_name',
        lookup: 'product_category_id',
        label: 'Categoria',
        _props: { scope: 'col' },
      }
    ],
  },
}

export default siteMap;
