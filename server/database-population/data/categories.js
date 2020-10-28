'use strict';

const basicCategories = [
  {
    name: 'Materiais escolares',
    categories: [{ name: 'Cadernos' }],
  },
  {
    name: 'Mochilas',
  },
  {
    name: 'Papeis, folhas e envelopes',
  },
  {
    name: 'Periféricos',
  },
];

const completeCategories = [
  ...basicCategories,
  {
    name: 'Mídias',
    categories: [
      {
        name: 'Jogos eletrônicos',
        categories: [{ name: 'Playstation' }, { name: 'Xbox' }],
      },
      {
        name: 'Filmes',
      },
      {
        name: 'Albuns de música',
      },
    ],
  },
  {
    name: 'Livros',
    categories: [{ name: 'Ebooks' }, { name: 'Físicos' }],
  },
  {
    name: 'Instrumentos musicais',
  },
];

module.exports = {
  basic: basicCategories,
  complete: completeCategories,
};
