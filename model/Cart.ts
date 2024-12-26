import mongoose, { model, ObjectId, Types } from "mongoose";


interface ICart {
    userId: ObjectId;
    productId: ObjectId;
    qty: number;

}

const cartSchema = new mongoose.Schema<ICart>({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    qty: {
        type: Number,
        default: 1
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    }
},

    { timestamps: true });

// Export the Cart model
const Cart = model<ICart>("Cart", cartSchema);

export default Cart;
