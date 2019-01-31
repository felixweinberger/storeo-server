const faker = require('faker');

const createFakeProducts = () => ({
  name: faker.commerce.productName(),
  description: faker.lorem.sentence(),
  timestamp: faker.date.recent(),
  image1: JSON.stringify(`${faker.image.imageUrl()}`),
  image2: JSON.stringify(`${faker.image.imageUrl()}`),
  image3: JSON.stringify(`${faker.image.imageUrl()}`),
  price: faker.commerce.price(),
  discount: faker.random.number(100),
  tags: JSON.stringify(`${faker.commerce.productAdjective()},
        ${faker.commerce.productAdjective()},
        ${faker.commerce.productAdjective()}`),
  selling_price: faker.random.number(100),
});
const fakeProducts = [];
const desiredAmout = 50;

/* eslint-disable-next-line */
for (let i = 0; i < desiredAmout; i++) {
  fakeProducts.push(createFakeProducts());
}
/* eslint-disable-next-line */
exports.seed = (knex, Promise) => (
  // Deletes ALL existing entries
  knex('products')
    .del()
    .then(() => knex('products').insert(fakeProducts))
);
