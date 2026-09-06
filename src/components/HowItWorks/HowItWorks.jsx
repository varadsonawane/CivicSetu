const HowItWorks = () => {
    return (
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-10">

            {/* Section Container */}
            <div className="mx-auto max-w-7xl px-4">

                {/* Heading */}
                <h2 className="mb-10 text-center text-3xl font-bold text-sky-600 sm:text-4xl">
                    How It Works
                </h2>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Step 1 */}
                    <div className="rounded-2xl bg-white p-8 text-center shadow-md">

                        <div className="mx-auto mb-3 flex h-15 w-15 items-center justify-center rounded-full bg-yellow-400 text-4xl">
                            📷
                        </div>

                        <span className="inline-block rounded-lg bg-sky-100 px-3 py-1 text-sm font-medium text-sky-600">
                            Step 1
                        </span>

                        <h3 className="mt-4 text-2xl font-semibold text-sky-600">
                            Capture Issue
                        </h3>

                        <p className="mt-3 text-base leading-7 text-sky-500">
                            Take a photo, add location, and describe the issue with voice or text.
                        </p>

                    </div>


                    {/* Step 2 */}
                    <div className="rounded-2xl bg-white p-8 text-center shadow-md">

                        <div className="mx-auto mb-3 flex h-15 w-15 items-center justify-center rounded-full bg-yellow-400 text-4xl">
                            📍
                        </div>

                        <span className="inline-block rounded-lg bg-sky-100 px-3 py-1 text-sm font-medium text-sky-600">
                            Step 2
                        </span>

                        <h3 className="mt-4 text-2xl font-semibold text-sky-600">
                            Interactive Map
                        </h3>

                        <p className="mt-3 text-base leading-7 text-sky-500">
                            Your report appears instantly on the city's interactive map for all to see.
                        </p>

                    </div>


                    {/* Step 3 */}
                    <div className="rounded-2xl bg-white p-8 text-center shadow-md">

                        <div className="mx-auto mb-3 flex h-15 w-15 items-center justify-center rounded-full bg-yellow-400 text-4xl">
                            ⚡
                        </div>

                        <span className="inline-block rounded-lg bg-sky-100 px-3 py-1 text-sm font-medium text-sky-600">
                            Step 3
                        </span>

                        <h3 className="mt-4 text-2xl font-semibold text-sky-600">
                            Auto-Routing
                        </h3>

                        <p className="mt-3 text-base leading-7 text-sky-500">
                            The issue is automatically routed to the correct department for action.
                        </p>

                    </div>


                    {/* Step 4 */}
                    <div className="rounded-2xl bg-white p-8 text-center shadow-md">

                        <div className="mx-auto mb-3 flex h-15 w-15 items-center justify-center rounded-full bg-yellow-400 text-4xl">
                            🔔
                        </div>

                        <span className="inline-block rounded-lg bg-sky-100 px-3 py-1 text-sm font-medium text-sky-600">
                            Step 4
                        </span>

                        <h3 className="mt-4 text-2xl font-semibold text-sky-600">
                            Track Progress
                        </h3>

                        <p className="mt-3 text-base leading-7 text-sky-500">
                            Receive real-time updates from submission to resolution.
                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default HowItWorks;