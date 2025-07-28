import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);


    // function to get all user for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get(`/api/messages/users`);
            if (data.success) {
                setUser(data.user);
                setUnseenMessages(data.unseenMessages);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to get messages for selected user 
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to send message to selected user 
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessage) => [...prevMessage, data.newMessage] )
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to sunscribe to messages to selected users 
    const subscribeToMessages = async () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages) => {
                    [...prevMessages, newMessage]
                });
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId]:
                        prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // function to unsubcribe messages
    const unSubscirbeMessage = async () => {
        if (socket) socket.off("newMessage");

    }

    useEffect(() => {
        subscribeToMessages();
        return () => unSubscirbeMessage();
    }, [socket, selectedUser])


    const value = {
        messages,
        user,
        selectedUser,
        unseenMessages,
        getUsers,
        getMessages,
        getMessages,
        sendMessage,
        setMessages,
        setSelectedUser,
        setUnseenMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}