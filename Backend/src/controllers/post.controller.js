import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
const createPost = asyncHandler(async(req,res)=>{
    const file = req.file?.path;
    const userId = req.user._id
    console.log("here ?")
    if(!file){
        throw new ApiError(400,"File required !");
    }
    const {caption} = req.body;
    if(!caption){
        throw new ApiError(400,"caption required!");
    }
    const response = await uploadOnCloudinary(file);
    if(!response){
        throw new ApiError(500,"Something went wrong while upoading on cloudinary !!");
    }
    const url = response.url;
    const type = response.resource_type;
    const post = await Post.create({
        createdBy:userId,
        media:url,
        mediaType:type,
        caption:caption
    })
    if(!post){
        throw new ApiError(500,"Something went wrong while creating the post !");
    }
    res.status(200).json(new ApiResponse(200,"Post Created SuccessFully !!"));
})

const getPostByUser = asyncHandler(async (req, res) => {
    const userId = req.body.userId;
    const currentUserId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "Invalid user ID provided.");
    }
    console.log(await Post.findOne({createdBy:userId}))
    console.log(await Post.aggregate([{$match:{createdBy:new mongoose.Types.ObjectId(userId)}}]))

    const posts = await Post.aggregate([
        {
            $match:{createdBy: new mongoose.Types.ObjectId(userId) }, 
        },
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'post',
                as: 'comments',
            },
        },
        {
            $lookup: {
                from: 'likes',
                let: { postId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$content', '$$postId'] },
                                    { $eq: ['$contentType', 'post'] }, // Filter for 'post' content type only
                                ],
                            },
                        },
                    },
                ],
                as: 'likes',
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                pipeline: [
                    {
                        $project: {
                            avatar: 1,
                            username: 1,
                            _id: 1,
                            fullname: 1,
                        },
                    },
                ],
                as: 'creator',
            },
        },
        {
            $unwind: '$creator',
        },
        {
            $addFields: {
                commentsCount: { $size: '$comments' },
                likesCount: { $size: '$likes' },
                isLikedByCurrentUser: {
                    $in: [currentUserId, '$likes.likedBy'],
                },
            },
        },
        {
            $project: {
                likes: 0,
                comments: 0,
            },
        },
    ]);

    if (!posts || posts.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No posts found for the user."));
    }

    res.status(200).json(new ApiResponse(200, { posts }, "Posts fetched successfully"));
});



export {
    createPost,
    getPostByUser
}