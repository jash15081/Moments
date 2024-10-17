import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateAccountDetails,
    checkAuth,
    searchUsers,
    getUser,
    sendRequest,
    acceptRequest,
    deleteRequest,
    unfollow,
    getPendingRequests,
    getFollowers,
    getFollowings,
    removeFollower,
    getNotifications
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/checkAuth").post(verifyJWT,checkAuth)
router.route("/search").post(verifyJWT,searchUsers)
router.route("/getUser/:username").get(verifyJWT,getUser)
router.route("/sendRequest").post(verifyJWT,sendRequest)
router.route("/unfollow").post(verifyJWT,unfollow)
router.route("/cancelRequest").post(verifyJWT,deleteRequest)
router.route("/acceptRequest").post(verifyJWT,acceptRequest)
router.route("/getPendingRequests").get(verifyJWT,getPendingRequests);
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").post(verifyJWT, updateAccountDetails)
router.route("/avatar").post(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/getFollowers/:userId").get(verifyJWT,getFollowers);
router.route("/getFollowings/:userId").get(verifyJWT,getFollowings);
router.route("/removeFollower").post(verifyJWT,removeFollower)
router.route("/getNotifications").get(verifyJWT,getNotifications)
export default router