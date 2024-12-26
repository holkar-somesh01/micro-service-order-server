import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Cart from "../model/Cart";
import { Product } from "../model/Product";
import { consumeQueue } from "../service/rabbitmq";


export const addCart = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    console.log(req.body, "ddd");

    const { productId } = req.body;
    const x: any = await Product.findOne({ pId: productId })

    const result: any = await Cart.findOne({ userId: (req as any).user, productId: x._id })
    console.log(result);

    if (result) {
        await Cart.findByIdAndUpdate(result._id, { $inc: { qty: 1 } })
    } else {
        await Cart.create({ userId: (req as any).user, productId: x._id })
    }
    res.json({ message: "Cart updated successfully" });
});


export const getAllCartItems = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const uid = (req as any).user
    // if (!mongoose.Types.ObjectId.isValid(uid)) {
    //     return res.status(400).json({ message: "Invalid or missing User ID" });
    // }

    try {
        const cartItems = await Cart.find({ userId: (req as any).user }).populate("productId")

        res.status(200).json({ message: "Cart items retrieved successfully", result: cartItems });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


export const deleteItemFromCart = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
    }

    await Cart.findByIdAndDelete(id);

    res.json({ message: "Cart item deleted successfully" });
});


export const deleteAllCart = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params;

    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //     return res.status(400).json({ message: "Invalid User ID" });
    // }

    await Cart.deleteMany({ userId: "671f87bfc9bbc66a4b5f396f" });

    res.status(200).json({ message: "All cart items deleted successfully" });
});
export const getallProducts = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const result = await Product.find()
    res.status(200).json({ message: "product fetch  successfully", result });
});
export const getProductsdetails = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params
    const result = await Product.findOne({ _id: id })
    res.status(200).json({ message: "product fetch  successfully", result });
});


export const addProduct = async () => {
    await consumeQueue("orderQueue", async (data) => {
        console.log("DDRRRRRRRR");
        const result = await Product.create({
            name: data.name,
            desc: data.desc,
            price: data.price,
            stock: data.stock,
            mrp: data.mrp,
            hero: data.hero,
            active: data.active,
            pId: data._id,
        })
    })
}