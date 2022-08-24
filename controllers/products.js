const Product = require("../models/product");

const getAllProductStatic = async (req, res) => {
  const products = await Product.find().select("name company rating");
  res.status(200).json(products);
};

const getAllProduct = async (req, res) => {
  const { featured, name, company, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (name) {
    queryObject.name = { $regex: name };
  }
  if (company) {
    queryObject.company = company;
  }
  let result = Product.find(queryObject);

  //sort

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  //fields

  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regX = /\b(>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regX,
      (match) => `-${operatorMap[match]}-`
    );

    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (field) {
        queryObject[field] = { [operator]: value };
      }
    });

    console.log(queryObject);
  }

  //limits, skip,

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProduct,
  getAllProductStatic,
};
