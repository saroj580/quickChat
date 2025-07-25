import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import assets from "../assets/assets";
const ProfilePage = () => {
    
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const [name, setName] = useState("Martin Jhonson");
    const [bio, setBio] = useState("Hi EveryOne, I'm using QuickChat.");

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate('/');
    }

    return (
        <div className="min-h-screen bg-no-repeat bg-cover flex items-center justify-center">
            <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg ">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
                    <h3 className="text-lg">Profile Details.</h3>
                    <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
                        <input
                            onChange={(e) =>
                                setSelectedImage(e.target.files[0])
                            }
                            type="file" id="avatar" accept=".jpg, .jpeg, .png" hidden
                        />
                        <img
                            src={selectedImage ?
                                URL.createObjectURL(selectedImage) :
                                assets.avatar_icon} alt=""
                            className={`w-12 h-12 ${selectedImage && 'rounded-full'}`}
                        />
                        upload profile image
                    </label>
                    <input
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        value={name}
                        type="text"
                        required
                        placeholder="Your name"
                        className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <textarea
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                        placeholder="write profile bio"
                        required
                        className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                        rows={4}
                    />
                    <button
                        type="submit"
                        className="p-2 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-full text-lg cursor-pointer">Save</button>
                </form>
                <img src={assets.logo_icon} className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10" alt="" />
            </div>
        </div>
    )
}

export default ProfilePage
