import { Router } from "express";
import { 
    createPost,
    getPostbyUser,

 } from "../controllers/post.controller.js";
 import { upload } from "../middlewares/multer.middleware.js";
 import { verifyJWT } from "../middlewares/auth.middleware.js";

 const router = Router()

 router.route("/create").post(verifyJWT,upload.single('media'),createPost)
 router.route("/getPostsByUser").post(verifyJWT,getPostbyUser);

 export default router