
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../model/Order";
import Cart from "../model/Cart";
import { IProduct, Product } from "../model/Product";
interface CustomRequest extends Request {
    user?: string;
}
export const userGetAllOrders = asyncHandler(async (req: CustomRequest, res: Response): Promise<any> => {
    const { id } = req.params;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).json({ message: "Invalid User ID" });
    // }

    const result = await Order
        .find()
        .sort({ createdAt: -1 })
        .populate("productId.product")

    res.json({ message: "Order fetch success", result });
});


export const userGetOrderDetails = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Order ID" });
    }

    const result = await Order.findById(id);

    if (!result) {
        return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order details fetch success", result });
});

// Place an order
// export const userPlaceOrder = asyncHandler(async (req: Request, res: Response): Promise<any> => {
//     const { cartitem } = req.body
//     console.log("CARTID", cartitem);


//     let productdata = []

//     for (let i = 0; i < cartitem.length; i++) {
//         const x = await Product.findById(cartitem[i].pid)
//         productdata.push(x)

//     }

//     let total
//     for (let i = 0; i < productdata.length; i++) {

//         for (let j = i + 1; j < productdata.length; j++) {
//             if (productdata[i]) {
//                 const x = productdata[i]?.price += productdata[j]?.price
//                 total = x

//             }
//         }
//     }




//     // await Order.create(productdata)
//     res.json({ message: "Order placed successfully" });
// });

export const userPlaceOrder = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { cartitem } = req.body; //[{ pid: 'product_id', qty: number }]
    console.log("CARTID", cartitem);

    let productdata = [];
    let total = 0;

    for (let i = 0; i < cartitem.length; i++) {
        const product = await Product.findOne({ pId: cartitem[i].pid });

        if (!product) {
            return res.status(404).json({ message: `Product with id ${cartitem[i].pid} not found` });
        }

        const productTotal = product.price * cartitem[i].qty;

        productdata.push({
            product: product._id,
            qty: cartitem[i].qty
        });

        total += productTotal;
    }

    const orderData = {
        user: "671f87bfc9bbc66a4b5f396f",
        productId: productdata,
        totalAmount: total,
        status: "Pending",
    };

    const newOrder = await Order.create(orderData);

    res.status(201).json({
        message: "Order placed successfully",
        orderId: newOrder._id,
        totalPrice: total,
    });
});


export const GetAllOrders = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await Order
        .find({ user: (req as any).user })
    res.json({ message: "Order fetch success", result });
});

export const GetAllAdminOrders = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    // const result = await Order.find()
    const result = await Order.find().populate("productId.product")
    res.json({ message: "Order fetch success", result });
});

export const userCancelOrder = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Order ID" });
    }

    const result = await Order.findByIdAndUpdate(id, { status: "cancel" });

    if (!result) {
        return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order cancel success" });
});

//  ethesham

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params
    const { status, returnStatus } = req.body
    console.log(req.body, "body=======================================");


    const order = await Order.findById(id)

    if (!order) {
        return res.status(404).json({ message: "Order Not Found" })
    }

    await Order.findByIdAndUpdate(id, { status, returnStatus })
    res.status(200).json({ message: "Order Status Update Successfully" })
})

export const cancelOrder = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params

    const order = await Order.findById(id)

    if (!order) {
        return res.status(404).json({ message: "Order Not Found" })
    }

    await Order.findByIdAndUpdate(id, { status: "Cancelled" })
    res.status(200).json({ message: "Order Cancel Successfully" })
})

export const returnOrderRequest = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params

    const order = await Order.findById(id)

    if (!order) {
        return res.status(404).json({ message: "Order Not Found" })
    }

    await Order.findByIdAndUpdate(id, { returnStatus: "Pending", returnReason: req.body.returnReason })
    res.status(200).json({ message: "Order Return Requested Successfully" })
})