import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import {
    MapPin,
    CalendarDays,
} from "lucide-react";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

const createStatusIcon = (status) => {
    let color = "#ef4444";
    let symbol = "!";

    if (status === "In Progress") {
        color = "#f59e0b";
        symbol = "⚙";
    }

    if (status === "Resolved") {
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


const LiveMap = ({ reports = [] }) => {
    const pendingReports = reports.filter(
        (report) => report.status === "Pending"
    ).length;

    const inProgressReports = reports.filter(
        (report) => report.status === "In Progress"
    ).length;

    const resolvedReports = reports.filter(
        (report) => report.status === "Resolved"
    ).length;


    return (
        <section className="mx-auto max-w-7xl px-4 pt-0 py-12 sm:py-16">

            {/* Map Card */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                {/* Heading */}
                <div className="mb-4 flex items-center gap-2">
                    <span className="text-2xl">📍</span>

                    <h2 className="text-xl font-semibold text-sky-600 sm:text-2xl">
                        Live Interactive City Map - India
                    </h2>
                </div>

                {/* Map */}
                <div className="relative h-[400px] overflow-hidden rounded-xl border border-sky-200 sm:h-[450px] lg:h-[500px]">

                    <MapContainer
                        center={[18.5204, 73.8567]}
                        zoom={9}
                        scrollWheelZoom={true}
                        className="h-full w-full"
                    >

                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {reports.map((report) => {
                            if (!report.latitude || !report.longitude) {
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

                                            {/* Photo */}
                                            <div className="mb-3 h-32 w-full overflow-hidden rounded-lg bg-gray-100">
                                                {report.photo_url ? (
                                                    <img
                                                        src={`http://localhost:5000/${report.photo_url
                                                            .replaceAll("\\", "/")}`}
                                                        alt={report.category}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                                        No photo available
                                                    </div>
                                                )}
                                            </div>

                                            {/* Category */}
                                            <h3 className="text-base font-bold text-gray-800">
                                                {report.category}
                                            </h3>

                                            {/* Status */}
                                            <div
                                                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${report.status === "Pending"
                                                        ? "bg-red-100 text-red-600"
                                                        : report.status === "In Progress"
                                                            ? "bg-yellow-100 text-yellow-600"
                                                            : "bg-green-100 text-green-600"
                                                    }`}
                                            >
                                                {report.status}
                                            </div>

                                            {/* Location */}
                                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin size={16} />
                                                <span>{report.location}</span>
                                            </div>

                                            {/* Date */}
                                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                                <CalendarDays size={16} />

                                                <span>
                                                    {new Date(report.created_at).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>

                                            {/* Description */}
                                            <p className="mt-3 text-sm leading-5 text-gray-600">
                                                {report.description}
                                            </p>

                                            {/* View Details */}
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

                    {/* Live Updates Badge */}
                    <div className="absolute left-4 top-4 z-[1000] rounded-lg bg-white px-4 py-3 shadow-md">
                        <div className="flex items-center gap-2">

                            <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>

                            <span className="text-sm font-medium text-sky-600 sm:text-base">
                                Live Updates - India
                            </span>

                        </div>
                    </div>

                    {/* Live Status */}
                    <div className="absolute right-4 top-4 z-[1000] rounded-lg bg-white px-4 py-4 shadow-md">

                        <h3 className="mb-3 text-sm font-semibold text-sky-600 sm:text-base">
                            Live Status
                        </h3>

                        <div className="space-y-2 text-sm">

                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                                <span className="text-gray-700">
                                    Pending  ({pendingReports})
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                                <span className="text-gray-700">
                                    In Progress ({inProgressReports})
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                                <span className="text-gray-700">
                                    Resolved ({inProgressReports})
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* Reports Count */}
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