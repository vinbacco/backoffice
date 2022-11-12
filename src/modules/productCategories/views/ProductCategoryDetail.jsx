/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

import React from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

const ProductCategoryDetail = () => {
  const data = {
    name: 'Puglia',
    product_type: {
      _id: '1',
      name: 'Tour',
    },
  };

  const productTypes = [
    {
      _id: '1',
      name: 'Tour',
    },
    {
      _id: '2',
      name: 'Voucher',
    },
  ];

  const schema = {
    title: `Categoria Prodotto: ${data.name}`,
    type: 'object',
    required: ['name', 'product_type_id'],
    properties: {
      product_type_id: {
        type: 'string',
        title: 'Tipo Prodotto',
        oneOf: productTypes.map((item) => ({
          const: item._id,
          title: item.name,
        })),
        default: data.product_type._id,
      },
      name: { type: 'string', title: 'Nome', default: data.name },
    },
  };

  return (
    <Form
      schema={schema}
      validator={validator}
      onSubmit={(e) => console.log(e.formData)}
      onError={() => console.log('errors')}
    />
  );
};

export default ProductCategoryDetail;
