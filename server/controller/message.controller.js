import Message from "../models/Message.model.js";
import User from "../models/User.model.js";


// Get all user except logged in user
export const getUserForSideBar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUser = await User.find({ _id: { $ne: userId } }).select("-password"); //if the id is != i.e. ${ne} to the userId then filter all the userList by removing the password of the user

        // Count number of message not seen
        const unseenMessage = {

        }
        const promises = filteredUser.map(async (user) => {
            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false });
            if (messages.length > 0) {
                unseenMessage[user._id] = messages.length;

            }
        })
        await Promise.all(promises);
        res.json({ success: true, users: filteredUser, unseenMessage }); 

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });     
    }
}

// Get all message for the selected user
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id; //logged in user id
        const messages = await Message.find({
            $or: [
                { //work as OR operator
                senderId: myId,
                receiverId: selectedUserId
                },
                { //work as OR operator
                senderId: selectedUserId,
                receiverId: myId
                }
            ]
        })
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });
        res.json({ success: true, messages });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });     
    }
}


// api to mark the messages as seen using message id
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message }); 
    }
}