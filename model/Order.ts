import mongoose, { Schema, Document, Model } from "mongoose";

// Define Product Sub-Schema
interface productId {
    product: mongoose.Types.ObjectId;
    qty: number;
}

// Define Order Document Interface
export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    productId: productId[];

    status: "placed" | "cancel" | "delivered";
    createdAt?: Date;
    updatedAt?: Date;
}

// Define Order Schema
const orderSchema: Schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "user",
            required: true,
        },
        // products: [
        //     {
        //         name: {
        //             type: String,
        //             required: true,
        //         },
        //         desc: {
        //             type: String,
        //             required: true,
        //         },
        //         price: {
        //             type: Number,
        //             required: true,
        //         },
        //         stock: {
        //             type: Number,
        //             required: true,
        //         },
        //         mrp: {
        //             type: Number,
        //             required: true,
        //         },
        //         images: {
        //             type: String,
        //             required: true,
        //         },
        //         active: {
        //             type: Boolean,
        //             default: false,
        //         },
        //     }

        // ],
        productId: [{
            product: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
                required: true
            },
            qty: {
                type: Number
            }
        }
        ],
        totalAmount: {
            type: Number,
            required: true
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["Cash on Delivery"],
            default: "Cash on Delivery",
        },
        status: {
            type: String,
            required: true,
            enum: ["Pending", "Shipped", "Delivered", "Cancelled", "Returned"],
            default: "Pending",
        },
        returnStatus: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
            default: null,
        },
        returnReason: { type: String, default: null }
    },
    { timestamps: true }
);

// Export the model with type
const Order: Model<IOrder> = mongoose.model<IOrder>("order", orderSchema);

export default Order;
