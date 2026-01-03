"use client"

import { useState, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Cog6ToothIcon, HomeIcon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { FaBlog, FaUserEdit, FaCalendarPlus, FaTags, FaRss,FaBookmark } from "react-icons/fa"
import { MdContentPaste, MdPayment } from "react-icons/md"
import { FaUsersCog } from "react-icons/fa"
import { BsFileEarmarkText, BsCardList, BsCollection  } from "react-icons/bs"
import { Link, Outlet, useLocation } from "react-router-dom"
import PrivateNavbar from "../Navbar/PrivateNavbar"

const navigation = [
  { name: "Content Management", href: "/admin/content-management", icon: MdContentPaste },
  { name: "User Management", href: "/admin/user-management", icon: FaUsersCog },
  { name: "Payment Management", href: "/admin/payment-management", icon: MdPayment },
  { 
    name: "Feed", 
    icon: FaRss,
    subItems: [
      { name: "Webinars", href: "/admin/feed/webinars", icon: BsCollection },
      { name: "Step-by-Step Guides", href: "/admin/stepbystepguide", icon: BsCardList },
      { name: "Articles", href: "/admin/feed/articles", icon: BsFileEarmarkText },
    ]
  },
  { name: "Bookmarks", href: "/admin/bookmarks", icon: FaBookmark},
  { name: "Manage Content", href: "/admin/manage-content", icon: FaUserEdit },
  { name: "Plan Details", href: "/admin/plan-details", icon: FaCalendarPlus },
]

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState({})
  const location = useLocation()
  
  const toggleSubItems = (itemName) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }))
  }
 
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <PrivateNavbar />
      </div>

      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-80 flex-col bg-gradient-to-b from-white to-blue-50 p-5 h-screen shadow-xl">
                <button
                  className="absolute top-4 right-4 bg-white/80 rounded-full p-1.5 transition-all duration-300 hover:bg-white shadow-sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6 text-gray-700" />
                </button>
                <Link to="/" className="mb-8 flex items-center justify-center">
                  <div className="bg-gradient-to-r from-[#1565C0] to-[#42A5F5] p-2.5 rounded-lg shadow-md">
                    <FaBlog className="h-6 w-auto text-white" />
                  </div>
                  <span className="ml-3 text-xl font-semibold text-gray-800">AdminPanel</span>
                </Link>
                <nav className="space-y-1.5">
                  {navigation.map((item) => {
                    // For regular menu items
                    if (!item.subItems) {
                      // Only apply active styling if it's not the Dashboard and the path matches
                      const isActive =
                        item.href !== "/admin" && (location.pathname === item.href || location.pathname.startsWith(item.href + "/"))

                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap ${
                            isActive
                              ? "bg-gradient-to-r from-[#1565C0]/10 to-[#42A5F5]/20 text-[#1565C0] font-medium border-l-4 border-[#1565C0] shadow-sm"
                              : "text-gray-700 hover:bg-white/90 hover:shadow-sm"
                          }`}
                        >
                          <item.icon
                            className={`h-5 w-5 mr-3 flex-shrink-0 ${isActive ? "text-[#1565C0]" : "text-gray-500"}`}
                          />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      )
                    }
                    
                    // For dropdown items
                    const hasActiveSubItem = item.subItems && item.subItems.some(
                      subItem => location.pathname === subItem.href || location.pathname.startsWith(subItem.href + "/")
                    )
                    
                    return (
                      <div key={item.name} className="space-y-1">
                        <button
                          onClick={() => toggleSubItems(item.name)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap ${
                            hasActiveSubItem
                              ? "bg-gradient-to-r from-[#1565C0]/10 to-[#42A5F5]/20 text-[#1565C0] font-medium border-l-4 border-[#1565C0] shadow-sm"
                              : "text-gray-700 hover:bg-white/90 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center">
                            <item.icon
                              className={`h-5 w-5 mr-3 flex-shrink-0 ${hasActiveSubItem ? "text-[#1565C0]" : "text-gray-500"}`}
                            />
                            <span className="truncate">{item.name}</span>
                          </div>
                          <ChevronDownIcon 
                            className={`h-4 w-4 transition-transform duration-200 ${expandedItems[item.name] ? 'rotate-180' : ''}`} 
                          />
                        </button>
                        
                        {expandedItems[item.name] && (
                          <div className="pl-10 space-y-1">
                            {item.subItems.map(subItem => {
                              const isSubItemActive = location.pathname === subItem.href || location.pathname.startsWith(subItem.href + "/")
                              
                              return (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                                    isSubItemActive
                                      ? "bg-white text-[#1565C0] font-medium shadow-sm"
                                      : "text-gray-600 hover:bg-white/70"
                                  }`}
                                >
                                  <subItem.icon
                                    className={`h-4 w-4 mr-3 flex-shrink-0 ${isSubItemActive ? "text-[#1565C0]" : "text-gray-500"}`}
                                  />
                                  <span className="text-sm">{subItem.name}</span>
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </nav>
                <div className="mt-auto mb-6">
                  <Link
                    to="/admin/settings"
                    className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap ${
                      location.pathname === "/admin/settings"
                        ? "bg-gradient-to-r from-[#1565C0]/10 to-[#42A5F5]/20 text-[#1565C0] font-medium border-l-4 border-[#1565C0] shadow-sm"
                        : "text-gray-700 hover:bg-white/90 hover:shadow-sm"
                    }`}
                  >
                    <Cog6ToothIcon
                      className={`h-5 w-5 mr-3 flex-shrink-0 ${
                        location.pathname === "/admin/settings" ? "text-[#1565C0]" : "text-gray-500"
                      }`}
                    />
                    <span className="truncate">Settings</span>
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="flex">
        <aside className="hidden lg:flex w-80 flex-col bg-gradient-to-b from-white to-blue-50 p-5 h-screen fixed top-16 shadow-md border-r border-blue-100">
          <Link to="/" className="mb-8 flex items-center justify-center">
            <div className="bg-gradient-to-r from-[#1565C0] to-[#42A5F5] p-2.5 rounded-lg shadow-md">
              <FaBlog className="h-6 w-auto text-white" />
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-800">AdminPanel</span>
          </Link>
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              // For regular menu items
              if (!item.subItems) {
                // Only apply active styling if it's not the Dashboard and the path matches
                const isActive =
                  item.href !== "/admin" && (location.pathname === item.href || location.pathname.startsWith(item.href + "/"))

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-[#1565C0]/10 to-[#42A5F5]/20 text-[#1565C0] font-medium border-l-4 border-[#1565C0] shadow-sm"
                        : "text-gray-700 hover:bg-white/90 hover:shadow-sm"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 mr-3 flex-shrink-0 ${isActive ? "text-[#1565C0]" : "text-gray-500"}`}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                )
              }
              
              // For dropdown items
              const hasActiveSubItem = item.subItems && item.subItems.some(
                subItem => location.pathname === subItem.href || location.pathname.startsWith(subItem.href + "/")
              )
              
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleSubItems(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap ${
                      hasActiveSubItem
                        ? "bg-gradient-to-r from-[#1565C0]/10 to-[#42A5F5]/20 text-[#1565C0] font-medium border-l-4 border-[#1565C0] shadow-sm"
                        : "text-gray-700 hover:bg-white/90 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={`h-5 w-5 mr-3 flex-shrink-0 ${hasActiveSubItem ? "text-[#1565C0]" : "text-gray-500"}`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <ChevronDownIcon 
                      className={`h-4 w-4 transition-transform duration-200 ${expandedItems[item.name] ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  {expandedItems[item.name] && (
                    <div className="pl-10 space-y-1">
                      {item.subItems.map(subItem => {
                        const isSubItemActive = location.pathname === subItem.href || location.pathname.startsWith(subItem.href + "/")
                        
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                              isSubItemActive
                                ? "bg-white text-[#1565C0] font-medium shadow-sm"
                                : "text-gray-600 hover:bg-white/70"
                            }`}
                          >
                            <subItem.icon
                              className={`h-4 w-4 mr-3 flex-shrink-0 ${isSubItemActive ? "text-[#1565C0]" : "text-gray-500"}`}
                            />
                            <span className="text-sm">{subItem.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
          <div className="mt-auto mb-[30%]">
            <Link
              to="/admin/settings"
              className={`flex items-center px-4 py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap ${
                location.pathname === "/admin/settings"
                  ? "bg-gradient-to-r from-[#1565C0]/10 to-[#42A5F5]/20 text-[#1565C0] font-medium border-l-4 border-[#1565C0] shadow-sm"
                  : "text-gray-700 hover:bg-white/90 hover:shadow-sm"
              }`}
            >
              <Cog6ToothIcon
                className={`h-5 w-5 mr-3 flex-shrink-0 ${
                  location.pathname === "/admin/settings" ? "text-[#1565C0]" : "text-gray-500"
                }`}
              />
              <span className="truncate">Settings</span>
            </Link>
          </div>
        </aside>

        <div className="flex-1 p-8 mt-16 lg:ml-80 bg-gray-50 min-h-screen">
          <button
            className="lg:hidden mb-6 flex items-center px-4 py-2.5 bg-gradient-to-r from-[#1565C0] to-[#42A5F5] text-white rounded-lg shadow-md transition-all duration-300 hover:opacity-90"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="mr-2">☰</span> Menu
          </button>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}