import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { FaBlog } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { checkAuthStatusAPI } from "../../APIServices/users/usersAPI";
import AuthCheckingComponent from "../Templates/AuthCheckingComponent";

export default function PublicNavbar() {
  const { isLoading, data } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
  });

  if (isLoading) return <AuthCheckingComponent />;

  const userRole = data?.role;
  const location = useLocation(); // Get current route

  const isActive = (path) => location.pathname === path;

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 bg-[#F9FAFB] shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            {/* Navbar height increased by 2px */}
            <div className="flex h-[70px] items-center justify-between">
              {/* Left Section - Logo */}
              <div className="flex items-center space-x-5">
                <Link to="/" className="flex items-center">
                  <FaBlog className="h-8 w-auto text-blue-600" />
                </Link>
              </div>

              {/* Center - NavLinks with active and underline hover effect */}
              <div className="hidden md:flex space-x-10 text-base font-medium">
                {[
                  { name: "Home", path: "/" },
                  // { name: "Latest Posts", path: "/posts" },
                  // { name: "Creators Ranking", path: "/ranking" },
                ].map(({ name, path }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`relative transition duration-300 ${
                      isActive(path)
                        ? "text-blue-700 font-semibold before:w-full"
                        : "text-gray-700 hover:text-blue-700 before:w-0"
                    } before:absolute before:bottom-[-2px] before:left-0 before:h-[2px] before:bg-blue-700 before:transition-all before:duration-300 hover:before:w-full`}
                  >
                    {name}
                  </Link>
                ))}
              </div>

              {/* Right Section - Button */}
              <div>
                {["subscriber", "curator", "admin"].includes(userRole) ? (
                  <Link
                    to={`/${userRole}`}
                    className="inline-block bg-gradient-to-r from-[#1565C0] to-[#42A5F5] hover:from-[#0D47A1] hover:to-[#1E88E5] transition-all duration-300 text-white font-mediam text-lg px-20 py-2 md:px-10 md:py- rounded-full shadow-lg transform hover:scale-105 hover:shadow-xl"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="inline-block bg-gradient-to-r from-[#1565C0] to-[#42A5F5] hover:from-[#0D47A1] hover:to-[#1E88E5] transition-all duration-300 text-white font-semibold text-lg px-8 py-3 md:px-10 md:py-4 rounded-full shadow-lg transform hover:scale-105 hover:shadow-xl"
                  >
                    Login
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-600 hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 rounded-md">
                  {open ? (
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <Disclosure.Panel className="md:hidden bg-[#F9FAFB]">
            <div className="space-y-2 pb-4 pt-2">
              {[
                { name: "Home", path: "/" },
                // { name: "Latest Posts", path: "/posts" },
                // { name: "Creators Ranking", path: "/ranking" },
              ].map(({ name, path }) => (
                <Disclosure.Button
                  key={path}
                  as={Link}
                  to={path}
                  className={`block py-2 pl-4 pr-6 font-medium rounded-md transition-all ${
                    isActive(path)
                      ? "text-blue-700 font-semibold bg-blue-100"
                      : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                  }`}
                >
                  {name}
                </Disclosure.Button>
              ))}
              <Disclosure.Button
                as={Link}
                to="/login"
                className="block py-2 pl-4 pr-6 text-gray-700 font-medium hover:bg-blue-100 hover:text-blue-700 rounded-md"
              >
                Login
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
