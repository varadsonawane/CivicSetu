import {
    Camera,
    MapPin,
    Bell,
    BarChart3,
    LayoutDashboard,
    Map,
    Zap,
    ShieldCheck,
} from "lucide-react";


const CitizenMunicipal = () => {
    return (
        <section className="py-16 sm:py-20">

            {/* Main Container */}
            <div className="mx-auto max-w-7xl px-4">

                {/* =====================================================
                    SECTION HEADING
                ===================================================== */}

                <h2 className="mx-auto mb-4 w-fit rounded-xl border-2 border-gray-400/40 bg-white/30 px-8 py-2 text-center text-3xl font-bold text-sky-600 backdrop-blur-sm sm:text-4xl">
                    Built for Everyone
                </h2>

                <p className="mx-auto mb-12 max-w-2xl text-center text-base leading-7 text-sky-500 sm:text-lg">
                    CivicSetu connects citizens and municipal teams on one
                    simple platform to make civic issue reporting faster,
                    transparent, and easier to manage.
                </p>


                {/* =====================================================
                    TWO MAIN CARDS
                ===================================================== */}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">


                    {/* =================================================
                        FOR CITIZENS
                    ================================================= */}

                    <div className="rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-md backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">

                        {/* Header */}
                        <div className="mb-8 flex items-center gap-4">

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                                <Camera size={28} strokeWidth={2} />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-sky-600">
                                    For Citizens
                                </h3>

                                <p className="mt-1 text-sm text-sky-400">
                                    Report problems and stay informed.
                                </p>
                            </div>

                        </div>


                        {/* Features */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">


                            {/* Feature 1 */}
                            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">

                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                    <Camera size={21} />
                                </div>

                                <h4 className="font-semibold text-gray-800">
                                    Easy Reporting
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Report civic problems with a photo,
                                    description, and location.
                                </p>

                            </div>


                            {/* Feature 2 */}
                            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">

                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                    <MapPin size={21} />
                                </div>

                                <h4 className="font-semibold text-gray-800">
                                    Location Based
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Add the issue location so it can be
                                    identified and addressed accurately.
                                </p>

                            </div>


                            {/* Feature 3 */}
                            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">

                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                    <Bell size={21} />
                                </div>

                                <h4 className="font-semibold text-gray-800">
                                    Track Progress
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Follow your report from Pending to
                                    In Progress and finally Resolved.
                                </p>

                            </div>


                            {/* Feature 4 */}
                            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">

                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                    <BarChart3 size={21} />
                                </div>

                                <h4 className="font-semibold text-gray-800">
                                    View Your Reports
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Access your submitted reports and
                                    monitor their current status.
                                </p>

                            </div>

                        </div>

                    </div>



                    {/* =================================================
                        FOR MUNICIPAL STAFF
                    ================================================= */}

                    <div className="rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-md backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8">

                        {/* Header */}
                        <div className="mb-8 flex items-center gap-4">

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                                <LayoutDashboard size={28} strokeWidth={2} />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-sky-600">
                                    For Municipal Staff
                                </h3>

                                <p className="mt-1 text-sm text-sky-400">
                                    Manage and monitor civic issues efficiently.
                                </p>
                            </div>

                        </div>


                        {/* Features */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">


                            {/* Feature 1 */}
                            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">

                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                    <LayoutDashboard size={21} />
                                </div>

                                <h4 className="font-semibold text-gray-800">
                                    Centralized Dashboard
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    View and manage reported civic issues
                                    from a single dashboard.
                                </p>

                            </div>


                            {/* Feature 2 */}
                            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">

                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                    <Map size={21} />
                                </div>

                                <h4 className="font-semibold text-gray-800">
                                    Map-Based Monitoring
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    View reported issues geographically and
                                    understand where problems are occurring.
                                </p>

                            </div>


                            {/* Feature 3 */}
                            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">

                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                    <Zap size={21} />
                                </div>

                                <h4 className="font-semibold text-gray-800">
                                    Faster Processing
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Update issue statuses and keep citizens
                                    informed about progress.
                                </p>

                            </div>


                            {/* Feature 4 */}
                            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">

                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                    <ShieldCheck size={21} />
                                </div>

                                <h4 className="font-semibold text-gray-800">
                                    Controlled Access
                                </h4>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Admin authentication keeps municipal
                                    management features protected.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};


export default CitizenMunicipal;