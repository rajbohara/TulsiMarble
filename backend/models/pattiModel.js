import mongoose from 'mongoose';
import sequence from 'mongoose-sequence';

const AutoIncrement = sequence(mongoose); // initialize the plugin with mongoose


const pattiSchema = new mongoose.Schema({
   
    size: { type: String, required: true},
    name: { type: String, required: true},
    rate: { type: String, required: true},
    quantity: { type: Number, required: true},
    image: { type: String, required: false }
}, { _id: false }); // disables default ObjectId

pattiSchema.plugin(AutoIncrement, { inc_field: '_id' });

const pattiModel = mongoose.model('pattiModel', pattiSchema);


export default pattiModel;
