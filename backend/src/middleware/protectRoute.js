import { requireAuth } from '@clerk/express'
import User from '../models/User.js';

export const protectRoute =[
    requireAuth(),
    async (req,res, next)=>{
        try{
            const clerkId = req.auth().userId;
            if(!clerkId) return res.status(401).json({message: "Unauthorized-Invalid token "});

            //finde user by clerkId in datbase
            const user = await User.findOne({clerkId});
            if(!user) return res.status(404).json({message: "User not found"});


            req.user=user;//attch user to req
            next();
        }catch(error){
            console.error("Error in protectRoute middleware",error);
            resizeBy.status(500).json({message:"Internal server error"});
        }
    },
];