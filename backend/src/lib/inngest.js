import {Inngest} from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";
 
export const inngest = new Inngest({ id: "SkillSync" });

const syncUser=inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async ({event})=>{
        await connectDB();

        const {id,email_addresses,first_name,last_name,profile_image_url}= event.data;
        const email = email_addresses[0]?.email_address;
        const newUser ={
            clerkId:id,
            email,
            name:`${first_name || ""} ${last_name || ""}`,
            profileImage: profile_image_url,
        }
        // Upsert (matched on clerkId OR email) instead of create: a plain create()
        // throws a duplicate-key error and permanently fails this run if a stale
        // doc with the same email already exists under a different clerkId,
        // leaving the new user with no synced Mongo record at all.
        await User.findOneAndUpdate(
            { $or: [{ clerkId: id }, ...(email ? [{ email }] : [])] },
            newUser,
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
        await upsertStreamUser({
            id:newUser.clerkId.toString(),
            name:newUser.name,
            image:newUser.profileImage,
        })
    }
)
const deleteUserFromDB=inngest.createFunction(
    {id:"delete-user-from-db"},
    {event:"clerk/user.deleted"},
    async ({event})=>{
        await connectDB();

        const {id}= event.data;
        
        await User.deleteOne({clerkId:id})

        await deleteStreamUser(id.toString())
    }
)
export const functions = [syncUser,deleteUserFromDB];