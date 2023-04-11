const express = require("express");

const {
  addProductToCart,
  getLogedUserCart,
  removeSpecificCartItem,
  deleteAllCartItems,
  updateCartItemQuantity,
  applyCoupon
} = require("../services/cart.services");

const AuthService = require("../services/auth.services");

const router = express.Router();
router.use(AuthService.protect, AuthService.allowedTo("user"));
router.route("/").post(addProductToCart).get(getLogedUserCart).delete(deleteAllCartItems);
router.put("/applyCoupon",applyCoupon)

router.route("/:itemId").put(updateCartItemQuantity).delete(removeSpecificCartItem);
module.exports = router;

