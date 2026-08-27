import { requireAuth, clerkClient } from '@clerk/express'
import User from '../models/User.js';

export const protectRoute =[
    requireAuth(),
    async (req,res, next)=>{
        try{
            const clerkId = req.auth().userId;
            if(!clerkId) return res.status(401).json({message: "Unauthorized-Invalid token "});

            //finde user by clerkId in datbase
            let user = await User.findOne({clerkId});

            if(!user){
                // Self-heal: the Inngest "clerk/user.created" sync may not have run yet
                // (race condition right after signup) or may have failed permanently
                // (e.g. a duplicate-key error against an old doc with the same email).
                // Pull the source of truth from Clerk and upsert instead of 404ing.
                const clerkUser = await clerkClient.users.getUser(clerkId);

                if(!clerkUser) return res.status(404).json({message: "User not found"});

                const email = clerkUser.emailAddresses?.[0]?.emailAddress;

                user = await User.findOneAndUpdate(
                    { $or: [{ clerkId }, ...(email ? [{ email }] : [])] },
                    {
                        clerkId,
                        email,
                        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
                        profileImage: clerkUser.imageUrl || "",
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            }

            req.user=user;//attch user to req
            next();
        }catch(error){
            console.error("Error in protectRoute middleware",error);
            res.status(500).json({message:"Internal server error"});
        }
    },
];