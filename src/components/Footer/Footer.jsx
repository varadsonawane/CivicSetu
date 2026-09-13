import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-sky-600">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-10 sm:px-10 lg:px-12">

        {/* Logo */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            CivicSetu
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <a
            href="#home"
            className="text-base font-medium text-white transition hover:text-sky-200"
          >
            Home
          </a>

          <a
            href="#about"
            className="text-base font-medium text-white transition hover:text-sky-200"
          >
            About
          </a>

          <a
            href="#how-it-works"
            className="text-base font-medium text-white transition hover:text-sky-200"
          >
            How It Works
          </a>

          <Link
            to="/report"
            className="text-base font-medium text-white transition hover:text-sky-200"
          >
            Report Issue
          </Link>
        </nav>

      </div>
    </footer>
  );
};

export default Footer;