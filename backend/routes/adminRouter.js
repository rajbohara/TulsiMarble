import express from 'express'
import { addPatti,editPatti,deleteAdditionalInfo, deletePatti, addAdditionalInfo ,inventory, allOrders, selectedPatti,orderStatus, loginAdmin} from '../controllers/adminController.js'
import upload from '../upload.js'; // multer with cloudinary
import authAdmin from '../middlewares/authAdmin.js'

const adminRouter = express.Router()

adminRouter.post('/addpatti',authAdmin, upload.single("image"), addPatti)
adminRouter.post('/editpatti/:_id',authAdmin, upload.single("image"), editPatti)
adminRouter.get('/deleteadditionalinfo/:_id',authAdmin,deleteAdditionalInfo)
adminRouter.get('/deletepatti/:_id',authAdmin,deletePatti)
adminRouter.post('/addpattiimages/:_id',authAdmin, upload.array('images'),addAdditionalInfo)
adminRouter.get('/inventory', inventory)
adminRouter.get('/allorders',authAdmin, allOrders)
adminRouter.get('/selectedpatti/:_id',authAdmin, selectedPatti)
adminRouter.put('/orderstatus/:orderId',authAdmin, orderStatus)
adminRouter.post('/login', loginAdmin )

export default adminRouter;