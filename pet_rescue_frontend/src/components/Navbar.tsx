import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const isAdmin = user && ['Admin', 'SuperAdmin'].includes(user.role);

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-3 group">
                            <img src={logo} alt="PetRescue Logo" className="h-10 w-auto group-hover:scale-110 transition-transform" />
                            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                                PetRescue
                            </span>
                        </Link>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-10 md:flex md:space-x-4">
                            {!isAdmin && (
                                <>
                                    <Link to="/" className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-bold transition-colors rounded-xl hover:bg-blue-50">
                                        Home
                                    </Link>
                                    <Link to="/about" className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-bold transition-colors rounded-xl hover:bg-blue-50">
                                        About
                                    </Link>
                                    <Link to="/adoption" className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-bold transition-colors rounded-xl hover:bg-blue-50">
                                        Pet Adoption
                                    </Link>
                                    <Link to="/rescue" className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-bold transition-colors rounded-xl hover:bg-blue-50">
                                        Rescue (Lost/Found)
                                    </Link>
                                    {user && (
                                        <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-bold transition-colors rounded-xl hover:bg-blue-50">
                                            Dashboard
                                        </Link>
                                    )}
                                </>
                            )}
                            {isAdmin && (
                                <Link to="/admin-dashboard" className="text-blue-600 bg-blue-50 px-4 py-2 text-sm font-bold transition-colors rounded-xl">
                                    Admin Console
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {user ? (
                            <>
                                {!isAdmin && (
                                    <Link
                                        to="/profile"
                                        className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-bold transition-colors rounded-xl hover:bg-blue-50"
                                    >
                                        Profile
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-gray-200 active:scale-95"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-bold transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
