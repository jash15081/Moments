import { Router } from "express";
import { 
    createPost,
    getPostByUser,
    deletePost,
    likePost,
    dislikePost,
    getComments,
    addComment,
    deleteComment,
    getPostForHome

 } from "../controllers/post.controller.js";
 import { upload } from "../middlewares/multer.middleware.js";
 import { verifyJWT } from "../middlewares/auth.middleware.js";

 const router = Router()

 router.route("/create").post(verifyJWT,upload.single('media'),createPost)
 router.route("/getPostsByUser").post(verifyJWT,getPostByUser);
 router.route("/deletePost/:postId").delete(verifyJWT,deletePost);
 router.route("/like").post(verifyJWT,likePost);
 router.route("/dislike").post(verifyJWT,dislikePost)
 router.route("/getComments/:postId").get(verifyJWT,getComments)
 router.route("/addcomment").post(verifyJWT,addComment)
 router.route("/deleteComment").post(verifyJWT,deleteComment)
 router.route("/getPostsForHome").get(verifyJWT,getPostForHome);
 export default router