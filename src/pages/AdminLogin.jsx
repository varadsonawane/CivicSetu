import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeftIcon } from "lucide-react";
import DotField from "../components/DotField/DotField";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            // Make sure only admins can continue
            if (data.user.role !== "admin") {
                alert("Admin access required.");
                return;
            }

            login(data.token, data.user);

            navigate("/admin/dashboard", { replace: true });

        } catch (error) {
            console.error("Admin login error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="relative min-h-screen">

            {/* React Bits Dot Field Background */}
            <div className="fixed inset-0 z-0">
                <DotField
                    dotRadius={1.5}
                    dotSpacing={14}
                    bulgeStrength={67}
                    glowRadius={0}
                    sparkle={false}
                    waveAmplitude={0}
                    cursorRadius={500}
                    cursorForce={0.1}
                    bulgeOnly
                    gradientFrom="#A855F7"
                    gradientTo="#B497CF"
                    glowColor="#7A1F5C"
                />
            </div>

            {/* Admin Login UI */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">

                {/* Admin Login Box */}
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

                    <Link
                        to="/"
                        className="mb-6 inline-flex items-center gap-2 text-lg font-medium text-gray-900 hover:text-sky-700"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Admin Login
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Login to manage CivicSetu reports.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                    >

                        {/* Admin Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Admin Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="admin@civicsetu.com"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-sky-500"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter admin password"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-sky-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-sky-600 py-3 font-semibold text-white transition hover:bg-sky-700"
                        >
                            Login as Admin
                        </button>

                    </form>

                </div>
            </div>

        </div>
    );
};

export default AdminLogin;