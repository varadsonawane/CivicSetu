import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  MapPin,
  ChevronDown,
  Upload,
  Mic,
} from "lucide-react";
import { API_URL } from "../config";

const ReportIssue = () => {
  // -----------------------------
  // State
  // -----------------------------

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Reference to hidden file input
  const fileInputRef = useRef(null);

  // -----------------------------
  // Categories
  // -----------------------------

  const categories = [
    "Road Damage",
    "Garbage Collection",
    "Streetlight",
    "Water Supply",
    "Drainage",
    "Other",
  ];

  // -----------------------------
  // GPS
  // -----------------------------

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setCoordinates({
          latitude,
          longitude,
        });

        setLocation(`${latitude}, ${longitude}`);
        setError("");
      },
      (error) => {
        console.log(error);
        setError("Unable to get your location.");
      }
    );
  };

  // -----------------------------
  // Submit
  // -----------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (!photo) {
      setError("Please upload a photo.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter your location.");
      return;
    }

    if (!selectedCategory) {
      setError("Please select a category.");
      return;
    }

    if (!description.trim()) {
      setError("Please describe the issue.");
      return;
    }

    // -----------------------------
    // Create FormData
    // -----------------------------

    const formData = new FormData();

    formData.append("photo", photo);
    formData.append("location", location);
    formData.append("category", selectedCategory);
    formData.append("description", description);

    if (coordinates) {
      formData.append("latitude", coordinates.latitude);
      formData.append("longitude", coordinates.longitude);
    }

    // -----------------------------
    // Send to Backend
    // -----------------------------

    try {
  const response = await fetch(`${API_URL}/api/reports`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: formData,
});

      const data = await response.json();

      // Check if backend returned an error
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit report.");
      }

      console.log(data);

      // -----------------------------
      // Clear Form
      // -----------------------------

      setPhoto(null);
      setLocation("");
      setCoordinates(null);
      setSelectedCategory("");
      setDescription("");
      setIsOpen(false);

      // Clear actual file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // -----------------------------
      // Show Success Message
      // -----------------------------

      setSuccess("Your report was submitted successfully!");
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Container */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-50">

        {/* Header */}
        <div className="mb-8 flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-base font-medium text-black transition hover:text-sky-600"
          >
            <ArrowLeft size={20} strokeWidth={2} />
            <span>Back</span>
          </Link>

          <h1 className="text-2xl font-bold text-sky-600 sm:text-3xl lg:text-3xl">
            Report an Issue
          </h1>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-md sm:p-7 lg:p-7"
        >
          {/* Card Heading */}
          <h2 className="mb-8 text-lg font-semibold text-sky-600">
            Submit a Civil Issue Report
          </h2>

          {/* -------------------------------- */}
          {/* Photo Upload */}
          {/* -------------------------------- */}

          <div className="mb-6">
            <label className="mb-2 block text-base font-medium text-sky-600">
              Upload Photo *
            </label>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                setPhoto(event.target.files[0]);
              }}
            />

            {/* Custom Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex h-36 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-white transition hover:bg-sky-50 sm:h-38"
            >
              <Camera
                size={34}
                strokeWidth={2}
                className="mb-3 text-sky-500"
              />

              <span className="text-lg font-medium text-sky-600">
                Click to upload photo
              </span>

              {photo ? (
                <span className="mt-1 max-w-full truncate px-4 text-sm text-green-600">
                  {photo.name}
                </span>
              ) : (
                <span className="mt-1 text-sm text-sky-500">
                  PNG, JPG up to 10MB
                </span>
              )}
            </button>
          </div>

          {/* -------------------------------- */}
          {/* Location */}
          {/* -------------------------------- */}

          <div className="mb-6">
            <label className="mb-2 block text-base font-medium text-sky-600">
              Location *
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter location or use GPS"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="h-11 min-w-0 flex-1 rounded-lg border border-gray-200 px-3 text-base text-gray-700 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />

              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex h-11 items-center gap-2 rounded-lg border border-sky-500 px-4 text-base font-medium text-sky-600 transition hover:bg-sky-50"
              >
                <MapPin size={19} />
                <span>GPS</span>
              </button>
            </div>
          </div>

          {/* -------------------------------- */}
          {/* Category */}
          {/* -------------------------------- */}

          <div className="mb-6">
            <label className="mb-2 block text-base font-medium text-sky-600">
              Category *
            </label>

            <div className="relative w-full sm:w-56">

              {/* Dropdown Button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 text-base text-gray-500 shadow-sm"
              >
                <span>
                  {selectedCategory || "Select issue category"}
                </span>

                <ChevronDown
                  size={18}
                  className="text-gray-400"
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-gray-300 bg-white py-2 shadow-md">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsOpen(false);
                      }}
                      className="mx-2 block w-[calc(100%-1rem)] rounded-md px-4 py-2 text-left text-base text-gray-800 hover:bg-gray-100"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* -------------------------------- */}
          {/* Description */}
          {/* -------------------------------- */}

          <div className="mb-6">
            <label className="mb-2 block text-base font-medium text-sky-600">
              Description *
            </label>

            <textarea
              rows="3"
              maxLength={500}
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full resize-y rounded-lg border border-gray-200 px-3 py-3 text-base text-gray-700 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            ></textarea>

            <p className="mt-1 text-right text-sm text-gray-400">
              {description.length}/500
            </p>
          </div>

          {/* Voice Note */}
          {/* <div className="mb-7">
            <label className="mb-2 block text-base font-medium text-sky-600">
              Voice Note (Optional)
            </label>

            <button
              type="button"
              className="flex h-16 w-full items-center gap-3 rounded-xl border border-sky-300 px-5 text-base font-medium text-sky-600 transition hover:bg-sky-50"
            >
              <Mic size={22} strokeWidth={2} />
              <span>Upload voice note</span>
            </button>
          </div> */}

          {/* -------------------------------- */}
          {/* Error */}
          {/* -------------------------------- */}

          {error && (
            <p className="mb-4 text-sm font-medium text-red-500">
              {error}
            </p>
          )}

          {/* -------------------------------- */}
          {/* Success */}
          {/* -------------------------------- */}

          {success && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              ✅ {success}
            </div>
          )}

          {/* -------------------------------- */}
          {/* Submit */}
          {/* -------------------------------- */}

          <button
            type="submit"
            className="flex h-10 w-full items-center justify-center gap-3 rounded-xl bg-yellow-300 text-base font-semibold text-gray-500 transition hover:bg-yellow-400"
          >
            <Upload size={19} />
            <span>Submit Report</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;