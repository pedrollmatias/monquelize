'use strict';

const glues = [
  {
    name: 'Cola branca/Marca A/P',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17D5',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca A/M',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17D6',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca A/G',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17D7',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca B/P',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17D8',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca B/M',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17D9',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca B/G',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17DA',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca C/P',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17DB',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca C/M',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17DC',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca C/G',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17DD',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca D/P',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17DE',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca D/M',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17DF',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca D/G',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17E0',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca E/P',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17E1',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca E/M',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17E2',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca E/G',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17E3',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca F/P',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17E4',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca F/M',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17E5',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca F/G',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17E6',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca G/P',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17E7',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca G/M',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17E8',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca G/G',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17E9',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca H/P',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17EA',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca H/M',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17EB',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca H/G',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17EC',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca I/P',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17ED',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca I/M',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17EE',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca I/G',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17EF',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca J/P',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17F0',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca J/M',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17F1',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
  {
    name: 'Cola branca/Marca J/G',
    aceitaCor: false,
    costPrice: 2.3,
    salePrice: 4.5,
    currentAmount: 1000000,
    minAmount: 0,
    maxAmount: null,
    sku: '1778D7C17F2',
    categoryPathRef: 'Materiais Escolares > Colas',
    unitNameRef: 'Unidade',
  },
];

module.exports = glues;
