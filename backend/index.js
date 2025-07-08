import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;
const uri = "mongodb+srv://iamwhole:12345@cluster0.fc0qg.mongodb.net";
import mongoose from "mongoose";
import upload from './upload.js'; // multer with cloudinary
import dotenv from 'dotenv';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import requireAuth from './clerkAuth.js';
import User from './models/userModel.js';
import Order from './models/orderModel.js';


dotenv.config();
app.use(ClerkExpressWithAuth());
const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log("database connected"));
    await mongoose.connect(`${uri}/Marble`);
};
connectDB();

app.use(cors());



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API WORKING');
});

app.post('/admin/addpatti', upload.single('image'), async (req, res) => {
     console.log(" route hit");
     const { default: pattiModel } = await import('./models/pattiModel.js');

    try {
        
        const { name, rate, quantity, size } = req.body;

        if (!name || !rate || !quantity || !size || !req.file) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newPatti = new pattiModel({
            name,
            rate,
            quantity,
            size,
            image: req.file.path // Cloudinary URL
        });

        const savedPatti = await newPatti.save();
        res.status(201).json({success: true, message: "Patti added successfully", patti: savedPatti });
    } catch (error) {
        console.error("Error adding patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post('/admin/editpatti/:_id', upload.single('image'), async (req, res) => {
     console.log("edit route hit ");
     const { default: pattiModel } = await import('./models/pattiModel.js');
      const { _id } = req.params;
       const image = req.file?.path;
       
    try {
        
        const { name, rate, quantity, size } = req.body;
        const updateddata = {name, rate, quantity, size}
        if(image) updateddata.image=image
        if (!name || !rate || !quantity || !size) {
            return res.status(400).json({ message: "All fields are required" });
        }
         
        const patti = await pattiModel.findByIdAndUpdate(_id, updateddata, { new: true });

        res.status(201).json({success: true, message: "Patti added successfully", patti});
    } catch (error) {
        console.error("Error adding patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get('/admin/deleteadditionalinfo/:_id', async (req, res) => {
     console.log("delete additional route hit ");
     const { default: AdditionalPatti } = await import('./models/additionalpattiModel.js');
      const { _id } = req.params;
       
       
    try {
        
        const deleted = await AdditionalPatti.findOneAndDelete(_id);

        res.status(201).json({success: true, message: "Additional info deleted successfully", deleted });
    } catch (error) {
        console.error("Error adding patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.get('/admin/deletepatti/:_id', async (req, res) => {
     console.log("delete route hit ");
     const { default: pattiModel } = await import('./models/pattiModel.js');
      const { _id } = req.params;
    try {
        
        const deleted = await pattiModel.findOneAndDelete(_id);

        res.status(201).json({success: true, message: "deleted successfully", deleted });
    } catch (error) {
        console.error("Error adding patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.post('/admin/addpattiimages/:_id', upload.array('images'), async (req, res) => {
  console.log("additional route hit ");
  const { default: AdditionalPatti } = await import('./models/additionalpattiModel.js');
  const { _id } = req.params;
  const pattid = _id; // Assuming _id is the patti ID to which these images belong
  // req.files is an array of files
  const images = req.files ? req.files.map(file => file.path) : [];

  try {
    const { additionalInfo } = req.body;
    const updateddata = { additionalInfo, pattid };
    if (images.length > 0) updateddata.images = images;

    // Spread updateddata, not nest it
    const newAdditionalPatti = new AdditionalPatti({
      ...updateddata
    });

    const savedAdditionalPatti = await newAdditionalPatti.save();

    res.status(201).json({
      success: true,
      message: "Additional patti images added successfully",
      additionalPatti: savedAdditionalPatti
    });
  } catch (error) {
    console.error("Error adding additional patti images:", error);
    res.status(500).json({
      success: false,
      message: "Error adding additional patti images"
    });
  }
});


app.get('/additionalinfo/:_id', async (req, res) => {
  console.log("additional getting route hit ");
  const { default: AdditionalPatti } = await import('./models/additionalpattiModel.js');
  const { _id } = req.params;
  const pattid = _id; // Assuming _id is the patti ID to which these images belong
  // req.files is an array of files
 
  try {
    const additionalPatti = await AdditionalPatti.findOne({ pattid });
    // Spread updateddata, not nest it
   res.status(200).json({success:true, additionalPatti });
  } catch (error) {
    console.error("Error gettingadditional patti images:", error);
    res.status(500).json({
      success: false,
      message: "Error getting additional patti images"
    });
  }
});

app.get('/admin/inventory', async (req, res) => {
     console.log(" route hit to get inventory");
     const { default: pattiModel } = await import('./models/pattiModel.js');
    
    try {
         const patti = await pattiModel.find({});
         res.status(200).json({success:true, patti });
    } catch (error) {
        console.error("Error getting patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.get('/myorders', async (req, res) => {
  const { userid } = req.query;
  if (!userid) {
    return res.status(400).json({ success: false, message: "userid is required" });
  }
  try {
    const orders = await Order.find({ userid }).populate('pattid') // pattid will be the full patti object
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

app.get('/admin/allorders', async (req, res) => {
  
  try {
    const orders = await Order.find({}).populate('pattid') // pattid will be the full patti object
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

app.get('/selectedpatti/:_id', requireAuth, async (req, res) => {
     console.log(" route hit to get selected patti");
     const { _id } = req.params;
     const { default: pattiModel } = await import('./models/pattiModel.js');
    
    try {
         const selectedpatti = await pattiModel.findOne({ _id: _id });

         res.status(200).json({success:true, selectedpatti });
    } catch (error) {
        console.error("Error getting patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get('/admin/selectedpatti/:_id', async (req, res) => {
     console.log(" route hit to get selected patti");
     const { _id } = req.params;
     const { default: pattiModel } = await import('./models/pattiModel.js');
    
    try {
         const selectedpatti = await pattiModel.findOne({ _id: _id });

         res.status(200).json({success:true, selectedpatti });
    } catch (error) {
        console.error("Error getting patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post('/order', requireAuth, async (req, res) => {
     console.log(" route hit to get order");
     const { pattid, quantity, userid, phone } = req.body;
       if (!pattid || !userid || !quantity || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }
   const status ='';
    
    try {
         const newOrder = new Order({ pattid, quantity, userid, phone, status });
         const savedOrder = await newOrder.save();

         res.status(200).json({success:true, savedOrder });
    } catch (error) {
        console.error("Error getting patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.put('/admin/orderstatus/:orderId', async (req, res) => {
   const { orderId } = req.params;
   const { status } = req.body; // status can be 'confirmed', 'completed', 'cancelled'
  if (!orderId) {
    return res.status(400).json({ success: false, message: "orderId is required" });
  }
  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }) 
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});
// This should match the webhook endpoint you set in Clerk dashboard
app.post('/clerk', async (req, res) => {
  const event = req.body;

  if (event.type === 'user.created') {
    const { id, phone_numbers } = event.data;
    const phone = phone_numbers?.[0]?.phone_number || null;

    // Create user in your DB if not exists
    await User.findOneAndUpdate(
      { clerkUserId: id },
      { $setOnInsert: { clerkUserId: id, phone } },
      { upsert: true, new: true }
    );
  }

  res.status(200).json({ success: true });
});


app.listen(port, () => console.log("server started", port));

app.use((err, req, res, next) => {
  if (err?.message === 'Unauthenticated') {
    console.warn('Caught Clerk unauthenticated error');
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Handle other errors
  console.error("Unhandled backend error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});