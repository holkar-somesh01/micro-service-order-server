import mongoose, { Schema } from "mongoose";

// Interface for Product document
export interface IProduct {
    name: string;
    desc: string;
    price: number;
    stock: number;
    mrp: number;
    hero: string;
    active: boolean;
    pId: string;
}

const productSchema: Schema<IProduct> = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        mrp: {
            type: Number,
            required: true,
        },
        hero: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            default: false,
        },
        pId: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);


export const Product = mongoose.model<IProduct>("Product", productSchema);
