import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    return (
        <nav className="w-full border-b border-gray-200 bg-white">

            {/* Main Navbar */}
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-xl">

                {/* Logo */}
                <Link to="/" className="text-3xl font-bold text-blue-600">
                    CivicSetu
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">

                    <Link
                        to="/"
                        className="text-gray-700 hover:text-blue-600"
                    >
                        Home
                    </Link>

                    <a
                        href="#how-it-works"
                        className="text-gray-700 hover:text-blue-600"
                    >
                        How It Works
                    </a>

                    <a
                        href="#about"
                        className="text-gray-700 hover:text-blue-600"
                    >
                        About
                    </a>

                    {user ? (
                        <>
                            <a
                                href="#dashboard"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Dashboard
                            </a>

                            <button
                                onClick={handleLogout}
                                className="text-gray-700 hover:text-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="rounded-lg bg-yellow-400 px-5 py-2 font-semibold text-black hover:bg-yellow-500"
                            >
                                Signup
                            </Link>
                        </>
                    )}

                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-2xl md:hidden"
                >
                    {isOpen ? "✕" : "☰"}
                </button>

            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    />

                    {/* Drawer */}
                    <div className="fixed left-0 top-0 z-50 h-screen w-[80%] bg-white md:hidden">

                        {/* Drawer Header */}
                        <div className="flex items-center justify-between px-6 py-6">

                            <Link
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className="text-2xl font-bold text-blue-600"
                            >
                                CivicSetu
                            </Link>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-3xl"
                            >
                                ✕
                            </button>

                        </div>

                        {/* Drawer Navigation */}
                        <div className="flex flex-col gap-7 border-t border-gray-200 px-8 py-8">

                            <Link
                                to="/"
                                onClick={() => setIsOpen(false)}
                                className="text-xl text-gray-700"
                            >
                                Home
                            </Link>

                            <a
                                href="#how-it-works"
                                onClick={() => setIsOpen(false)}
                                className="text-xl text-gray-700"
                            >
                                How It Works
                            </a>

                            <a
                                href="#about"
                                onClick={() => setIsOpen(false)}
                                className="text-xl text-gray-700"
                            >
                                About
                            </a>

                            {user ? (
                                <>
                                    <a
                                    href="#dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="text-xl text-gray-700"
                                    >
                                        Dashboard
                                    </a>

                                    <button
                                        onClick={handleLogout}
                                        className="rounded-lg bg-red-50 px-5 py-3 text-left text-xl font-semibold text-red-600"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="text-xl text-gray-700"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/signup"
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-lg bg-yellow-400 px-5 py-3 text-center text-lg font-semibold text-black"
                                    >
                                        Signup
                                    </Link>
                                </>
                            )}

                        </div>

                    </div>
                </>
            )}

        </nav>
    );
};

export default Navbar;