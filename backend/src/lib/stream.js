import {StreamChat} from "stream-chat";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("STREAM_API_KEY or STREAM_API_SECRET is miising");
}

export const chatClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async(userData)=>{
    try {
        await chatClient.upsertUser(userData)
        console.log("Successfully upserted Stream user ",userData)
    } catch (error) {
        console.error("Error upserting Stream user:",error);
    }
};
export const deleteStreamUser = async(userId)=>{
    try {
        await chatClient.deleteUser(userId)
        console.log("Successfully deleted Stream user ",userId)
    } catch (error) {
        console.error("Error deleting Stream user:",error);
    }
};