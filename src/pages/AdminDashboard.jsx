import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config";
import {
  BarChart3,
  CircleAlert,
  Clock3,
  CircleCheck,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";

import LiveMap from "../components/LiveMap/LiveMap";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [reports, setReports] = useState([]);

  // Filter states
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [statusFilter, setStatusFilter] =
    useState("All Statuses");

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // ==================================================
  // FETCH REPORTS
  // ==================================================

  const fetchReports = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/reports`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();

      setReports(data);

      console.log("Reports:", data);
    } catch (error) {
      console.error(
        "Failed to fetch reports:",
        error
      );
    }
  };

  // ==================================================
  // UPDATE REPORT STATUS
  // ==================================================

  const updateReportStatus = async (
    reportId,
    newStatus
  ) => {
    try {
      console.log(
        "Updating:",
        reportId,
        newStatus
      );

      const response = await fetch(
`${API_URL}/api/reports/${report.id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Backend response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update status"
        );
      }

      // Update React state
      setReports((currentReports) =>
        currentReports.map((report) =>
          report.id === reportId
            ? {
                ...report,
                status: newStatus,
              }
            : report
        )
      );

    } catch (error) {
      console.error(
        "Status update failed:",
        error
      );
    }
  };

  // ==================================================
  // DELETE REPORT
  // ==================================================

  const deleteReport = async (reportId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/reports/${report.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete report"
        );
      }

      // Remove deleted report from React state
      setReports((currentReports) =>
        currentReports.filter(
          (report) => report.id !== reportId
        )
      );

      console.log("Deleted:", data);

    } catch (error) {
      console.error(
        "Delete failed:",
        error
      );
    }
  };

  // ==================================================
  // FETCH REPORTS WHEN DASHBOARD LOADS
  // ==================================================

  useEffect(() => {
    fetchReports();
  }, []);

  // ==================================================
  // STATUS COUNTS
  // ==================================================

  const pendingReports = reports.filter(
    (report) =>
      report.status === "Pending"
  ).length;

  const inProgressReports = reports.filter(
    (report) =>
      report.status === "In Progress"
  ).length;

  const resolvedReports = reports.filter(
    (report) =>
      report.status === "Resolved"
  ).length;

  // ==================================================
  // FILTER REPORTS
  // ==================================================

  const filteredReports = reports.filter(
    (report) => {

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        report.category
          .toLowerCase()
          .includes(searchText) ||

        report.description
          .toLowerCase()
          .includes(searchText) ||

        report.location
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        categoryFilter ===
          "All Categories" ||
        report.category ===
          categoryFilter;

      const matchesStatus =
        statusFilter ===
          "All Statuses" ||
        report.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    }
  );

  // ==================================================
  // RESET FILTERS
  // ==================================================

  const resetFilters = () => {
    setSearch("");

    setCategoryFilter(
      "All Categories"
    );

    setStatusFilter(
      "All Statuses"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <header className="border-b border-gray-200 bg-white px-6 py-5">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-2xl font-bold text-sky-600 sm:text-3xl">
              CivicSetu Dashboard
            </h1>

            <p className="mt-1 text-base text-sky-500">
              Municipal Issue Management System
            </p>

          </div>

          <button
            onClick={handleLogout}
            type="button"
            className="rounded-lg border border-sky-500 px-5 py-2 text-sm font-medium text-sky-600 transition hover:bg-sky-50"
          >
            Logout
          </button>

        </div>

      </header>

      {/* ================================================== */}
      {/* STATISTICS */}
      {/* ================================================== */}

      <section className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL REPORTS */}

        <div className="flex rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-2">

            <p className="text-base font-medium text-sky-600">
              Total Reports
            </p>

            <h2 className="mt-2 text-3xl font-bold text-sky-600">
              {reports.length}
            </h2>

          </div>

          <div className="ml-auto flex items-center">

            <BarChart3
              size={38}
              strokeWidth={2}
              className="text-sky-500"
            />

          </div>

        </div>

        {/* PENDING */}

        <div className="flex rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-2">

            <p className="text-base font-medium text-sky-600">
              Pending
            </p>

            <h2 className="mt-2 text-3xl font-bold text-sky-600">
              {pendingReports}
            </h2>

          </div>

          <div className="ml-auto flex items-center">

            <CircleAlert
              size={38}
              strokeWidth={2}
              className="text-sky-500"
            />

          </div>

        </div>

        {/* IN PROGRESS */}

        <div className="flex rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-2">

            <p className="text-base font-medium text-sky-600">
              In Progress
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-500">
              {inProgressReports}
            </h2>

          </div>

          <div className="ml-auto flex items-center">

            <Clock3
              size={38}
              strokeWidth={2}
              className="text-yellow-500"
            />

          </div>

        </div>

        {/* RESOLVED */}

        <div className="flex rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-2">

            <p className="text-base font-medium text-sky-600">
              Resolved
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {resolvedReports}
            </h2>

          </div>

          <div className="ml-auto flex items-center">

            <CircleCheck
              size={38}
              strokeWidth={2}
              className="text-green-500"
            />

          </div>

        </div>

      </section>

      {/* ================================================== */}
      {/* LIVE MAP */}
      {/* ================================================== */}

      <section className="px-6 pb-6">

        <LiveMap
          reports={reports}
          fullWidth
        />

      </section>

      {/* ================================================== */}
      {/* FILTERS & SEARCH */}
      {/* ================================================== */}

      <section className="px-6 pb-6">

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          {/* HEADING */}

          <div className="mb-8 flex items-center gap-2">

            <Filter
              size={24}
              className="text-sky-600"
            />

            <h2 className="text-lg font-semibold text-sky-600">
              Filters & Search
            </h2>

          </div>

          {/* FILTER CONTROLS */}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

            {/* SEARCH */}

            <div className="relative w-full lg:w-[30%]">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"
              />

              <input
                type="text"
                placeholder="Search reports..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-lg border border-gray-200 pl-11 pr-4 text-base outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />

            </div>

            {/* CATEGORY */}

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              className="h-11 rounded-lg border border-gray-200 bg-white px-4 text-base outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 lg:w-44"
            >

              <option>
                All Categories
              </option>

              <option>
                Road Damage
              </option>

              <option>
                Garbage Collection
              </option>

              <option>
                Streetlight
              </option>

              <option>
                Water Supply
              </option>

              <option>
                Drainage
              </option>

              <option>
                Other
              </option>

            </select>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="h-11 rounded-lg border border-gray-200 bg-white px-4 text-base outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 lg:w-44"
            >

              <option>
                All Statuses
              </option>

              <option>
                Pending
              </option>

              <option>
                In Progress
              </option>

              <option>
                Resolved
              </option>

            </select>

            {/* REFRESH */}

            <button
              type="button"
              onClick={fetchReports}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-sky-500 px-5 text-base font-medium text-sky-600 transition hover:bg-sky-50"
            >

              <RefreshCw size={19} />

              <span>
                Refresh
              </span>

            </button>

            {/* RESET */}

            <button
              type="button"
              onClick={resetFilters}
              className="h-11 rounded-lg border border-gray-300 px-5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Reset
            </button>

          </div>

        </div>

      </section>

      {/* ================================================== */}
      {/* REPORTS MANAGEMENT */}
      {/* ================================================== */}

      <section className="px-6 pb-6">

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          {/* HEADING */}

          <div className="p-6">

            <h2 className="text-lg font-semibold text-sky-600">
              Reports Management (
              {filteredReports.length}
              )
            </h2>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px]">

              {/* TABLE HEADER */}

              <thead>

                <tr className="border-b border-gray-200">

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Report ID
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Photo
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Location
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Description
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>

                </tr>

              </thead>

              {/* TABLE BODY */}

              <tbody>

                {filteredReports.length === 0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No reports found.
                    </td>

                  </tr>

                ) : (

                  filteredReports.map(
                    (report) => (

                      <tr
                        key={report.id}
                        className="border-b border-gray-100 transition hover:bg-gray-50"
                      >

                        {/* REPORT ID */}

                        <td className="px-6 py-5 text-sm font-medium text-gray-800">

                          #{report.id}

                        </td>

                        {/* PHOTO */}

                        <td className="px-6 py-5">

                          {report.photo_url ? (

                            <img
                              src={`${API_URL}/${report.photo_url.replaceAll(
                                "\\",
                                "/"
                              )}`}
                              alt={
                                report.category
                              }
                              className="h-14 w-20 rounded-lg object-cover"
                            />

                          ) : (

                            <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                              No Photo
                            </div>

                          )}

                        </td>

                        {/* LOCATION */}

                        <td className="max-w-[220px] px-6 py-5 text-sm text-gray-700">

                          {report.location}

                        </td>

                        {/* CATEGORY */}

                        <td className="px-6 py-5">

                          <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-600">

                            {report.category}

                          </span>

                        </td>

                        {/* DESCRIPTION */}

                        <td className="max-w-[250px] px-6 py-5 text-sm text-gray-600">

                          <p className="line-clamp-2">

                            {report.description}

                          </p>

                        </td>

                        {/* DATE */}

                        <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">

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

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              report.status ===
                              "Pending"
                                ? "bg-red-100 text-red-600"
                                : report.status ===
                                  "In Progress"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >

                            {report.status}

                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <select
                              value={report.status}
                              onChange={(event) =>
                                updateReportStatus(
                                  report.id,
                                  event.target.value
                                )
                              }
                              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            >

                              <option value="Pending">
                                Pending
                              </option>

                              <option value="In Progress">
                                In Progress
                              </option>

                              <option value="Resolved">
                                Resolved
                              </option>

                            </select>

                            <button
                              type="button"
                              onClick={() =>
                                deleteReport(
                                  report.id
                                )
                              }
                              className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </section>

      {/* ================================================== */}
      {/* ANALYTICS */}
      {/* ================================================== */}

      <section className="grid grid-cols-1 gap-6 px-6 pb-8 lg:grid-cols-2">

        {/* REPORTS BY CATEGORY */}

        <div className="min-h-[280px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-sky-600">
            Reports by Category
          </h2>

          <div className="flex h-[220px] items-center justify-center text-sm text-gray-400">

            Category analytics coming next...

          </div>

        </div>

        {/* PERFORMANCE METRICS */}

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="mb-8 text-lg font-semibold text-sky-600">
            Performance Metrics
          </h2>

          <div className="space-y-6">

            {/* AVERAGE RESOLUTION TIME */}

            <div className="flex items-center justify-between">

              <span className="text-base text-sky-600">
                Average Resolution Time
              </span>

              <span className="font-semibold text-sky-600">
                —
              </span>

            </div>

            {/* RESOLUTION RATE */}

            <div className="flex items-center justify-between">

              <span className="text-base text-sky-600">
                Resolution Rate
              </span>

              <span className="font-semibold text-green-600">

                {reports.length > 0
                  ? `${Math.round(
                      (resolvedReports /
                        reports.length) *
                        100
                    )}%`
                  : "0%"}

              </span>

            </div>

            {/* ACTIVE REPORTS */}

            <div className="flex items-center justify-between">

              <span className="text-base text-sky-600">
                Active Reports
              </span>

              <span className="font-semibold text-yellow-500">

                {pendingReports +
                  inProgressReports}

              </span>

            </div>

            {/* DATABASE STATUS */}

            <div className="flex items-center justify-between">

              <span className="text-base text-sky-600">
                Database Status
              </span>

              <span className="font-semibold text-green-600">
                Connected
              </span>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default AdminDashboard;