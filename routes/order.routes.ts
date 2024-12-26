import { Router } from "express";
import * as OrderController from "../controller/order.controller";
import { userProtected } from "../middleware/Protected";
const orderrouter: Router = Router();

orderrouter
    .get("/order", userProtected, OrderController.userGetAllOrders)
    .get("/get-all-orders", OrderController.GetAllAdminOrders)
    .get("/fetch-order", OrderController.GetAllOrders)
    .get("/fetch-order", OrderController.GetAllAdminOrders)
    .get("/order-details/:id", OrderController.userGetOrderDetails)
    .post("/place-order", OrderController.userPlaceOrder)
    .put("/order-cancel/:id", OrderController.userCancelOrder)
    .put("/cancel-order/:id", OrderController.cancelOrder)
    .put("/return-order/:id", OrderController.returnOrderRequest)
    .put("/update-status/:id", OrderController.updateOrderStatus)

export default orderrouter;
