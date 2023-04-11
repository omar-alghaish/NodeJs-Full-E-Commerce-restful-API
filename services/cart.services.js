const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiErrors");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Coupon = require("../models/coupon.model");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desc     Add product to cart
// @route    POST  /api/v1/cart
// @access   private/ user
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  // 1) get cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    // create cart for logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() == productId && item.color == color
    );
    console.log(productIndex);
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      //product not exist push product to cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  // calculate total cart price

  calcTotalCartPrice(cart);

  await cart.save();
  res.status(200).json({
    status: "success",
    message: "product added to cart successfully",
    data: cart,
  });
});

// @desc     Get logged user cart
// @route    GET  /api/v1/cart
// @access   private/ user

exports.getLogedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`there is no cart for this user id: ${req.user._id}`, 404)
    );
  }
  res.status(200).json({ numOfCartItems: cart.cartItems.length, data: cart });
});

// @desc     Remove specific cart item
// @route    Delete  /api/v1/cart:itemId
// @access   private/ user
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );
  calcTotalCartPrice(cart);
  res.status(200).json({ numOfCartItems: cart.cartItems.length, data: cart });
});

// @desc     Remove all cart items
// @route    DELETE  /api/v1/cart
// @access   private/ user
exports.deleteAllCartItems = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.cartItems = [];
  calcTotalCartPrice(cart);
  cart.save();
  res.status(200).json({ status: "success", data: cart });
});

// @desc     update specific cart item quantity
// @route    PUT  /api/v1/cart/:itemId
// @access   private/ user
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`there is no cart for user ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`there is no item for this id :${req.params.itemId}`, 404)
    );
  }
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc     Apply coupon on logged user cart
// @route    PUT  /api/v1/cart/applyCoupon
// @access   private/ user
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError(`coupon is invalid or expired`));
  }
  // 2) get loggedf user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });
  const totalPrice = cart.totalCartPrice;

  // 3) calculate price after priceAfterDisccount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
