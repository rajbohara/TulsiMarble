import mongoose from "mongoose";

const additionalPattiSchema = new mongoose.Schema({
     pattid:  { type: Number, ref: 'pattiModel' },
    images: [{ type: String, required: true }],
    additionalInfo: { type: String, required: true }
}, {
    timestamps: true
});
const AdditionalPatti = mongoose.model('AdditionalPatti', additionalPattiSchema);
export default AdditionalPatti;