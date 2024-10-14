import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { Follows } from "../models/follows.model.js";
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const  getCount = async (userId)=>{
    const followers = await Follows.countDocuments({followedTo:userId});
    const followings = await Follows.countDocuments({followedBy:userId});
    return {followers,followings};
}


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
   
    const {fullname, email, username, password } = req.body
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({email});
    if (existedUser) {
        throw new ApiError(409, "User with same email already exists")
    }
    const existedUser1 = await User.findOne({username});
    if (existedUser1) {
        throw new ApiError(409, "User with same username already exists")
    }
    const avatar = "https://res.cloudinary.com/dzdcpvj6w/image/upload/v1727892723/yiddhwge5jbk2svfpwnl.webp"
    const user = await User.create({
        fullname,
        email, 
        password,
        username,
        avatar
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
} )
const checkAuth = asyncHandler(async(req,res)=>{
    res.status(200).json(new ApiResponse(200,"User Authenticated !"));
})
const loginUser = asyncHandler(async (req, res) =>{
    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})
const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})
const searchUsers = asyncHandler(async (req,res)=>{
    console.log("reqcomes")
    const {str} = req.body;
    if(!str){
        return res.status(201).json(new ApiResponse(201,[],"user fetched !"));
    }
    const users = await User.find({
        $or:[{username: { $regex: str, $options: 'i' }},{fullname: { $regex: str, $options: 'i' }}]
    }).select("username fullname avatar");
    if(!users){
        throw new ApiError(500,"Something went wrong while fetching the users !");
    }
    return res.status(201).json(new ApiResponse(201,users,"user fetched !"));
})
const getUser = asyncHandler(async(req,res)=>{
    const {username} = req.params;
    if(!username){
        throw new ApiError(400,"username required to get User !!");
    }
    const user = await User.findOne({username}).select("-refreshToken -password");
    if(!user){
        throw new ApiError(401,"User not found !!");
    }

    let pending = false;
    let following =false;

    const isFollowing = await Follows.exists({followedBy:req.user._id,followedTo:user._id});
    const isPending = await User.findOne({_id:user._id,pendingRequests:req.user._id});

    if(isPending){
        pending = true
    }
    if(isFollowing){
        following = true
    }
    const {followers,followings} = await getCount(user._id);
    console.log("user sent !")
    res.status(200).json(new ApiResponse(200,{user,pending,following,followers,followings},"User Found!"));
})
const sendRequest = asyncHandler(async(req,res)=>{
    const {userId} = req.body;
    if(!userId){
        throw new ApiError(400,"User Id Required !");
    }
    let user = await User.findById(userId).select("-refreshToken -password");
    const currentId = req.user._id;
    if(!user.isPrivate){
        const follow = await Follows.create({
            followedTo:userId,
            followedBy:currentId
        })
        if(!follow){
            throw new ApiError(501,"Something went wrong while Updating the followes !");
        }
    }
    else{
        user = await User.findByIdAndUpdate(userId,{$addToSet:{pendingRequests:currentId}},{new:true}).select("-refreshToken -password");
    }
    if(!user){
        throw new ApiError(501,"Something went wrong while Updating the User !");
    }
    

    let pending = false;
    let following =false;

    const isFollowing = await Follows.findOne({followedBy:req.user._id,followedTo:user._id});
    const isPending = await User.findOne({_id:user._id,pendingRequests:req.user._id});
    if(isPending){
        pending = true
    }
    if(isFollowing){
        following = true
    }
    const {followers,followings} = await getCount(user._id);

    res.status(200).json(new ApiResponse(200,{user,pending,following,followers,followings},"added the request."));
})
const deleteRequest = asyncHandler(async(req,res)=>{
    const {userId} = req.body;
    if(!userId){
        throw new ApiError(400,"User Id Required !");
    }
    const currentId = req.user._id;
    const user = await User.findByIdAndUpdate(userId,{$pull:{pendingRequests:currentId}}).select("-refreshToken -password");
    if(!user){
        throw new ApiError(501,"Something went wrong while Updating the User !");
    }
    let pending = false;
    let following =false;

    const isFollowing = await Follows.exists({followedBy:req.user._id,followedTo:user._id});
    const isPending = await User.findOne({_id:user._id,pendingRequests:req.user._id});

    if(isPending){
        pending = true
    }
    if(isFollowing){
        following = true
    }
    console.log("request deleted !");
    const {followers,followings} = await getCount(user._id);

    res.status(200).json(new ApiResponse(200,{user,pending,following,followers,followings},"pulled the request."));
})
const acceptRequest = asyncHandler(async(req,res)=>{
    console.log("accepting")
    const {userId} = req.body;
    console.log(req.body)

    if(!userId){
        throw new ApiError(400,"User Id Required !");
    }
    console.log("hello")

    const currentId = req.user._id;
    console.log("hello")

    const user = await User.findByIdAndUpdate(currentId,{$pull:{pendingRequests:userId}}).select("-refreshToken -password");
    console.log("hello")
    if(!user){
        throw new ApiError(401,"Something went wrong while updating user")
    }
    console.log("hello")

    const follow = await Follows.create({
        followedTo:currentId,
        followedBy:userId
    })
    console.log("accepting ?")

    if(!follow){
        throw new ApiError(501,"Something went wrong while Updating the followes !");
    }
    console.log("hello")

    res.status(200).json(new ApiResponse(200,user,"accepted the request."));
})
const unfollow = asyncHandler(async(req,res)=>{
    const {userId} = req.body;
    if(!userId){
        throw new ApiError(400,"User Id Required !");
    }
    const currentId = req.user._id;
    const follow = await Follows.deleteOne({followedBy:currentId,followedTo:userId});
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(501,"Something went wrong while Updating the User !");
    }
    let pending = false;
    let following =false;

    const isFollowing = await Follows.exists({followedBy:req.user._id,followedTo:user._id});
    const isPending = await User.findOne({_id:user._id,pendingRequests:req.user._id});

    if(isPending){
        pending = true
    }
    if(isFollowing){
        following = true
    }
    const {followers,followings} = await getCount(userId);
    console.log("unfollowed !");
    res.status(200).json(new ApiResponse(200,{user,pending,following,followers,followings},"unfollowed !."));
})
const getPendingRequests = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const user = await User.findById(userId).populate('pendingRequests')
    if(!user){
        throw new ApiError(401,"User not exist!");
    }
    const pendingRequests = user.pendingRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(new ApiResponse(200,pendingRequests,"requests fetched !!"));
})


const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})
const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})
const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});
const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})
const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})
const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})
const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    checkAuth,
    searchUsers,
    getUser,
    sendRequest,
    deleteRequest,
    unfollow,
    acceptRequest,
    getPendingRequests
}