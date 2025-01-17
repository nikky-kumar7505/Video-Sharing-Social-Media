import { v2 as cloudinary  } from "cloudinary";
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});
 


const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null

        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        //file has uploaded succesfully 
        //console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath)
        return response ;
        
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove
        return null ;
    } 
}


export {uploadOnCloudinary}