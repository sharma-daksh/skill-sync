import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ message: "Problem and Difficulty are required." });
    }

    // generating uniq callId for stream video
    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    // creating session in database
    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: {
          problem,
          difficulty,
          sessionId: session._id.toString(),
        },
      },
    });
    // chat messaging ft
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem}Session`,
      created_by_id: clerkId,
      members: { clerkId },
    });

    await channel.create();
    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // get sessions where the user is host/participant
    const sessions = await Session.find({
      staus: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(505).json({ message: "Internal Server Error" });
  }
}
export async function getSessionById(req, res) {
  try {
    const {id} =req.params

    const session =await Session.findById(id)
      .populate("host", "name profileImage email clerkId")
      .populate("partcipant", "name profileImage email clerkId")    

      if(!session) return res.status(404).json({message:"Session not found"});
      
      res.status(200).json({session})
    
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function joinSession(req, res) {
  try {
    const {id} =req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if(!session) return res.status(404).json({message:"Session not found"});

    // if session is already full 
    if(session.participant) return res.status(404).json({message:"Session is already Full."})
      
    session.participant=userId
    await session.save()

    const channel = chatClient.channel("messaging",session.callId)
    await channel.addMembers([addMembers])

    res.status(200).json({session})
  
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }


}
export async function endSession(req, res) {
  try {
    const {id} =req.params
    const userId =req.user._id

    const session = await Session.findById(id)

    if(!session) return res.status(404).json({message:"Session not found"});

    // only host can end a session 
    if(session.host.toString() !== userId.toString()){
      return res.status(403).json({message:"Only the host can end the Session"})
    }
    // check if session already completed
    if(session.status !== "completed"){
      return res.status(400).json({message:"Session is already completed"})
    }

    session.status= "completed"
    await session.save()
    
    // deleting stream video call
    const call = streamClient.video.call("default",session.callId);
    await call.delete({hard:true});

    // deleting stream chat channel
    const channel = chatClient.channel("messaging",session.callId);
    await channel.delete({hard:true});


    res.status(200).json({session , message:"Session  ended successfully"});
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
