import mongoose, { Schema } from "mongoose";

export interface IInvoice extends mongoose.Document {
    user: Schema.Types.ObjectId;
    items: [];
    totalAmount: number;
    grandTotal: number;
}

const itemSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    total: { type: Number, required: true },
});

// Define the invoice schema
const invoiceSchema = new Schema<IInvoice>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [itemSchema],
    totalAmount: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
},
    {
        timestamps: true
    }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

export { Invoice };