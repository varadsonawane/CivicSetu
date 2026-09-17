import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import { API_URL } from "../../config";
import {
    MapPin,
    CalendarDays,
} from "lucide-react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";


// =====================================================
// STATUS MARKER ICON
// =====================================================

const createStatusIcon = (status) => {

    const normalizedStatus = String(status || "")
        .trim()
        .toLowerCase();

    let color = "#ef4444";
    let symbol = "!";

    if (normalizedStatus === "in progress") {
        color = "#f59e0b";
        symbol = "⚙";
    }

    if (normalizedStatus === "resolved") {
        color = "#16a34a";
        symbol = "✓";
    }

    return L.divIcon({
        className: "custom-status-marker",

        html: `
            <div
                style="
                    width: 42px;
                    height: 42px;
                    background: ${color};
                    border-radius: 50% 50% 50% 0;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                    border: 3px solid white;
                "
            >
                <span
                    style="
                        color: white;
                        font-size: 20px;
                        font-weight: bold;
                        transform: rotate(45deg);
                    "
                >
                    ${symbol}
                </span>
            </div>
        `,

        iconSize: [42, 42],
        iconAnchor: [21, 42],
        popupAnchor: [0, -42],
    });
};


// =====================================================
// LIVE MAP COMPONENT
// =====================================================

const LiveMap = ({ reports = [] }) => {

    // Normalize status so different capitalization
    // doesn't cause counting problems.

    const pendingReports = reports.filter(
        (report) =>
            String(report.status || "")
                .trim()
                .toLowerCase() === "pending"
    ).length;


    const inProgressReports = reports.filter(
        (report) =>
            String(report.status || "")
                .trim()
                .toLowerCase() === "in progress"
    ).length;


    const resolvedReports = reports.filter(
        (report) =>
            String(report.status || "")
                .trim()
                .toLowerCase() === "resolved"
    ).length;


    return (
        <section className="mx-auto max-w-7xl px-4 pt-0 py-12 sm:py-16">

            {/* =================================================
                MAP CARD
            ================================================= */}

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                {/* =================================================
                    HEADING
                ================================================= */}

                <div className="mb-4 flex items-center gap-2">

                    <span className="text-2xl">
                        📍
                    </span>

                    <h2 className="text-xl font-semibold text-sky-600 sm:text-2xl">
                        Live Interactive City Map - India
                    </h2>

                </div>


                {/* =================================================
                    MAP
                ================================================= */}

                <div className="relative h-[400px] overflow-hidden rounded-xl border border-sky-200 sm:h-[450px] lg:h-[500px]">

                    <MapContainer
                        center={[18.5204, 73.8567]}
                        zoom={9}
                        scrollWheelZoom={true}
                        className="h-full w-full"
                    >

                        {/* OpenStreetMap */}
                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />


                        {/* =================================================
                            REPORT MARKERS
                        ================================================= */}

                        {reports.map((report) => {

                            // Don't display reports without coordinates
                            if (
                                report.latitude === null ||
                                report.latitude === undefined ||
                                report.longitude === null ||
                                report.longitude === undefined
                            ) {
                                return null;
                            }


                            return (
                                <Marker
                                    key={report.id}
                                    position={[
                                        Number(report.latitude),
                                        Number(report.longitude),
                                    ]}
                                    icon={createStatusIcon(report.status)}
                                >

                                    <Popup className="civic-popup">

                                        <div className="w-[280px]">

                                            {/* =================================================
                                                PHOTO
                                            ================================================= */}

                                            <div className="mb-3 h-32 w-full overflow-hidden rounded-lg bg-gray-100">

                                                {report.photo_url ? (

                                                    <img
                                                        src={report.photo_url}
                                                        alt={report.category}
                                                        className="h-full w-full object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                                        No photo available
                                                    </div>

                                                )}

                                            </div>


                                            {/* =================================================
                                                CATEGORY
                                            ================================================= */}

                                            <h3 className="text-base font-bold text-gray-800">
                                                {report.category}
                                            </h3>


                                            {/* =================================================
                                                STATUS
                                            ================================================= */}

                                            <div
                                                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    String(report.status || "")
                                                        .trim()
                                                        .toLowerCase() === "pending"
                                                        ? "bg-red-100 text-red-600"
                                                        : String(report.status || "")
                                                              .trim()
                                                              .toLowerCase() === "in progress"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : String(report.status || "")
                                                              .trim()
                                                              .toLowerCase() === "resolved"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {report.status}
                                            </div>


                                            {/* =================================================
                                                LOCATION
                                            ================================================= */}

                                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">

                                                <MapPin size={16} />

                                                <span>
                                                    {report.location}
                                                </span>

                                            </div>


                                            {/* =================================================
                                                DATE
                                            ================================================= */}

                                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">

                                                <CalendarDays size={16} />

                                                <span>
                                                    {new Date(
                                                        report.created_at
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </span>

                                            </div>


                                            {/* =================================================
                                                DESCRIPTION
                                            ================================================= */}

                                            <p className="mt-3 text-sm leading-5 text-gray-600">
                                                {report.description}
                                            </p>


                                            {/* =================================================
                                                VIEW DETAILS
                                            ================================================= */}

                                            <button
                                                type="button"
                                                className="mt-3 text-sm font-medium text-sky-600 hover:text-sky-700"
                                            >
                                                View Details →
                                            </button>

                                        </div>

                                    </Popup>

                                </Marker>
                            );
                        })}

                    </MapContainer>


                    {/* =================================================
                        LIVE UPDATES BADGE
                    ================================================= */}

                    <div className="absolute left-4 top-4 z-[1000] rounded-lg bg-white px-4 py-3 shadow-md">

                        <div className="flex items-center gap-2">

                            <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>

                            <span className="text-sm font-medium text-sky-600 sm:text-base">
                                Live Updates - India
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        LIVE STATUS
                    ================================================= */}

                    <div className="absolute right-4 top-4 z-[1000] rounded-lg bg-white px-4 py-4 shadow-md">

                        <h3 className="mb-3 text-sm font-semibold text-sky-600 sm:text-base">
                            Live Status
                        </h3>


                        <div className="space-y-2 text-sm">

                            {/* Pending */}

                            <div className="flex items-center gap-2">

                                <span className="h-3 w-3 rounded-full bg-red-500"></span>

                                <span className="text-gray-700">
                                    Pending ({pendingReports})
                                </span>

                            </div>


                            {/* In Progress */}

                            <div className="flex items-center gap-2">

                                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>

                                <span className="text-gray-700">
                                    In Progress ({inProgressReports})
                                </span>

                            </div>


                            {/* Resolved */}

                            <div className="flex items-center gap-2">

                                <span className="h-3 w-3 rounded-full bg-green-500"></span>

                                <span className="text-gray-700">
                                    Resolved ({resolvedReports})
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        TOTAL REPORTS
                    ================================================= */}

                    <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-white px-4 py-3 shadow-md">

                        <span className="text-sm font-medium text-gray-700 sm:text-base">
                            📍 {reports.length} Reports
                        </span>

                    </div>

                </div>

            </div>

        </section>
    );
};


export default LiveMap;