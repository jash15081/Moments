import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { Likes } from "../models/likes.model.js";
import { Comment } from "../models/comments.model.js";
import { Follows } from "../models/follows.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
const createPost = asyncHandler(async(req,res)=>{
    const file = req.file?.path;
    const userId = req.user._id
    if(!file){
        throw new ApiError(400,"File required !");
    }
    const {caption} = req.body;
   
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
        caption:caption || "",
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
                                    true
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



    res.status(200).json(new ApiResponse(200, { posts }, "Posts fetched successfully"));
});

const deletePost = asyncHandler(async(req,res)=>{
    const {postId} = req.params;
    if(!postId){
        throw new ApiError(400,"post Id required !");
    }
    await Post.deleteOne({_id:postId});
    req.body.userId = req.user._id
    getPostByUser(req,res);
})

const likePost = asyncHandler(async(req,res)=>{
    const {postId} = req.body;
    const userId = req.user._id;
    if(!postId){
        throw new ApiError(400,"Post Id required !");
    }
    const post = await Post.findById(postId).populate("createdBy");
    const currUser = await User.findById(userId);
    const like = await Likes.create({
        likedBy:userId,
        content:postId,
    })

    if(!like){
        throw new ApiError(500,"something went wrong while creating the like");
    }
    await Notification.create({
        userId:post.createdBy._id,
        message:`${currUser.username} just liked your post !!`,
        avatar:currUser.avatar
    })
    res.status(200).json(new ApiResponse(200,"Liked SUccessFully !"));
})

const dislikePost = asyncHandler(async(req,res)=>{
    const {postId} = req.body;
    const userId = req.user._id;
    if(!postId){
        throw new ApiError(400,"Post Id required !");
    }

    const like = await Likes.deleteOne({
        likedBy:userId,
        content:postId,
    })
    res.status(200).json(new ApiResponse(200,"DisLiked SUccessFully !"));
})

const getComments = asyncHandler(async(req,res)=>{
    const {postId} = req.params;
    const currentUserId = req.user._id;
    if(!postId){
        throw new ApiError(400,"postId required !");
    }
    const comments = await Comment.aggregate([
        {
          $match: { post: new mongoose.Types.ObjectId(postId) }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $lookup: {
            from: 'users', 
            localField: 'commentedBy',
            foreignField: '_id',
            as: 'commentedBy'
          }
        },
        {
          $unwind: '$commentedBy'
        },
        {
          $addFields: {
            isDeletable: { $eq: ['$commentedBy._id',new mongoose.Types.ObjectId(currentUserId)] }
          }
        },
        {
          $project: {
            _id: 1,
            post: 1,
            content: 1,
            createdAt: 1,
            'commentedBy.username': 1,
            'commentedBy.avatar': 1,
            isDeletable: 1
          }
        }
      ]);
    res.status(200).json(new ApiResponse(200,comments,"comments fetched SuccessFully !"));

})

const addComment = asyncHandler(async(req,res)=>{
    const {postId,content} = req.body;
    const userId = req.user._id;
    if(!postId || !content){
        throw new ApiError(400,"content and PostId is required !");
    }
    const comment = Comment.create({
        content,
        post:postId,
        commentedBy:userId,
    })
    const post = await Post.findById(postId).populate("createdBy");
    const currUser = await User.findById(userId);
    if(!comment){
        throw new ApiError(500,"Something went wrong while creating the comment")
    }
    await Notification.create({
        userId:post.createdBy._id,
        message:`${currUser.username} just commented on your post !!`,
        avatar:currUser.avatar
    })
    res.status(200).json(200,comment,"comment fetched SuccessFully !");
})

const deleteComment = asyncHandler(async(req,res)=>{
    const {commentId} = req.body;
    if(!commentId){
        throw new ApiError(400,"comment id required !");
    }
    await Comment.deleteOne({_id:commentId});
    res.status(200).json(200,"Comment deleted SuccessFully");
})

const getPostForHome = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
   // Step 1: Get the list of followed user IDs
    const followedUsers = await Follows.find({ followedBy: userId }).select('followedTo');
    const followedUserIds = followedUsers.map(follow => follow.followedTo);

    // Step 2: Define the aggregation pipeline
    const pipeline = [
        {
            // Step 1: Match posts created by followed users or public accounts
            $match: {
                $or: [
                    { createdBy: { $in: followedUserIds } }, // Posts from followed users
                    { isPrivate: false } // Posts from public accounts
                ]
            }
        },
        {
            // Step 2: Randomly sample posts
            $sample: { size: 10 } // Get 10 random posts
        },
        {
            // Step 3: Lookup comments for each post
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'post',
                as: 'comments',
            },
        },
        {
            // Step 4: Lookup likes for each post
            $lookup: {
                from: 'likes',
                let: { postId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$content', '$$postId'],
                            },
                        },
                    },
                ],
                as: 'likes',
            },
        },
        {
            // Step 5: Lookup the creator (user) information for each post
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
            // Step 6: Unwind the creator array to a single object
            $unwind: '$creator',
        },
        {
            // Step 7: Add additional fields like commentsCount, likesCount, and isLikedByCurrentUser
            $addFields: {
                commentsCount: { $size: '$comments' },
                likesCount: { $size: '$likes' },
                isLikedByCurrentUser: {
                    $in: [userId, '$likes.likedBy'],
                },
            },
        },
        {
            // Step 8: Project to exclude the likes and comments arrays
            $project: {
                likes: 0,
                comments: 0,
            },
        },
    ];

    const posts = await Post.aggregate(pipeline).exec();


    res.status(200).json(new ApiResponse(200,posts,"post fetched sucsessfully"));

})
export {
    createPost,
    getPostByUser,
    deletePost,
    likePost,
    dislikePost,
    getComments,
    addComment,
    deleteComment,
    getPostForHome
}