import express from 'express'
import { addPatti,editPatti,deleteAdditionalInfo, deletePatti, addAdditionalInfo ,inventory, allOrders, selectedPatti,orderStatus} from '../controllers/adminController.js'
import upload from '../upload.js'; // multer with cloudinary

const adminRouter = express.Router()

adminRouter.post('/addpatti', upload.single("image"), addPatti)
adminRouter.post('/editpatti/:_id', upload.single("image"), editPatti)
adminRouter.get('/deleteadditionalinfo/:_id',deleteAdditionalInfo)
adminRouter.get('/deletepatti/:_id',deletePatti)
adminRouter.post('/addpattiimages/:_id', upload.array('images'),addAdditionalInfo)
adminRouter.get('/inventory', inventory)
adminRouter.get('/allorders', allOrders)
adminRouter.get('/selectedpatti/:_id', selectedPatti)
adminRouter.put('/orderstatus/:orderId', orderStatus)

export default adminRouter;