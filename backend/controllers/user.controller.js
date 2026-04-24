import {getprofile} from '../models/user.model.js'
import {updateProfile} from '../models/user.model.js'
export const profile = async (req, res)=>{

    const {id} = req.params
    console.log(id)
   const user = await getprofile(id)
   const {name ,email} = user;
   console.log("this is user::::",user)
   res.json({
    "user":name,
    "email":email
   })
}

export const update = async (req, res) => {
    const { id } = req.params;
    const incomingData = req.body; // e.g., { email: "new@me.com" }

    // 1. Get current user from DB
    const currentUser = await getprofile(id); 
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // 2. Merge them in one line
    // Any field in incomingData will overwrite the one in currentUser
    const finalData = { ...currentUser, ...incomingData };
     await updateProfile(id,finalData)

     res.json({ message: "Profile updated!", user: finalData });
}