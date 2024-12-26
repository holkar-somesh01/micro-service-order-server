import { Router } from "express";
import *as cartController from "../controller/cart.controller";
import { userProtected } from "../middleware/Protected"
const cartrouter = Router();

cartrouter
    .post("/add-product", userProtected, cartController.addCart) // Add product to cart
    .delete("/delete-product/:id", cartController.deleteItemFromCart) // Delete a specific product from cart
    .delete("/delete-all-products", cartController.deleteAllCart) // Delete all products for a user
    .get("/get-all-products", cartController.getAllCartItems) // Get all cart items for a user
    .get("/get-products", cartController.getallProducts) // Get all cart items for a user
    .get("/get-products-details/:id", cartController.getProductsdetails); // Get all cart items for a user

export default cartrouter;
