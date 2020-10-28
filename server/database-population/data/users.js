'use strict';

const basicUsers = [
  {
    username: 'maria.eduarda',
    email: 'maria.eduarda@gmail.com',
    firstName: 'Maria',
    lastName: 'Eduarda',
    sex: 'female',
    bornDate: new Date(1990, 5, 22),
  },
  {
    username: 'joaodasilva',
    email: 'joao.silva123@outlook.com',
    firstName: 'João',
    lastName: 'da Silva',
    sex: 'male',
    bornDate: new Date(1987, 0, 2),
  },
  {
    username: 'gabriela.rocha',
    email: 'gabi_rocha@gmail.com',
    firstName: 'Gabriela',
    lastName: 'Rocha',
    sex: 'female',
    bornDate: new Date(1995, 8, 18),
  },
  {
    username: 'lucasoliveira',
    email: 'lucas.araujo.oliveira@gmail.com',
    firstName: 'Lucas',
    lastName: 'Oliveira',
    sex: 'male',
    bornDate: new Date(1980, 3, 14),
  },
];

const completeUsers = [
  ...basicUsers,
  {
    username: 'artur.medeiros',
    email: 'artur@gmail.com',
    firstName: 'Artur',
    lastName: 'Medeiros',
    sex: 'male',
    bornDate: new Date(1993, 11, 2),
  },
  {
    username: 'carolzinha',
    email: 'carol_braga2909@outlook.com',
    firstName: 'Ana Carolina',
    lastName: 'Braga',
    sex: 'male',
    bornDate: new Date(2000, 1, 5),
  },
  {
    username: 'brunocfr',
    email: 'bruno.codeiro.freitas@gmail.com',
    firstName: 'Bruno',
    lastName: 'Freitas',
    sex: 'male',
    bornDate: new Date(1985, 0, 28),
  },
  {
    username: 'sofia.matos',
    email: 'sofia123@gmail.com',
    firstName: 'Sofia',
    lastName: 'Matoas',
    sex: 'female',
    bornDate: new Date(1999, 6, 24),
  },
  {
    username: 'victoria_magalhaes',
    email: 'victoria.maga12@gmail.com',
    firstName: 'Victória',
    lastName: 'Magalhães',
    sex: 'female',
    bornDate: new Date(2000, 6, 10),
  },
  {
    username: 'fernandinhaborges',
    email: 'feborges@outlook.com',
    firstName: 'Fernanda',
    lastName: 'Borges',
    sex: 'female',
    bornDate: new Date(1980, 6, 30),
  },
  {
    username: 'daniela_cunha',
    email: 'dani_cunha_378@hotmail.com',
    firstName: 'Daniela',
    lastName: 'Cunha',
    sex: 'female',
    bornDate: new Date(1991, 4, 18),
  },
  {
    username: 'Mariana Almeida',
    email: 'marianaoliveira@gmail.com',
    firstName: 'Mariana',
    lastName: 'Almeida',
    sex: 'female',
    bornDate: new Date(1992, 10, 23),
  },
];

module.exports = {
  basic: basicUsers,
  complete: completeUsers,
};
