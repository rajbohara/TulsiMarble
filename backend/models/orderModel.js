import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userid: { type:String, required:true},
    pattid:  { type: Number, ref: 'pattiModel' },
    quantity: { type:String, required:true},
    phone: { type:String, required:true}
},{
    timestamps:true
}
);

const Order = mongoose.model('Order', orderSchema);

export default Order;