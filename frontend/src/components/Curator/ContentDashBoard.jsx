import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Paper,
  Divider,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import TimelineIcon from "@mui/icons-material/Timeline";
import Analytics from "./contentEditor/Analytics";
import axios from "axios";

const Dashboard = () => {
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [errorData, setErrorData] = useState(""); // Added error state

  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;

  const subCategories = ["All", "Article", "StepbyStepGuide", "Webinar"];

  const [categoryData, setCategoryData] = useState([]);

  // Fetch curator details on component mount
  useEffect(() => {
    const fetchCuratorDetails = async () => {
      try {
        const response = await axios.get(
          `  ${BackendServername}/posts/curatordetails`,
          {
            withCredentials: true,
          }
        );
        setCategoryData(response.data.data);
        console.log(response.data.data);
      } catch (err) {
        setErrorData(err.response?.data?.message || "Error fetching posts");
      }
    };

    fetchCuratorDetails();
  }, []);

  // Calculate status counts based on selected tab
  useEffect(() => {
    // Filter data based on selected category
    const filteredItems =
      selectedSubCategory === "All"
        ? categoryData
        : categoryData.filter(
            (item) => item.contentData === selectedSubCategory
          );

    setFilteredData(filteredItems);

    console.log(filteredData);
    // Compute status counts based on filtered data
    const counts = {
      Total: filteredItems.length,
      Posted: filteredItems.filter((item) => item.status === "approved").length,
      Pending: filteredItems.filter((item) => item.status === "pending").length,
      Rejected: filteredItems.filter((item) => item.status === "rejected")
        .length,
      Draft: filteredItems.filter((item) => item.status === "draft").length,
    };

    setStatusCounts(counts);
    console.log("Updated Status Counts:", counts);
  }, [selectedSubCategory, categoryData]); // Added categoryData dependency

  // Function to get appropriate card color based on category name
  const getCardColor = (name) => {
    switch (name) {
      case "Total":
        return {
          bg: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          hover: "linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)",
        };
      case "Posted":
        return {
          bg: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
          hover: "linear-gradient(135deg, #38ef7d 0%, #11998e 100%)",
        };
      case "Pending":
        return {
          bg: "linear-gradient(135deg, #f46b45 0%, #eea849 100%)",
          hover: "linear-gradient(135deg, #eea849 0%, #f46b45 100%)",
        };

      case "Rejected":
        return {
          bg: "linear-gradient(135deg, #CB356B 0%, #BD3F32 100%)",
          hover: "linear-gradient(135deg, #BD3F32 0%, #CB356B 100%)",
        };
      case "Draft":
        return {
          bg: "linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)",
          hover: "linear-gradient(135deg, #d04ed6 0%, #834d9b 100%)",
        };
      default:
        return {
          bg: "linear-gradient(90deg, #1976D2 0%, #1976D2 100%)",
          hover: "linear-gradient(90deg, #1976D2 100%, #1976D2 0%)",
        };
    }
  };

  const handleTabClick = (sub) => {
    setSelectedSubCategory(sub);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Refetch data
    const fetchCuratorDetails = async () => {
      try {
        const response = await axios.get(
          ` ${BackendServername}/posts/curatordetails`,
          {
            withCredentials: true,
          }
        );
        setCategoryData(response.data.data);
      } catch (err) {
        setErrorData(err.response?.data?.message || "Error fetching posts");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    fetchCuratorDetails();
  };

  // Add loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [selectedSubCategory]);

  // Card animation variants for framer-motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Prepare status cards data
  const statusCardsData = [
    { status: "Total", count: statusCounts.Total || 0 },
    { status: "Posted", count: statusCounts.Posted || 0 },
    { status: "Pending", count: statusCounts.Pending || 0 },
    { status: "Rejected", count: statusCounts.Rejected || 0 },
    { status: "Draft", count: statusCounts.Draft || 0 },
  ];

  const analyticsData = {
    approvedData: categoryData.filter((e) => e.status === "approved"),
    pendingData: categoryData.filter((e) => e.status === "pending"),
    draftData: categoryData.filter((e) => e.status === "draft"),
    rejectedData: categoryData.filter((e) => e.status === "rejected"),
  };

  const analyticsArray = [
    { name: "Approved", value: analyticsData.approvedData.length },
    { name: "Pending", value: analyticsData.pendingData.length },
    { name: "Draft", value: analyticsData.draftData.length },
    { name: "Rejected", value: analyticsData.rejectedData.length },
  ];

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg">
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 3,
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h5" fontWeight="bold" color="primary">
                Content Dashboard
              </Typography>
              <Box>
                <Tooltip title="Refresh Data">
                  <IconButton onClick={handleRefresh} color="primary">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Paper
              elevation={1}
              sx={{
                borderRadius: "12px",
                mb: 4,
                overflow: "hidden",
                background: "rgba(250, 250, 250, 0.9)",
              }}
            >
              <Tabs
                value={selectedSubCategory}
                onChange={(e, newValue) => setSelectedSubCategory(newValue)}
                centered
                sx={{
                  "& .MuiTabs-indicator": {
                    height: 3,
                    borderRadius: "3px 3px 0 0",
                  },
                }}
                TabIndicatorProps={{
                  style: {
                    background: "linear-gradient(45deg, #1976D2, #64B5F6)",
                  },
                }}
              >
                {subCategories.map((sub) => (
                  <Tab
                    key={sub}
                    label={`${sub}`}
                    value={sub}
                    onClick={() => handleTabClick(sub)}
                    sx={{
                      borderRadius: "10px 10px 0 0",
                      fontWeight: "medium",
                      transition: "all 0.3s",
                      textTransform: "none",
                      "&.Mui-selected": { fontWeight: "bold" },
                      "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.1)" },
                    }}
                  />
                ))}
              </Tabs>
            </Paper>

            <Grid container spacing={3} justifyContent="center">
              {statusCardsData.map((category, index) => (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    variants={cardVariants}
                    whileHover={{ scale: 1.05, rotate: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: "16px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        background: getCardColor(category.status).bg,
                        color: "white",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.3s",
                        opacity: isLoading ? 0.7 : 1,
                        "&:hover": {
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                          background: getCardColor(category.status).hover,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <div
                          className="d-inline flex-row"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ mb: 1, opacity: 0.9 }}
                          >
                            {category.status}
                          </Typography>

                          <Chip
                            size="small"
                            label={
                              selectedSubCategory !== "All"
                                ? selectedSubCategory
                                : "All"
                            }
                            sx={{
                              height: 20,
                              fontSize: "0.6rem",
                              background: "rgba(255, 255, 255, 0.2)",
                              color: "white",
                              ml: 1,
                            }}
                          />
                        </div>

                        <Typography variant="h3" fontWeight="bold">
                          {isLoading ? (
                            <Box
                              sx={{
                                width: "60%",
                                height: "36px",
                                background: "rgba(255, 255, 255, 0.2)",
                                borderRadius: "4px",
                                animation: "pulse 1.5s infinite ease-in-out",
                                "@keyframes pulse": {
                                  "0%": { opacity: 0.6 },
                                  "50%": { opacity: 0.3 },
                                  "100%": { opacity: 0.6 },
                                },
                              }}
                            />
                          ) : (
                            category.count
                          )}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mt: 1,
                          }}
                        >
                          <TimelineIcon fontSize="small" />
                          <Typography variant="caption">
                            {selectedSubCategory !== "All"
                              ? selectedSubCategory
                              : "All Categories"}
                          </Typography>
                        </Box>
                      </CardContent>
                      {/* Decorative elements */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "rgba(255, 255, 255, 0.1)",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: -20,
                          right: -20,
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          background: "rgba(255, 255, 255, 0.05)",
                        }}
                      />
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </LocalizationProvider>

      <Box sx={{ mt: 5 }}>
        <Analytics data={analyticsArray} />
      </Box>
    </>
  );
};

export default Dashboard;
