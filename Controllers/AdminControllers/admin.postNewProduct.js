import CONSTANTS from '../../_CONSTANTS';
import sequelize from '../../db';
import Product from '../../Models/ProductModel';
import pP from '../../Models/Product_PropertiesModel';
import QUERIES from '../rawqueries';

const postNewProduct = async (req, res) => {
  /* eslint-disable */
  const {
    name,
    description,
    price,
    discount,
    tags,
    images,
    category_id: categoryId,
    product_properties: productProperties,
  } = req.body;
  /* eslint-enable */
  if (req.method !== 'POST') {
    throw new Error('Improper Method');
  }
  try {
    const { vatRate } = CONSTANTS.vatRate;
    const getProductId = await sequelize
      .query(`${QUERIES.insertIntoProducts}`, {
        model: Product,
        replacements: {
          name,
          description,
          price,
          vatRate,
          discount,
          tags: JSON.stringify(tags),
          images: JSON.stringify(images),
          categoryId,
        },
        type: sequelize.QueryTypes.INSERT,
      });

    await Promise.all(
      productProperties.map(obj => sequelize
        .query(`${QUERIES.insertIntoProductProperties}`, {
          model: pP,
          replacements: {
            category_id: obj.category_id,
            property_name: obj.property_name,
            units: obj.units,
            property_value: obj.property_value,
            product_id: getProductId[0],
          },
          type: sequelize.QueryTypes.INSERT,
        })),
    );
    res
      .status(201)
      .send('Success');
  } catch (e) {
    /* eslint-disable-next-line */
    console.log(e);
    res
      .status(500)
      .send('Was unable to save correctly, please try again later');
  }
};
export default postNewProduct;
