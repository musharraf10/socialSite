"use client";

import { useState, useEffect } from "react";
// import Image from "next/image"
import {
  ChevronRight,
  Play,
  FileText,
  Video,
  Calendar,
  ArrowRight,
  Mail,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { checkAuthStatusAPI } from "../../APIServices/users/usersAPI";
import { Link } from "react-router-dom";
import Pricing from "../Plans/Pricing";
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
  });

  const user = data?.role;

  useEffect(() => {
    setIsVisible(true);

    // Check if we're on mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [])

  // Primary color from screenshot
  const primaryColor = "#2E86DE";

  // Navigation sections
  const navSections = [
    { id: "home", label: "Home" },
    { id: "content", label: "Content" },
    { id: "webinars", label: "Webinars" },
    { id: "pricing", label: "Pricing" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
  ];

  // Featured content data
  const featuredContent = [
    {
      id: 1,
      title: "Sustainable Living: 10 Easy Tips",
      excerpt:
        "Discover practical ways to reduce your carbon footprint with these simple lifestyle changes.",
      type: "article",
      author: "Jane Doe",
      date: "May 15, 2024",
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1374&auto=format&fit=crop",
      category: "Sustainable Living",
    },
    {
      id: 2,
      title: "Advanced DIY Home Renovation",
      excerpt:
        "Learn professional techniques for transforming your living space without breaking the bank.",
      type: "video",
      author: "John Smith",
      date: "May 12, 2024",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1470&auto=format&fit=crop",
      category: "DIY Projects",
    },
    {
      id: 3,
      title: "Gourmet Cooking Masterclass",
      excerpt:
        "Elevate your culinary skills with expert techniques from renowned chefs.",
      type: "webinar",
      author: "Chef Maria Rodriguez",
      date: "May 20, 2024",
      image:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1470&auto=format&fit=crop",
      category: "Gourmet Cooking",
    },
    {
      id: 4,
      title: "Financial Independence: Investment Strategies",
      excerpt:
        "Build wealth and secure your future with these proven investment approaches.",
      type: "guide",
      author: "Michael Chen",
      date: "May 10, 2024",
      image:
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1471&auto=format&fit=crop",
      category: "Finance",
    },
    {
      id: 5,
      title: "Mindfulness Meditation for Beginners",
      excerpt:
        "Start your journey to inner peace with guided meditation practices.",
      type: "video",
      author: "Sarah Johnson",
      date: "May 8, 2024",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1470&auto=format&fit=crop",
      category: "Wellness",
    },
    {
      id: 6,
      title: "Urban Gardening in Small Spaces",
      excerpt: "Transform your apartment balcony into a thriving garden oasis.",
      type: "article",
      author: "David Wilson",
      date: "May 5, 2024",
      image:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1632&auto=format&fit=crop",
      category: "Sustainable Living",
    },
  ];

  // Upcoming webinars
  const upcomingWebinars = [
    {
      id: 1,
      title: "Gourmet Cooking Masterclass",
      date: "May 20, 2024",
      time: "7:00 PM EST",
      host: "Chef Maria Rodriguez",
      image:
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1470&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Sustainable Home Design",
      date: "May 25, 2024",
      time: "2:00 PM EST",
      host: "Architect Thomas Lee",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1470&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Advanced Photography Techniques",
      date: "June 2, 2024",
      time: "5:30 PM EST",
      host: "Emma Williams",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1528&auto=format&fit=crop",
    },
  ];

  // Subscription plans
  const subscriptionPlans = [
    {
      title: "Basic",
      price: "$9.99",
      period: "per month",
      features: [
        "Access to all articles",
        "Basic video content",
        "Community forum access",
        "Monthly newsletter",
        "Email support",
      ],
      isPopular: false,
      ctaText: "Get Started",
    },
    {
      title: "Premium",
      price: "$19.99",
      period: "per month",
      features: [
        "Everything in Basic",
        "Exclusive webinars",
        "Interactive guides",
        "Ad-free experience",
        "Early access to new content",
      ],
      isPopular: true,
      ctaText: "Join Premium",
    },
    {
      title: "Annual",
      price: "$179.99",
      period: "per year",
      features: [
        "Everything in Premium",
        "Two months free",
        "Downloadable resources",
        "1-on-1 expert sessions",
        "Priority support",
      ],
      isPopular: false,
      ctaText: "Save & Join",
    },
  ];

  // Categories
  const categories = [
    "All",
    "Sustainable Living",
    "DIY Projects",
    "Gourmet Cooking",
    "Finance",
    "Wellness",
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "DIY Enthusiast",
      quote:
        "Nicheflare has transformed my home renovation projects. The detailed guides and expert tips have saved me thousands of dollars!",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop&crop=faces&faceindex=1",
    },
    {
      id: 2,
      name: "Sophia Garcia",
      role: "Home Chef",
      quote:
        "The gourmet cooking webinars are incredible. I've learned techniques I never would have discovered elsewhere. Worth every penny!",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop&crop=faces&faceindex=1",
    },
    {
      id: 3,
      name: "Marcus Johnson",
      role: "Sustainability Advocate",
      quote:
        "The sustainable living content is well-researched and practical. I've implemented many of the suggestions with great results.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop&crop=faces&faceindex=1",
    },
  ];

  // Content types
  const contentTypes = [
    {
      icon: <FileText size={30} style={{ color: primaryColor }} />,
      title: "Articles",
      description: "Rich text, images, embedded media",
    },
    {
      icon: <Video size={30} style={{ color: primaryColor }} />,
      title: "Videos",
      description: "Host content with adaptive streaming",
    },
    {
      icon: <BookOpen size={30} style={{ color: primaryColor }} />,
      title: "Interactive Guides",
      description: "Step-by-step tutorials with interactive elements",
    },
    {
      icon: <Calendar size={30} style={{ color: primaryColor }} />,
      title: "Webinars",
      description: "Scheduled live video sessions with chat/Q&A",
    },
  ];

  // Filter content by category
  const filteredContent =
    activeCategory === "All"
      ? featuredContent
      : featuredContent.filter((item) => item.category === activeCategory);

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        color: "#333",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f8f9fa",
      }}
    >
      {/* Header/Navbar */}
      <header
        style={{
          background: "white",
          padding: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                margin: 0,
                color: primaryColor,
                letterSpacing: "0.5px",
              }}
            >
              Nicheflare
            </h1>
          </div>

          {/* Mobile Menu Button */}
          <button
            style={{
              display: isMobile ? "block" : "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#333",
              padding: "0.5rem",
            }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation */}
          <nav style={{ display: isMobile ? "none" : "block" }}>
            <ul
              style={{
                display: "flex",
                listStyle: "none",
                gap: "1.5rem",
                margin: 0,
                padding: 0,
              }}
            >
              {navSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    style={{
                      color: "#333",
                      textDecoration: "none",
                      fontWeight: "500",
                      transition: "color 0.3s ease",
                      padding: "0.5rem 0",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = primaryColor;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#333";
                    }}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Action Buttons - Desktop */}
          <div
            style={{
              display: isMobile ? "none" : "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {user ? (
              <a
                href={`${user}`}
                style={{
                  color: primaryColor,
                  background: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: "600",
                  border: `1px solid ${primaryColor}`,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f4f8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                }}
              >
                DashBoard
              </a>
            ) : (
              <Link
                to="/login"
                style={{
                  color: primaryColor,
                  background: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: "600",
                  border: `1px solid ${primaryColor}`,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f4f8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                }}
              >
                Sign In
              </Link>
            )}
            <a
              href="#pricing"
              style={{
                color: "white",
                background: primaryColor,
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#2476c7";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = primaryColor;
                e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
              }}
            >
              Subscribe
            </a>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                display: isMobile ? "block" : "none",
                zIndex: 100,
              }}
            >
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  listStyle: "none",
                  margin: 0,
                  padding: "1rem",
                }}
              >
                {navSections.map((section) => (
                  <li
                    key={section.id}
                    style={{
                      padding: "0.75rem 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <a
                      href={`#${section.id}`}
                      style={{
                        color: "#333",
                        textDecoration: "none",
                        fontWeight: "500",
                        display: "block",
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
                {/* Mobile Action Buttons */}
                <li
                  style={{
                    padding: "1rem 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    marginTop: "0.5rem",
                  }}
                >
                  {user ? (
                    <a
                      href={`${user}`}
                      style={{
                        color: primaryColor,
                        background: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        textDecoration: "none",
                        fontWeight: "600",
                        border: `1px solid ${primaryColor}`,
                        textAlign: "center",
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      DashBoard
                    </a>
                  ) : (
                    <Link
                      to="/login"
                      style={{
                        color: primaryColor,
                        background: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        textDecoration: "none",
                        fontWeight: "600",
                        border: `1px solid ${primaryColor}`,
                        textAlign: "center",
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                  <a
                    href="#pricing"
                    style={{
                      color: "white",
                      background: primaryColor,
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      textDecoration: "none",
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Subscribe
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section
          id="home"
          style={{
            background: "rgba(0,0,0,0.75)",
            color: "white",
            padding: "4rem 1rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "url('https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1470&auto=format&fit=crop') center/cover",
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              position: "relative",
              zIndex: 1,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <h1
              style={{
                fontSize: isMobile ? "2rem" : "2.5rem",
                fontWeight: "800",
                marginBottom: "1.5rem",
                lineHeight: 1.2,
              }}
            >
              Discover Expert Knowledge in Your Favorite Niches
            </h1>
            <p
              style={{
                fontSize: isMobile ? "1rem" : "1.2rem",
                marginBottom: "2rem",
                maxWidth: "600px",
                margin: "0 auto 2rem",
              }}
            >
              Unlock exclusive articles, videos, and interactive guides curated
              by experts. Elevate your skills with premium content you won't
              find anywhere else.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <a
                href="#pricing"
                style={{
                  background: "white",
                  color: primaryColor,
                  padding: "0.8rem 2rem",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 15px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.15)";
                }}
              >
                Start Your Free Trial <ChevronRight size={18} />
              </a>
              <a
                href="#"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  padding: "0.8rem 2rem",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                }}
              >
                Watch Demo <Play size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* Content Type Icons */}
        <section
          style={{
            padding: "3rem 1rem",
            background: "white",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "2.5rem",
                color: primaryColor,
              }}
            >
              Content Types
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {contentTypes.map((type, index) => (
                <div
                  key={index}
                  style={{
                    background: "white",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                    border: "1px solid #f0f0f0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.12)";
                    e.currentTarget.style.borderColor = "#e0e0e0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(0,0,0,0.08)";
                    e.currentTarget.style.borderColor = "#f0f0f0";
                  }}
                >
                  <div
                    style={{
                      background: "#f8f9fa",
                      borderRadius: "50%",
                      width: "80px",
                      height: "80px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                    }}
                  >
                    {type.icon}
                  </div>
                  <h3
                    style={{
                      margin: "0 0 0.5rem 0",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {type.title}
                  </h3>
                  <p style={{ margin: "0", color: "#666" }}>
                    {type.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Content */}
        <section
          id="content"
          style={{
            padding: "4rem 1rem",
            background: "#f8f9fa",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                marginBottom: "2rem",
                gap: "1rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "700",
                  margin: 0,
                  position: "relative",
                  paddingBottom: "0.5rem",
                  color: primaryColor,
                }}
              >
                Featured Content
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "60px",
                    height: "3px",
                    background: primaryColor,
                    borderRadius: "2px",
                  }}
                ></span>
              </h2>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: isMobile ? "nowrap" : "wrap",
                  overflowX: isMobile ? "auto" : "visible",
                  width: isMobile ? "100%" : "auto",
                  paddingBottom: isMobile ? "0.5rem" : "0",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    style={{
                      background:
                        activeCategory === category ? primaryColor : "#e9ecef",
                      color: activeCategory === category ? "white" : "#333",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                      whiteSpace: isMobile ? "nowrap" : "normal",
                      flexShrink: 0,
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {filteredContent.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "white",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 10px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={350}
                      height={200}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background:
                          item.type === "article"
                            ? primaryColor
                            : item.type === "video"
                              ? `${primaryColor}cc`
                              : item.type === "webinar"
                                ? `${primaryColor}dd`
                                : `${primaryColor}bb`,
                        color: "white",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.type}
                    </div>
                  </div>

                  <div style={{ padding: "1.5rem" }}>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        marginBottom: "0.5rem",
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      }}
                    >
                      <span>{item.category}</span>
                      <span>{item.date}</span>
                    </div>
                    <h3
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        marginTop: "0",
                        marginBottom: "0.8rem",
                        color: "#333",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        color: "#666",
                        marginBottom: "1.5rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.excerpt}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        By {item.author}
                      </div>
                      <a
                        href="#"
                        style={{
                          color: primaryColor,
                          textDecoration: "none",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          transition: "gap 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.gap = "0.5rem";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.gap = "0.3rem";
                        }}
                      >
                        Read More <ChevronRight size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <Link
                to="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: primaryColor,
                  color: "white",
                  padding: "0.8rem 2rem",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#2476c7";
                  e.currentTarget.style.gap = "0.7rem";
                  e.currentTarget.style.boxShadow =
                    "0 6px 15px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = primaryColor;
                  e.currentTarget.style.gap = "0.5rem";
                  e.currentTarget.style.boxShadow =
                    "0 4px 10px rgba(0,0,0,0.1)";
                }}
              >
                Explore All Content <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Upcoming Webinars */}
        <section
          id="webinars"
          style={{
            padding: "4rem 1rem",
            background: "white",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "3rem",
                position: "relative",
                paddingBottom: "0.5rem",
                display: "inline-block",
                color: primaryColor,
              }}
            >
              Upcoming Live Webinars
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60px",
                  height: "3px",
                  background: primaryColor,
                  borderRadius: "2px",
                }}
              ></span>
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fill, minmax(350px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {upcomingWebinars.map((webinar) => (
                <div
                  key={webinar.id}
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    overflow: "hidden",
                    padding: "1.5rem",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    gap: "1rem",
                    flexDirection: isMobile ? "column" : "row",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 10px rgba(0,0,0,0.1)";
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        marginTop: "0",
                        marginBottom: "0.5rem",
                        color: "#333",
                      }}
                    >
                      {webinar.title}
                    </h3>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {webinar.date} at {webinar.time}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>
                      Hosted by {webinar.host}
                    </div>
                    <a
                      href="#"
                      style={{
                        display: "inline-block",
                        marginTop: "0.8rem",
                        color: primaryColor,
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#2476c7";
                        e.currentTarget.style.textDecoration = "underline";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = primaryColor;
                        e.currentTarget.style.textDecoration = "none";
                      }}
                    >
                      Register Now
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <Link
                to="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "transparent",
                  color: primaryColor,
                  border: `2px solid ${primaryColor}`,
                  padding: "0.8rem 2rem",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = primaryColor;
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "transparent";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = primaryColor;
                  e.currentTarget.style.borderColor = primaryColor;
                }}
              >
                View All Webinars <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Subscription Plans */}
        {/* <section
          id="pricing"
          style={{
            padding: "4rem 1rem",
            background: "#f8f9fa",
            color: "#333",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "1rem",
                color: primaryColor,
              }}
            >
              Choose Your Subscription Plan
            </h2>
            <p
              style={{
                textAlign: "center",
                maxWidth: "600px",
                margin: "0 auto 3rem",
                fontSize: "1.1rem",
                color: "#666",
              }}
            >
              Get unlimited access to premium content with our flexible subscription options
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              {subscriptionPlans.map((plan, index) => (
                <div
                  key={index}
                  style={{
                    background: "white",
                    color: "#333",
                    borderRadius: "8px",
                    overflow: "hidden",
                    padding: "2rem",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    zIndex: plan.isPopular ? 2 : 1,
                    border: plan.isPopular ? `2px solid ${primaryColor}` : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)"
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)"
                  }}
                >
                  {plan.isPopular && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: primaryColor,
                        color: "white",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                      }}
                    >
                      Most Popular
                    </div>
                  )}

                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      marginTop: "0",
                      marginBottom: "1rem",
                      color: primaryColor,
                    }}
                  >
                    {plan.title}
                  </h3>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "2.5rem", fontWeight: "800" }}>{plan.price}</span>
                    <span style={{ color: "#666", marginLeft: "0.3rem" }}>{plan.period}</span>
                  </div>

                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 2rem 0",
                    }}
                  >
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        style={{
                          padding: "0.7rem 0",
                          borderBottom: i < plan.features.length - 1 ? "1px solid #eee" : "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <CheckCircle size={18} color={primaryColor} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/login"
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: primaryColor,
                      color: "white",
                      padding: "0.8rem",
                      borderRadius: "4px",
                      textDecoration: "none",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)"
                      e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.1)"
                      e.currentTarget.style.background = "#2476c7"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                      e.currentTarget.style.background = primaryColor
                    }}
                  >
                    {plan.ctaText}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section> */}
        <section
          id="pricing"
          style={{
            padding: "4rem 1rem",
            background: "#f8f9fa",
            color: "#333",
          }}
        >
          <Pricing />
        </section>
        {/* Testimonials */}
        <section
          id="testimonials"
          style={{
            padding: "4rem 1rem",
            background: "white",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                textAlign: "center",
                marginBottom: "3rem",
                position: "relative",
                paddingBottom: "0.5rem",
                display: "inline-block",
                color: primaryColor,
              }}
            >
              What Our Subscribers Say
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60px",
                  height: "3px",
                  background: primaryColor,
                  borderRadius: "2px",
                }}
              ></span>
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    padding: "2rem",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 10px rgba(0,0,0,0.1)";
                  }}
                >
                  <div
                    style={{
                      fontSize: "3rem",
                      color: primaryColor,
                      lineHeight: "1",
                      marginBottom: "1rem",
                      opacity: 0.3,
                    }}
                  >
                    "
                  </div>

                  <p
                    style={{
                      fontSize: "1rem",
                      lineHeight: "1.6",
                      marginBottom: "1.5rem",
                      color: "#444",
                    }}
                  >
                    {testimonial.quote}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />

                    <div>
                      <div style={{ fontWeight: "600" }}>
                        {testimonial.name}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section
          style={{
            padding: "5rem 1rem",
            background: "rgba(0,0,0,0.75)",
            color: "white",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "url('https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1470&auto=format&fit=crop') center/cover",
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            <h2
              style={{
                fontSize: isMobile ? "1.8rem" : "2.2rem",
                fontWeight: "800",
                marginBottom: "1.5rem",
              }}
            >
              Ready to Unlock Premium Content?
            </h2>
            <p
              style={{
                fontSize: isMobile ? "1rem" : "1.2rem",
                marginBottom: "2.5rem",
                opacity: 0.9,
              }}
            >
              Join thousands of subscribers who are elevating their skills with
              our exclusive content. Start your free 7-day trial today.
            </p>

            <a
              href="#pricing"
              style={{
                background: "white",
                color: primaryColor,
                padding: "1rem 2.5rem",
                borderRadius: "4px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1.1rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
              }}
            >
              Start Your Free Trial <ArrowRight size={20} />
            </a>

            <p
              style={{
                fontSize: "0.9rem",
                marginTop: "1.5rem",
                opacity: 0.8,
              }}
            >
              No credit card required. Cancel anytime.
            </p>
          </div>
        </section>

        {/* Newsletter */}
        <section
          id="contact"
          style={{
            padding: "4rem 1rem",
            background: "#f8f9fa",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "700",
                marginBottom: "1rem",
                color: primaryColor,
              }}
            >
              Subscribe to Our Newsletter
            </h2>
            <p
              style={{
                fontSize: "1rem",
                marginBottom: "2rem",
                color: "#666",
              }}
            >
              Get weekly updates on new content, upcoming webinars, and
              exclusive offers
            </p>

            <form
              style={{
                display: "flex",
                gap: "0.5rem",
                maxWidth: "500px",
                margin: "0 auto",
                flexDirection: isMobile ? "column" : "row",
                width: "100%",
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                style={{
                  flex: 1,
                  padding: "0.8rem 1.2rem",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  outline: "none",
                  fontSize: "1rem",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = primaryColor;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#ddd";
                }}
              />
              <button
                type="submit"
                style={{
                  background: primaryColor,
                  color: "white",
                  border: "none",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isMobile ? "center" : "flex-start",
                  gap: "0.5rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#2476c7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = primaryColor;
                }}
              >
                Subscribe <Mail size={18} />
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: primaryColor,
          color: "white",
          padding: "4rem 1rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              marginBottom: "3rem",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  margin: "0 0 1.5rem 0",
                  color: "white",
                }}
              >
                Nicheflare
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  lineHeight: "1.6",
                  color: "rgba(255,255,255,0.8)",
                  marginBottom: "1.5rem",
                }}
              >
                Premium niche content for enthusiasts and professionals. Elevate
                your skills with expert knowledge.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                }}
              >
                {["f", "t", "in", "ig"].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "4px",
                      background: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      color: "white",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.2)";
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>{social}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginTop: "0",
                  marginBottom: "1.2rem",
                  color: "white",
                }}
              >
                Quick Links
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {navSections.map((section) => (
                  <li key={section.id} style={{ marginBottom: "0.8rem" }}>
                    <a
                      href={`#${section.id}`}
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                      }}
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginTop: "0",
                  marginBottom: "1.2rem",
                  color: "white",
                }}
              >
                Categories
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {categories.slice(1).map((category, index) => (
                  <li key={index} style={{ marginBottom: "0.8rem" }}>
                    <a
                      href="#"
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        textDecoration: "none",
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                      }}
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginTop: "0",
                  marginBottom: "1.2rem",
                  color: "white",
                }}
              >
                Contact Us
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                <li
                  style={{
                    marginBottom: "0.8rem",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  Email: support@nicheflare.com
                </li>
                <li
                  style={{
                    marginBottom: "0.8rem",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  Phone: +1 (555) 123-4567
                </li>
                <li style={{ color: "rgba(255,255,255,0.8)" }}>
                  Address: 123 Content Street, Digital City, DC 10101
                </li>
              </ul>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.2)",
              paddingTop: "2rem",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: isMobile ? "column" : "row",
              gap: "1rem",
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.9rem",
            }}
          >
            <div>
              &copy; {new Date().getFullYear()} Nicheflare. All rights reserved.
            </div>
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              {["Terms of Service", "Privacy Policy", "Cookie Policy"].map(
                (policy, index) => (
                  <a
                    key={index}
                    href="#"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    }}
                  >
                    {policy}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
