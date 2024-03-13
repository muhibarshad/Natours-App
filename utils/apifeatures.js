//GET /api/products?sort=price,-createdAt&fields=name,price&limit=10&page=2&price[gte]=20&price[lte]=100
class APIFeaturs {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    let queryObj = { ...this.queryString };
    const excludeQueries = ['sort', 'limit', 'fields', 'page'];
    excludeQueries.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      let sortString = this.queryString.sort;
      sortString = sortString.split(',').join(' ');
      this.query = this.query.sort(sortString);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitingFields() {
    if (this.queryString.fields) {
      let fieldsString = this.queryString.fields;
      fieldsString = fieldsString.split(',').join(' ');
      this.query = this.query.select(fieldsString);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;aggregate
  }
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeaturs;
