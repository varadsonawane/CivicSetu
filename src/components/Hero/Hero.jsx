import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section id="home" className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:pt-20 sm:pb-8 lg:pt-20  lg:pb-10">
            <div className="flex flex-col items-center justify-center p-10">
                <div className="text-center space-y-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-sky-600 text-balance" >Report Civic Issues Instantly. Empower Your City.</h1>

                    <p className="text-lg md:text-xl text-sky-500 max-w-3xl mx-auto text-pretty">A mobile-first civic engagement platform where citizens can capture and report local issues in real-time, while municipal staff track, route, and resolve them efficiently.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/report"
                            className="rounded-lg bg-yellow-400 px-8 py-3 font-semibold text-black hover:bg-yellow-500"
                        >
                            Report an Issue
                        </Link>

                        <Link
                            to="/admin/login"
                            className="rounded-lg border border-sky-500 bg-transparent px-8 py-3 text-sky-600 hover:bg-sky-50"
                        >
                            
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero