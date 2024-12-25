import { asyncHandler } from "../utils/asycHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    res.status(500).json({
        message: "shivam is good boy"
    })
})
 
export {
    registerUser,
}