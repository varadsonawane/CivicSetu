import React, { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full border-b border-gray-200 bg-white">

            {/* Main Navbar */}
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-xl">

                {/* Logo */}
                <div className="text-3xl font-bold text-blue-600">
                    CivicSetu
                </div>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    <a href="#" className="text-gray-700 hover:text-blue-600">
                        Home
                    </a>

                    <a href="#" className="text-gray-700 hover:text-blue-600">
                        How It Works
                    </a>

                    <a href="#" className="text-gray-700 hover:text-blue-600">
                        About
                    </a>

                    <a href="#" className="text-gray-700 hover:text-blue-600">
                        Login
                    </a>

                    <a href="#" className="text-gray-700 hover:text-blue-600">
                        Signup
                    </a>
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

                            <div className="text-2xl font-bold text-blue-600">
                                CivicSetu
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-3xl"
                            >
                                ✕
                            </button>

                        </div>

                        {/* Drawer Navigation */}
                        <div className="flex flex-col gap-7 border-t border-gray-200 px-8 py-8">

                            <a href="#" className="text-xl text-gray-700">
                                Home
                            </a>

                            <a href="#" className="text-xl text-gray-700">
                                How It Works
                            </a>

                            <a href="#" className="text-xl text-gray-700">
                                About
                            </a>

                            <a href="#" className="text-xl text-gray-700">
                                Login
                            </a>

                            <a
                                href="#"
                                className="rounded-lg bg-yellow-400 px-5 py-3 text-center text-lg font-semibold text-black"
                            >
                                Signup
                            </a>

                        </div>

                    </div>
                </>
            )}

        </nav>
    );
};

export default Navbar;