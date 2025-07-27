import axios, { toFormData } from 'axios';
import { createContext, useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BAKCEND_URL;
axios.defaults.baseURL = backendUrl;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUser, setSetOnlineUser] = useState([]);
    const [socket, setSocket] = useState(null);

    // Check if the user is authenticated if so, set the user data and connect to the socket
    const checkAuth = async() => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Login function to handle user authentication and socket connection
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            } else { 
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    // logout function to handle the user logout and socket disconnection
    const logout = async () => {
        localStorage.removeItem('token');
        setToken(null);
        setAuthUser(null);
        setSetOnlineUser([]);
        axios.defaults.headers.common["token"] = null;
        toast.success('logged out successfully');
        socket.disconnect();
    }

    // update profile function to handle user profile updates
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put(`/api/auth/update-profile`, body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Connect socket function to handle socket connection and online users updates
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        })
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on('getOnlineUsers', (userId) => {
            setSetOnlineUser(userId);
        });
    }

    useEffect(() => {
        if (token && !authUser) { // Only call checkAuth if token exists and authUser is not set
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }
    }, [token, authUser]) // Add authUser to dependency array
    
    const value = {
        axios,
        authUser,
        onlineUser,
        socket,
        login,
        logout,
        updateProfile,
    }
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}