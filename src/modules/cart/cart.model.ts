import mongoose, { Schema, Document } from "mongoose"

type CartItem = {
    book: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
};

export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: CartItem[];
    upadatedAt: Date;
    createdAt: Date;
}

const CartSchema = new Schema<ICart>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        items: [
            {
                book:{ type: Schema.Types.ObjectId, ref: "Book", required: true},
                quantity: { type: Number, required: true, min: 1},
                price: { type: Number, required: true, min: 0}

            }
        ],
    },
    { timestamps: true, versionKey: false}
);
const Cart = mongoose.model<ICart>("Cart", CartSchema)

export default Cart;