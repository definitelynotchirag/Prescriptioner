import axios from "axios";
import { Coffee, Edit2, Moon, PlusCircle, Sun, Trash2, User, Users, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const UserDashboard = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({
        name: "",
        breakfastTime: "",
        lunchTime: "",
        dinnerTime: "",
    });

    const fetchUsers = useCallback(async () => {
        if (!user?._id) return;

        try {
            // console.log(user._id, "fdsfdsgdfsfd");
            const response = await axios.post(`${API_BASE_URL}/api/users`, { rootUserId: user._id });
            // console.log(response, "asdasdasd");
            const usersArray = Array.isArray(response.data.users) ? response.data.users : [response.data.users];
            setUsers(usersArray);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }, [user?._id]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // console.log(user);
    const rootUserId = user?._id;

    const handleInputChange = e => {
        const { name, value } = e.target;
        setNewUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editingUser) {
                await axios.put(`${API_BASE_URL}/api/users/${editingUser._id}`, newUser);
            } else {
                // console.log("newUser", newUser, rootUserId);

                await axios.post(`${API_BASE_URL}/api/users/create`, { newUser, rootUserId });
            }
            fetchUsers();
            setShowForm(false);
            setEditingUser(null);
            setNewUser({
                name: "",
                breakfastTime: "",
                lunchTime: "",
                dinnerTime: "",
            });
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    const handleEdit = user => {
        setEditingUser(user);
        setNewUser(user);
        setShowForm(true);
    };

    const handleDelete = async userId => {
        try {
            await axios.delete(`${API_BASE_URL}/api/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#00030b] p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-xl mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-yellow-500 rounded-xl">
                            <Users className="w-8 h-8 text-gray-900" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-yellow-400">Family Members</h1>
                            <p className="text-gray-400 mt-1">Manage medication schedules for your family</p>
                        </div>
                    </div>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {users &&
                        users.map(userItem => (
                            <Link key={userItem._id} to={`/${userItem._id}`} className="group">
                                <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-yellow-500/30 relative overflow-hidden">
                                    {/* Card Background Overlay */}
                                    <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Action Buttons */}
                                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                        <button
                                            onClick={e => {
                                                e.preventDefault();
                                                handleEdit(userItem);
                                            }}
                                            className="bg-blue-500/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-lg"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={e => {
                                                e.preventDefault();
                                                handleDelete(userItem._id);
                                            }}
                                            className="bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-center mb-4">
                                            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                                                <User className="w-8 h-8 text-gray-900" />
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-semibold text-gray-100 text-center mb-3 group-hover:text-yellow-400 transition-colors duration-200">
                                            {userItem.name}
                                        </h3>

                                        {/* Meal Times */}
                                        <div className="space-y-2">
                                            {userItem.breakfastTime && (
                                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                                    <Coffee className="w-4 h-4 text-yellow-400" />
                                                    <span>Breakfast: {userItem.breakfastTime}</span>
                                                </div>
                                            )}
                                            {userItem.lunchTime && (
                                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                                    <Sun className="w-4 h-4 text-yellow-400" />
                                                    <span>Lunch: {userItem.lunchTime}</span>
                                                </div>
                                            )}
                                            {userItem.dinnerTime && (
                                                <div className="flex items-center space-x-2 text-sm text-gray-400">
                                                    <Moon className="w-4 h-4 text-yellow-400" />
                                                    <span>Dinner: {userItem.dinnerTime}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                </div>

                {/* Empty State */}
                {(!users || users.length === 0) && (
                    <div className="text-center py-16">
                        <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-8 border border-gray-700/50 max-w-md mx-auto">
                            <div className="bg-gray-700/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                <Users className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">No family members added</h3>
                            <p className="text-gray-400 mb-6">
                                Add your first family member to start managing medications
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                Add Family Member
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Add Button */}
            <div className="fixed bottom-8 right-8">
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingUser(null);
                        setNewUser({
                            name: "",
                            breakfastTime: "",
                            lunchTime: "",
                            dinnerTime: "",
                        });
                    }}
                    className="bg-yellow-500 text-gray-900 rounded-full p-4 shadow-xl hover:shadow-2xl hover:bg-yellow-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-500/30"
                >
                    {showForm ? <X className="h-8 w-8" /> : <PlusCircle className="h-8 w-8" />}
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/50 w-full max-w-md">
                        <div className="p-6">
                            {/* Form Header */}
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-yellow-500 rounded-lg">
                                    <User className="w-6 h-6 text-gray-900" />
                                </div>
                                <h2 className="text-2xl font-bold text-yellow-400">
                                    {editingUser ? "Edit Family Member" : "Add Family Member"}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={newUser.name}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Coffee className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="time"
                                        name="breakfastTime"
                                        placeholder="Breakfast Time"
                                        value={newUser.breakfastTime}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200"
                                    />
                                    <label className="absolute -top-2 left-3 px-1 bg-gray-800 text-xs text-gray-400">
                                        Breakfast Time
                                    </label>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Sun className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="time"
                                        name="lunchTime"
                                        placeholder="Lunch Time"
                                        value={newUser.lunchTime}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200"
                                    />
                                    <label className="absolute -top-2 left-3 px-1 bg-gray-800 text-xs text-gray-400">
                                        Lunch Time
                                    </label>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Moon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="time"
                                        name="dinnerTime"
                                        placeholder="Dinner Time"
                                        value={newUser.dinnerTime}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200"
                                    />
                                    <label className="absolute -top-2 left-3 px-1 bg-gray-800 text-xs text-gray-400">
                                        Dinner Time
                                    </label>
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 bg-gray-700 text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-600 transition-colors duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-yellow-500 text-gray-900 py-3 px-4 rounded-xl hover:bg-yellow-600 transition-all duration-200 font-semibold transform hover:scale-[1.02] shadow-lg"
                                    >
                                        {editingUser ? "Update" : "Add"} Member
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
