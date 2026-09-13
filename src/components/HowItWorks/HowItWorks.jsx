import {
    Camera,
    MapPinned,
    Zap,
    BellRing,
} from "lucide-react";


const HowItWorks = () => {
    return (
        <section
            id="how-it-works"
            className="py-16 sm:py-20 lg:py-10"
        >

            {/* Section Container */}
            <div className="mx-auto max-w-7xl px-4">

                {/* Heading */}
                <h2 className="mb-10 mx-auto w-fit rounded-xl border-2 border-gray-400/40 bg-white/30 px-8 py-2 text-center text-3xl font-bold text-sky-600 backdrop-blur-sm sm:text-4xl">
                    How It Works
                </h2>


                {/* Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">


                    {/* =================================================
                        STEP 1
                    ================================================= */}

                    <div className="rounded-2xl bg-white p-8 text-center shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                        {/* Icon */}
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                            <Camera size={32} strokeWidth={2} />
                        </div>


                        {/* Step */}
                        <span className="inline-block rounded-lg bg-yellow-300 px-3 py-1 text-sm font-medium text-sky-600">
                            Step 1
                        </span>


                        {/* Title */}
                        <h3 className="mt-4 text-2xl font-semibold text-sky-600">
                            Capture Issue
                        </h3>


                        {/* Description */}
                        <p className="mt-3 text-base leading-7 text-sky-500">
                            Take a photo, add location, and describe the issue with voice or text.
                        </p>

                    </div>



                    {/* =================================================
                        STEP 2
                    ================================================= */}

                    <div className="rounded-2xl bg-white p-8 text-center shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                        {/* Icon */}
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                            <MapPinned size={32} strokeWidth={2} />
                        </div>


                        {/* Step */}
                        <span className="inline-block rounded-lg bg-yellow-300 px-3 py-1 text-sm font-medium text-sky-600">
                            Step 2
                        </span>


                        {/* Title */}
                        <h3 className="mt-4 text-2xl font-semibold text-sky-600">
                            Interactive Map
                        </h3>


                        {/* Description */}
                        <p className="mt-3 text-base leading-7 text-sky-500">
                            Your report appears instantly on the city's interactive map for all to see.
                        </p>

                    </div>



                    {/* =================================================
                        STEP 3
                    ================================================= */}

                    <div className="rounded-2xl bg-white p-8 text-center shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                        {/* Icon */}
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                            <Zap size={32} strokeWidth={2} />
                        </div>


                        {/* Step */}
                        <span className="inline-block rounded-lg bg-yellow-300 px-3 py-1 text-sm font-medium text-sky-600">
                            Step 3
                        </span>


                        {/* Title */}
                        <h3 className="mt-4 text-2xl font-semibold text-sky-600">
                            Auto-Routing
                        </h3>


                        {/* Description */}
                        <p className="mt-3 text-base leading-7 text-sky-500">
                            The issue is automatically routed to the correct department for action.
                        </p>

                    </div>



                    {/* =================================================
                        STEP 4
                    ================================================= */}

                    <div className="rounded-2xl bg-white p-8 text-center shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                        {/* Icon */}
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                            <BellRing size={32} strokeWidth={2} />
                        </div>


                        {/* Step */}
                        <span className="inline-block rounded-lg bg-yellow-300 px-3 py-1 text-sm font-medium text-sky-600">
                            Step 4
                        </span>


                        {/* Title */}
                        <h3 className="mt-4 text-2xl font-semibold text-sky-600">
                            Track Progress
                        </h3>


                        {/* Description */}
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