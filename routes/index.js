const categoryRoute = require("./category.rout");
const subCategoryRoute = require("./subCategory.rout");
const brandsRoute = require("./user.route");
const productRoute = require("./product.route");
const userRoute = require("./user.route");
const authRoute = require("./auth.route");
const reviewRoute = require("./review.route");
const couponRoute = require("./coupon.route");
const cartRoute = require("./cart.route");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandsRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);

};


module.exports = mountRoutes;