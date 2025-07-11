import express from 'express';
import cors from 'cors';
const app = express();

import mongoose from "mongoose";
import upload from './upload.js'; // multer with cloudinary
import dotenv from 'dotenv';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import requireAuth from './clerkAuth.js';
import User from './models/userModel.js';
import Order from './models/orderModel.js';
import adminRouter from './routes/adminRouter.js';

dotenv.config();

const port = process.env.PORT;
const uri = process.env.MONGODB_URI;
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
app.use('/admin',adminRouter);




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