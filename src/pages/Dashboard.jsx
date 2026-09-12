import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyReports = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/reports/my",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reports.");
      }

      setReports(data);
    } catch (error) {
      console.error("Dashboard error:", error);
      setError("Unable to load your reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const inProgressReports = reports.filter(
    (report) => report.status === "In Progress"
  ).length;

  const resolvedReports = reports.filter(
    (report) => report.status === "Resolved"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading your reports...
        </p>
      </div>
    );
  }

  return (
    <div  id="dashboard" className="min-h-screen bg-sky-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name}
          </h1>

          <p className="mt-2 text-gray-500">
            Track the civic issues you have reported.
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-red-600">
            {error}
          </p>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Reports
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-800">
              {totalReports}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-red-500">
              {pendingReports}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-500">
              {inProgressReports}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Resolved
            </p>

            <p className="mt-2 text-3xl font-bold text-green-500">
              {resolvedReports}
            </p>
          </div>

        </div>

        {/* Reports */}
        <div className="mt-10">

          <h2 className="mb-5 text-2xl font-bold text-gray-800">
            My Reports
          </h2>

          {reports.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">
                You haven't reported any issues yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-xl bg-white p-5 shadow-sm"
                >

                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {report.category}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {report.location}
                      </p>

                      <p className="mt-3 text-gray-600">
                        {report.description}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${
                        report.status === "Pending"
                          ? "bg-red-100 text-red-600"
                          : report.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {report.status}
                    </span>

                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-400">
                      Report #{report.id}
                    </p>
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Dashboard;