import {
  Building2,
  Code2,
  BriefcaseBusiness,
  MapPinned,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";


const About = () => {
    return (
        <section
            id="about"
            className="py-16 sm:py-20 lg:py-24"
        >

            <div className="mx-auto max-w-7xl px-4">

                {/* ==============================
                    HEADING
                ============================== */}

                <h2 className="mx-auto mb-4 w-fit rounded-xl border-2 border-gray-400/40 bg-white/30 px-8 py-2 text-center text-3xl font-bold text-sky-600 backdrop-blur-sm sm:text-4xl">
                    About CivicSetu
                </h2>

                <p className="mx-auto mb-12 max-w-2xl text-center text-base leading-7 text-sky-500 sm:text-lg">
                    A smarter way to connect citizens with their cities.
                </p>


                {/* ==============================
                    ABOUT CIVICSETU
                ============================== */}

                <div className="mb-10 rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-md sm:p-10">

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

                        {/* LEFT */}
                        <div>

                            <div className="mb-5 flex items-center gap-4">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                                    <Building2 size={30} />
                                </div>

                                <h3 className="text-2xl font-bold text-sky-600 sm:text-3xl">
                                    What is CivicSetu?
                                </h3>

                            </div>


                            <p className="text-base leading-7 text-gray-600">
                                CivicSetu is a citizen-focused civic issue
                                reporting platform designed to make it easier
                                for people to report problems in their
                                surroundings and track their progress.
                            </p>


                            <p className="mt-4 text-base leading-7 text-gray-600">
                                Citizens can submit an issue with a description,
                                location, and photo. Municipal staff can then
                                manage these reports, update their status, and
                                monitor issues through a centralized dashboard.
                            </p>


                            <p className="mt-4 text-base leading-7 text-gray-600">
                                The goal is simple: make civic reporting more
                                accessible, transparent, and organized.
                            </p>

                        </div>


                        {/* RIGHT */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            {/* Interactive Maps */}
                            <div className="rounded-2xl bg-sky-50 p-5">

                                <MapPinned
                                    size={25}
                                    className="mb-3 text-sky-600"
                                />

                                <h4 className="font-semibold text-gray-800">
                                    Interactive Maps
                                </h4>

                                <p className="mt-1 text-sm text-gray-500">
                                    Visualize civic issues geographically.
                                </p>

                            </div>


                            {/* Live Updates */}
                            <div className="rounded-2xl bg-sky-50 p-5">

                                <Zap
                                    size={25}
                                    className="mb-3 text-sky-600"
                                />

                                <h4 className="font-semibold text-gray-800">
                                    Live Updates
                                </h4>

                                <p className="mt-1 text-sm text-gray-500">
                                    Track issue status as it changes.
                                </p>

                            </div>


                            {/* Secure Access */}
                            <div className="rounded-2xl bg-sky-50 p-5">

                                <ShieldCheck
                                    size={25}
                                    className="mb-3 text-sky-600"
                                />

                                <h4 className="font-semibold text-gray-800">
                                    Secure Access
                                </h4>

                                <p className="mt-1 text-sm text-gray-500">
                                    Protected citizen and admin access.
                                </p>

                            </div>


                            {/* Citizen Focused */}
                            <div className="rounded-2xl bg-sky-50 p-5">

                                <Users
                                    size={25}
                                    className="mb-3 text-sky-600"
                                />

                                <h4 className="font-semibold text-gray-800">
                                    Citizen Focused
                                </h4>

                                <p className="mt-1 text-sm text-gray-500">
                                    Built around real civic reporting needs.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==============================
                    ABOUT DEVELOPER
                ============================== */}

                <div className="rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-md sm:p-10">

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

                        {/* DEVELOPER */}
                        <div>

                            <div className="mb-5 flex items-center gap-4">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                                    <Code2 size={30} />
                                </div>

                                <div>

                                    <p className="text-sm font-medium text-sky-400">
                                        The Developer
                                    </p>

                                    <h3 className="text-2xl font-bold text-sky-600 sm:text-3xl">
                                        Hi, I'm Varad 👋
                                    </h3>

                                </div>

                            </div>


                            <p className="text-base leading-7 text-gray-600">
                                I'm a Computer Science and Engineering student
                                interested in building practical software
                                solutions and learning through real-world
                                projects.
                            </p>


                            <p className="mt-4 text-base leading-7 text-gray-600">
                                CivicSetu is a project I'm building to explore
                                full-stack development, combining modern
                                frontend technologies with backend APIs,
                                databases, authentication, maps, and AI.
                            </p>


                            {/* SOCIAL LINKS */}
                            <div className="mt-7 flex flex-wrap gap-3">

                                <a
                                    href="https://github.com/varadsonawane"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-medium text-gray-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:text-sky-600 hover:shadow-md"
                                >
                                    <Code2 size={20} />
                                        GitHub
                                </a>


                                <a
                                    href="https://www.linkedin.com/in/varadsonawane/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-medium text-gray-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:text-sky-600 hover:shadow-md"
                                >
                                    <BriefcaseBusiness size={20} />
                                        LinkedIn
                                </a>

                            </div>

                        </div>


                        {/* TECH STACK */}
                        <div>

                            <h4 className="mb-5 text-xl font-bold text-sky-600">
                                Built With
                            </h4>


                            <div className="flex flex-wrap gap-3">

                                {[
                                    "React",
                                    "JavaScript",
                                    "Tailwind CSS",
                                    "Node.js",
                                    "Express.js",
                                    "PostgreSQL",
                                    "JWT",
                                    "Leaflet",
                                    "AI",
                                ].map((technology) => (

                                    <span
                                        key={technology}
                                        className="rounded-xl bg-sky-50 px-4 py-2 text-sm font-medium text-sky-600"
                                    >
                                        {technology}
                                    </span>

                                ))}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};


export default About;