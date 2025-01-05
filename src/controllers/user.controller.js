import { asyncHandler } from "../utils/asycHandler.js";
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { application } from "express";
import ApiResponse from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, username, password} = req.body
    
    if(
        [fullName, email, username, password].some( (field) => field?.trim() === "" )
    ){
        throw new ApiError(400, "All fields are requied")
    };

   const existedUser =  User.findOne({
    $or : [{username}, {email}]
   })

   if(existedUser){
    throw new ApiError(409, "User with email or username already exist")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path
   const coverImageLocalPath = req.files?.coverImage[0]?.path

   if(!avatarLocalPath){ 
    throw new ApiError(400, "Avatar File is required"); 
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
    throw new ApiError(400, "Avatar File is required");
   }
   
   const user = User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLoweCase()

   })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )



   
})
 
export { 
    registerUser,
}   