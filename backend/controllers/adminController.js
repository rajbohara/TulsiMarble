import jwt from 'jsonwebtoken';

const loginAdmin = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if( email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ){
           const token = jwt.sign(email+password,process.env.JWT_SECRET)
           res.status(200).json({success:true,message:"Login successful",token});

        } else {
            return res.status(400).json({success:false,message:"Invalid email or password"})
        }
            
    } catch (error) {
        console.log(error)
    res.status(500).json({success:false,message:error.message})
    }
}

const addPatti = async(req,res)=>{
    console.log(" route hit");
     const { default: pattiModel } = await import('../models/pattiModel.js');

    try {
        
        const { name, rate, quantity, size, type, category } = req.body;

        if (!name || !rate || !quantity || !size || !req.file || !type || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newPatti = new pattiModel({
            name,
            rate,
            quantity,
            size,
            image: req.file.path, // Cloudinary URL
            type,
            category
        });

        const savedPatti = await newPatti.save();
        res.status(201).json({success: true, message: "Patti added successfully", patti: savedPatti });
    } catch (error) {
        console.error("Error adding patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

const editPatti = async(req,res)=>{
       console.log("edit route hit ");
     const { default: pattiModel } = await import('../models/pattiModel.js');
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

        res.status(201).json({success: true, message: "Patti edited successfully", patti});
    } catch (error) {
        console.error("Error editing patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const deleteAdditionalInfo = async(req,res)=>{
     console.log("delete additional route hit ");
     const { default: AdditionalPatti } = await import('../models/additionalpattiModel.js');
      const { _id } = req.params;
        const pattid = _id; 
       
    try {
        
        const deleted = await AdditionalPatti.findOneAndDelete({ pattid });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Additional info not found" });
        }
        res.status(201).json({success: true, message: "Additional info deleted successfully", deleted });
    } catch (error) {
        console.error("Error adding patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const deletePatti = async(req,res)=>{
      console.log("delete route hit ");
     const { default: pattiModel } = await import('../models/pattiModel.js');
      const { _id } = req.params;
    try {
        
        const deleted = await pattiModel.findOneAndDelete({ _id });

        res.status(201).json({success: true, message: "deleted successfully", deleted });
    } catch (error) {
        console.error("Error adding patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const addAdditionalInfo = async(req,res)=>{
    console.log("additional route hit ");
     const { default: AdditionalPatti } = await import('../models/additionalpattiModel.js');
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
        console.log("newAdditionalPatti", newAdditionalPatti);
        const existingAdditionalPatti = await AdditionalPatti.findOne({ pattid });
        if (existingAdditionalPatti) {  
            // If additional info already exists, update it
            await AdditionalPatti.updateOne({ pattid }, updateddata);
            const updatedAdditionalPatti = await AdditionalPatti.findOne({ pattid });
            return res.status(200).json({   
                success: true,
                message: "Additional info updated successfully",
                additionalPatti: updatedAdditionalPatti
            }); 
        } else {
        const savedAdditionalPatti = await newAdditionalPatti.save();

        res.status(201).json({
            success: true,
            message: "Additional info added successfully",
            additionalPatti: savedAdditionalPatti
        }); }
    } catch (error) {
        console.error("Error adding additional info", error);
        res.status(500).json({
            success: false,
            message: "Error adding additional info"
        });
    }
}

const inventory = async(req,res)=>{
     console.log(" route hit to get inventory");
     const { default: pattiModel } = await import('../models/pattiModel.js');
    
    try {
         const patti = await pattiModel.find({});
         res.status(200).json({success:true, patti });
    } catch (error) {
        console.error("Error getting patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const allOrders = async(req,res)=>{
     console.log(" route hit to get all orders");
     const { default: Order } = await import('../models/orderModel.js');
    
    try {
         const orders = await Order.find({}).populate('pattid'); // pattid will be the full patti object
         res.status(200).json({success:true, orders });
    } catch (error) {
        console.error("Error getting orders:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const selectedPatti = async(req,res)=>{
     console.log(" route hit to get selected patti");
     const { _id } = req.params;
     const { default: pattiModel } = await import('../models/pattiModel.js');
    
    try {
         const selectedpatti = await pattiModel.findOne({ _id: _id });
         res.status(200).json({success:true, selectedpatti });
    } catch (error) {
        console.error("Error getting patti:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const orderStatus = async(req,res)=>{
     console.log(" route hit to get order status");
     const { orderId } = req.params;
     const { status } = req.body;
     const { default: Order } = await import('../models/orderModel.js');
    
    try {
         const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
         res.status(200).json({success:true, updatedOrder });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export  {addPatti,editPatti, deleteAdditionalInfo, deletePatti, addAdditionalInfo, inventory, allOrders,selectedPatti,orderStatus, loginAdmin};