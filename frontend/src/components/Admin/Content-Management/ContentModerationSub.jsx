import React, { useEffect, useState } from "react";
import {getArticles, getWebinars, getStepbyStepGuides,  approveAll, rejectAll  } from "../../../APIServices/posts/postsAPI"
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Select,
  TextField,
  FormControl,
  Slider,
} from "@mui/material";
import {
  MoreVert,
  CheckCircle,
  PendingActions,
  ArrowUpward,
  ArrowDownward,
  Search,
  HourglassEmpty,
  Cancel,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPendingPosts,
  updatePostStatusAPI,
  deletePostAPI,
  fetchPostAnalytics,
} from "../../../APIServices/posts/postsAPI";

import axios, { all } from "axios";
import PostDetailsModal from "./Postdetailmodal";

import "./contentmodsub.css";
// Content Management Component
const ContentPart = () => {
  const [selectedPostinadminpanel, setselectedPostinadminpanel] =
    useState(null);

    const [counts, setCounts] = useState({
      approved: 0,
      pending: 0,
      rejected: 0,
    });

    const [articles, setArticles] = useState('')
    const [webiners, setWebiners] = useState('')
    const [stepBystepGuide, setStepBystepGuide] = useState('')


    const handleApprove = async () => {
      try {
        await approveAll();
        
        // Update the UI dynamically without refresh
        setfilteredposts((prevPosts) =>
          prevPosts.map((post) => ({ ...post, status: "approved" }))
        );
    
        setCounts((prevCounts) => ({
          ...prevCounts,
          approved: prevCounts.approved + prevCounts.pending,
          pending: 0,
        }));
      } catch (error) {
        console.error("Error approving all posts:", error);
      }
    };
    
    const handleReject = async () => {
      try {
        await rejectAll();
    
        // Update the UI dynamically without refresh
        setfilteredposts((prevPosts) =>
          prevPosts.map((post) => ({ ...post, status: "rejected" }))
        );
    
        setCounts((prevCounts) => ({
          ...prevCounts,
          rejected: prevCounts.rejected + prevCounts.pending,
          pending: 0,
        }));
      } catch (error) {
        console.error("Error rejecting all posts:", error);
      }
    };
    

   const getAllArticles = async() => {
      const res = await getArticles();
      setArticles(res.count)
    }
  const getAllWebiners = async() => {
      const res = await getWebinars();
      setWebiners(res.count)
    }
  const getAllGuides = async() => {
      const res = await getStepbyStepGuides();
      setStepBystepGuide(res.count)
    }

    useEffect(() => {
     
      getAllArticles();
      getAllWebiners();
      getAllGuides();

    }, []);
  

  const handleOpenModalofposts = (post) => {
    setselectedPostinadminpanel(post);
  };

  const handleCloseModalofposts = () => {
    setselectedPostinadminpanel(null);
  };

  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;

  const [allpostsdata, setallpostsdata] = useState([]);

  const [filteredposts, setfilteredposts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BackendServername}/posts/getallposts`
        );
        console.log("data",response.data.posts);
        setallpostsdata(response.data.posts);
        setfilteredposts(response.data.posts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const finalCounts = {
      approved: filteredposts.filter((e) => e.status.toLowerCase() === "approved").length,
      pending: filteredposts.filter((e) => e.status.toLowerCase() === "pending").length,
      rejected: filteredposts.filter((e) => e.status.toLowerCase() === "rejected").length,
    };

    // Reset counts on refresh
    setCounts({ approved: 0, pending: 0, rejected: 0 });

    let currentCounts = { approved: 0, pending: 0, rejected: 0 };

    const interval = setInterval(() => {
      setCounts((prev) => {
        let updatedCounts = { ...prev };

        Object.keys(finalCounts).forEach((key) => {
          updatedCounts[key] = Math.min(prev[key] + 1, finalCounts[key]); // Ensure it stops at final count
        });

        return updatedCounts;
      });

      currentCounts.approved++;
      currentCounts.pending++;
      currentCounts.rejected++;

      // Stop the interval when all counts are reached
      if (
        currentCounts.approved >= finalCounts.approved &&
        currentCounts.pending >= finalCounts.pending &&
        currentCounts.rejected >= finalCounts.rejected
      ) {
        clearInterval(interval);
      }
    }, 100); // Adjust speed if needed

    return () => clearInterval(interval);
  }, [filteredposts]);

  const [page, setPage] = useState(0);
  const [postsPerPage, setpostsPerPage] = useState(5);
  const totalPages = Math.ceil(filteredposts.length / postsPerPage);

  const handlePrevPage = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const paginatedPosts = filteredposts.slice(
    page * postsPerPage,
    (page + 1) * postsPerPage
  );

  


  const [statusFilter, setStatusFilter] = useState("All");

  const handleStatusFilterChange = (event) => {
    const selectedStatus = event.target.value;

    const filteredData =
      selectedStatus === "All"
        ? allpostsdata
        : allpostsdata.filter((e) => e.status === selectedStatus);

    setfilteredposts(filteredData);
    setStatusFilter(selectedStatus);
    setPage(0);
  };

  const [searchQueryofposts, setSearchQueryofposts] = useState("");

  const handleSearchofposts = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQueryofposts(query);

    if (!query) {
      setfilteredposts(allpostsdata);
      return;
    }

    const filteredResults = allpostsdata.filter((post) =>
      post.author?.username?.toLowerCase().includes(query)
    );

    setfilteredposts(filteredResults);
    setPage(0);
  };
  const [dateFilter, setDateFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setDateFilter(selectedFilter);

    if (selectedFilter !== "custom") {
      setStartDate("");
      setEndDate("");
      applyDateFilter(selectedFilter, "", "");
    }
  };


  const applyDateFilter = (filterType, start, end) => {
    const now = new Date();
    let filteredResults = [];

    switch (filterType) {
      case "today":
        filteredResults = allpostsdata.filter((post) => {
          const postDate = new Date(post.updatedAt);
          return (
            postDate.getDate() === now.getDate() &&
            postDate.getMonth() === now.getMonth() &&
            postDate.getFullYear() === now.getFullYear()
          );
        });
        break;

      case "yesterday":
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        filteredResults = allpostsdata.filter((post) => {
          const postDate = new Date(post.updatedAt);
          return (
            postDate.getDate() === yesterday.getDate() &&
            postDate.getMonth() === yesterday.getMonth() &&
            postDate.getFullYear() === yesterday.getFullYear()
          );
        });
        break;

      case "lastMonth":
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        lastMonth.setDate(1);
        const startOfMonth = new Date(lastMonth);
        lastMonth.setMonth(lastMonth.getMonth() + 1);
        lastMonth.setDate(0);
        const endOfMonth = new Date(lastMonth);

        filteredResults = allpostsdata.filter((post) => {
          const postDate = new Date(post.updatedAt);
          return postDate >= startOfMonth && postDate <= endOfMonth;
        });
        break;

      case "last3Months":
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        filteredResults = allpostsdata.filter((post) => {
          const postDate = new Date(post.updatedAt);
          return postDate >= threeMonthsAgo;
        });
        break;

      case "thisYear":
        const currentYear = now.getFullYear();
        filteredResults = allpostsdata.filter((post) => {
          const postDate = new Date(post.updatedAt);
          return postDate.getFullYear() === currentYear;
        });
        break;

      case "custom":
        if (start && end) {
          const startDateObj = new Date(start);
          const endDateObj = new Date(end);
          endDateObj.setHours(23, 59, 59, 999); // Include full end date

          filteredResults = allpostsdata.filter((post) => {
            const postDate = new Date(post.updatedAt);
            return postDate >= startDateObj && postDate <= endDateObj;
          });
        } else {
          filteredResults = allpostsdata; // Show all posts if no dates selected
        }
        break;

      default:
        filteredResults = allpostsdata;
    }

    setfilteredposts(filteredResults);
  };

  const handleSort = (order) => {
    const sortedData = [...filteredposts].sort((a, b) => {
      return order === "asc"
        ? new Date(a.updatedAt) - new Date(b.updatedAt)
        : new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    setfilteredposts(sortedData);
  };

  const handleStatusChangeofpostsdata = async (id, newStatus) => {
    try {
      await axios.put(`${BackendServername}/posts/updatepoststatus/${id}`, {
        status: newStatus,
      });

      setfilteredposts((prevData) =>
        prevData.map((post) =>
          post._id === id ? { ...post, status: newStatus } : post
        )
      );
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // For three dots menu
  const [selectedPostId, setSelectedPostId] = useState(null); // For delete action

  // Fetch Pending Posts
  const {
    data: postsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pendingPosts"],
    queryFn: fetchPendingPosts,
  });

  // Fetch Analytics
  const { data: analyticsData = {} } = useQuery({
    queryKey: ["postAnalytics"],
    queryFn: fetchPostAnalytics,
  });

  // Update Post Status
  const updateStatusMutation = useMutation({
    mutationFn: (data) => updatePostStatusAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingPosts"]);
      queryClient.invalidateQueries(["postAnalytics"]);
    },
    onError: (error) => {
      console.error("Error updating post status:", error);
    },
  });

  // Delete Post
  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePostAPI(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingPosts"]);
      queryClient.invalidateQueries(["postAnalytics"]);
    },
  });

  // Handle Post Status Change
  const handleStatusChange = (id, status) => {
    console.log("Updating post:", id, "to status:", status);
    updateStatusMutation.mutate({ postId: id, status });
  };
  // Handle Delete Post
  const handleDeletePost = (id) => {
    deleteMutation.mutate(id);
    setAnchorEl(null); // Close the menu
  };

  // Handle Three Dots Menu
  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  // Handle Modal Open/Close
  const handleOpenModal = (post) => {
    
    setSelectedPost(post);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedPost(null);
    setModalOpen(false);
  };

  if (isLoading) return <p>Loading pending posts...</p>;
  if (isError) return <p>Error loading posts.</p>;

  const posts = postsData?.posts || [];

  // Status Count Data
  const statusCounts = {
    Approved: posts.filter((post) => post.status === "approved").length || 0,
    Pending: posts.filter((post) => post.status === "pending").length || 0,
    Rejected: posts.filter((post) => post.status === "rejected").length || 0,
  };

  // Chart Data
  const chartData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        label: "Post Status",
        data: [
          statusCounts.Approved,
          statusCounts.Pending,
          statusCounts.Rejected,
        ],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      },
    ],
  };

  const monthData = {
    labels: ["This Month", "Last Month"],
    datasets: [
      {
        label: "Posts",
        data: [analyticsData.thisMonth || 0, analyticsData.lastMonth || 0],
        backgroundColor: ["#1976d2", "#4caf50"],
      },
    ],
  };




  return (
    <div className="content-management">
     <h5 style={{fontSize:"2.2rem", fontWeight:"bold", color:"#3a69a6"}}>Content Management</h5>
     <br/>
      <div
        className="status-cards"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
       
        <div className="boxdata d-flex justify-content-evenly w-100">
          <Box
            className="cm-data"
            sx={{
              p: 5,
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "#fff",
              textAlign: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
            }}
          >
            <CheckCircle sx={{ fontSize: 30, color: "green" }} />
            <Typography variant="h5">Approved</Typography>
            
            <Typography style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {counts.approved}
            {/* {
                filteredposts.filter(
                  (e) => e.status.toLowerCase() === "approved"
                ).length
                
              } */}
             
            </Typography>
          </Box>




          <Box
            className="cm-data"
            sx={{
              p: 5,
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "#fff",
              textAlign: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
            }}
          >
            <HourglassEmpty sx={{ fontSize: 30, color: "orange" }} />
            <Typography variant="h5">Pending</Typography>
            <Typography style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {counts.pending}
              {/* {
                filteredposts.filter(
                  (e) => e.status.toLowerCase() === "pending"
                ).length
              } */}
            </Typography>
          </Box>

          <Box
            className="cm-data"
            sx={{
              p: 5,
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "#fff",
              textAlign: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
            }}
          >
            <Cancel sx={{ fontSize: 30, color: "red" }} />
            <Typography variant="h5">Rejected</Typography>
            <Typography style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {counts.rejected}
              {/* {
                filteredposts.filter(
                  (e) => e.status.toLowerCase() === "rejected"
                ).length
              } */}
            </Typography>
          </Box>
        </div>



      </div>
       <Box
                sx={{
                  marginBottom: 4,
                  background: "whitesmoke",
                  color: "black",
                  padding:3 ,
                  borderRadius: 2,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    marginBottom: 2,
                    color: "blue",
                    textAlign: "center",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                  }}
                >
                  Content Analytics
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    // alignItems: "center",
                    // justifyContent: "center",
                    justifyContent:"space-evenly",
                    gap: 4,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: "90%", md: "40%" }, 
                      height: 250, 
                      backgroundColor: "white", 
                      padding: 3,
                      borderRadius: 2,
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", 
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)", 
                      },
                    }}
                  >
                    {/* <Pie
                      data={{
                        labels: ["Videos", "Webinars", "Articles", "Guides"],
                        datasets: [
                          {
                            data: [40, 20, 30, 10], // Matching proportions
                            backgroundColor: [
                              "#000000",
                              "#333333",
                              "#777777",
                              "#aaaaaa",
                            ],
                            borderColor: "#ffffff",
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                            labels: {
                              color: "black",
                              font: { size: 14 },
                            },
                          },
                        },
                      }}
                    /> */}
                    <Doughnut
  data={{
    labels: ["Videos", "Webinars", "Articles", "Guides"],
    datasets: [
      {
        data: [40, webiners, articles, stepBystepGuide], // Matching proportions
        backgroundColor: [
          "#1E3A8A",
          "#0d6efa",
          
          "#6610F2",
          "#0dcaf0",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  }}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%", // Creates the empty center
    plugins: {
      legend: {
        position: "right", // Moves details to the side
        labels: {
          color: "black",
          font: { size: 20 },
        },
      },
    },
  }}
/>


                    
                  </Box>
      
                  <Box
                    sx={{
                      width: { xs: "90%", md: "40%" },
                      height: 250, // Matching height with Pie Chart
                      backgroundColor: "white", // White background
                      padding: 3,
                      borderRadius: 2,
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      transition: "transform 0.3s ease-in-out", // Smooth transition
                      "&:hover": {
                        transform: "scale(1.05)", // Hover effect
                      },
                    }}
                  >


{/* <Bar
  data={{
    labels: ["Videos", "Webinars", "Articles", "Guides"],
    datasets: [
      {
        label: "Content Count",
        data: [40, 20, 30, 10],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)", // Soft red
          "rgba(54, 162, 235, 0.8)", // Soft blue
          "rgba(255, 206, 86, 0.8)", // Soft yellow
          "rgba(75, 192, 192, 0.8)", // Soft teal
        ],
        borderRadius: 8, // Rounded edges
        borderWidth: 0, // No border for a cleaner look
        barThickness: 40, // Controlled bar width
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ], // Slightly darker on hover
      },
    ],
  }}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#333", font: { size: 14 } },
        grid: { display: false }, // Hide X-axis grid for a cleaner look
      },
      y: {
        ticks: { color: "#333", font: { size: 14 } },
        grid: { color: "rgba(0, 0, 0, 0.1)" }, // Light gray grid
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend for simplicity
      },
    },
  }}
/> */}

<Bar
  data={{
    labels: ["Videos", "Webinars", "Articles", "Guides"],
    datasets: [
      {
        label: "Content Count",
        data: [40, webiners, articles, stepBystepGuide],
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)", // Soft red
          "rgba(54, 162, 235, 0.8)", // Soft blue
          "rgba(255, 206, 86, 0.8)", // Soft yellow
          "rgba(75, 192, 192, 0.8)", // Soft teal
        ],
        borderRadius: 8, // Rounded edges
        borderWidth: 0, // No border for a cleaner look
        barThickness: 40, // Controlled bar width
        hoverBackgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ], // Slightly darker on hover
      },
    ],
  }}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#333", font: { size: 14 } },
        grid: { display: false }, // Hide X-axis grid for a cleaner look
      },
      y: {
        ticks: { color: "#333", font: { size: 14 } },
        grid: { color: "rgba(0, 0, 0, 0.1)" }, // Light gray grid
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend for simplicity
      },
    },
    animation: {
      duration: 1000, // Animation duration (1 second)
      easing: "easeInOutQuart", // Smooth easing effect
    },
    hover: {
      animationDuration: 500, // Smooth hover effect
    },
  }}
/>


                  </Box>
                </Box>
              </Box>
      <Typography
        variant="h6"
        sx={{
          marginTop: 2,
          width: "100%",
          fontWeight: "bold",
          marginLeft:1,
          textTransform: "uppercase",
          letterSpacing: "1.0px",
          padding: "15px 0",
          display: "inline-block",
          color: "#007bff",
          fontSize: "1.5rem",
        }}
      >
        Posts data
      </Typography>

      <div className="mt-3 mb-5 d-flex flex-wrap gap-3 align-items-center justify-content-evenly">
        {/* Sorting Icons */}

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          displayEmpty
          sx={{
            minWidth: "100px",
            backgroundColor: "white",
            borderRadius: "8px",
            height:43
          }}
        >
          <MenuItem value="All">All Posts</MenuItem>
          <MenuItem value="pending">🟠 Pending</MenuItem>
          <MenuItem value="approved">✅ Approved</MenuItem>
          <MenuItem value="rejected">❌ Rejected</MenuItem>
        </Select>
        <button className="btn btn-success px-3" onClick={handleApprove}>All Approved</button>
        <button className="btn btn-danger px-3" onClick={handleReject}>All Rejected</button>
        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            maxWidth: "350px",
            flex: 1,
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search by username"
            value={searchQueryofposts}
            onChange={handleSearchofposts}
            sx={{
              flex: 1,
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
           
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#888" },
              "&.Mui-focused fieldset": { borderColor: "#007bff" },
              "& .MuiInputBase-input": { padding: "10px 14px" },
            }}
          />
          <button className="contentSubbutton" style={{background: 'linear-gradient(to right, #1E3A81, #3B82F6)', width:80, height:40,color:"white" ,  
}}>Search</button>
        </Box>

        {/* Date Filter */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#f5f5f5",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            flexWrap: "wrap",
          }}
        >
          <Select
            value={dateFilter}
            onChange={handleDateFilterChange}
            displayEmpty
            sx={{
              minWidth: "160px",
              backgroundColor: "white",
              borderRadius: "8px",
              "& .MuiSelect-select": {
                padding: "10px",
                height:5
              },
            }}
          >
            <MenuItem value="All">📅 All Time</MenuItem>
            <MenuItem value="today">📆 Today</MenuItem>
            <MenuItem value="yesterday">⏳ Yesterday</MenuItem>
            <MenuItem value="lastMonth">📅 Last Month</MenuItem>
            <MenuItem value="last3Months">📅 Last 3 Months</MenuItem>
            <MenuItem value="thisYear">📅 This Year</MenuItem>
            <MenuItem value="custom">📅 Select Date Range</MenuItem>
          </Select>

          {dateFilter === "custom" && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <TextField
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  applyDateFilter("custom", e.target.value, endDate);
                }}
                sx={{
                  minWidth: "150px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#888" },
                  "&.Mui-focused fieldset": { borderColor: "#007bff" },
                }}
              />

              <TextField
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  applyDateFilter("custom", startDate, e.target.value);
                }}
                sx={{
                  minWidth: "150px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#888" },
                  "&.Mui-focused fieldset": { borderColor: "#007bff" },
                }}
              />
            </Box>
          )}
        </Box>
      </div>

      <div
        className="d-flex justify-content-between align-items-center gap-3"
        style={{
          padding: "12px 24px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          // boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          marginBottom:"20px"
        }}
      >
        {/* Sorting Buttons */}
        <div className="d-flex align-items-center gap-2">
          <IconButton
            onClick={() => handleSort("asc")}
            title="Sort Ascending"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
            }}
          >
            <ArrowUpward />
          </IconButton>
          <IconButton
            onClick={() => handleSort("desc")}
            title="Sort Descending"
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
            }}
          >
            <ArrowDownward />
          </IconButton>
        </div>

        {/* Items per Page Selector */}
        <div className="d-flex align-items-center gap-2">
          <label
            style={{
              fontSize: "1rem",
              fontWeight: "600",
              color: "#444",
              textTransform: "capitalize",
            }}
          >
            Items per page:
          </label>
          <FormControl
            variant="outlined"
            size="small"
            sx={{
              minWidth: 120,
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.12)",
              "&:hover": { boxShadow: "0px 5px 12px rgba(0, 0, 0, 0.15)" },
            }}
          >
            <Select
              value={postsPerPage}
              onChange={(e) => {
                setpostsPerPage(e.target.value);
                setPage(0);
              }}
              displayEmpty
              sx={{
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: "600",
                padding: "6px 12px",
                color: "#333",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #bbb",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #888",
                },
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Pagination Controls */}
        <div className="d-flex align-items-center gap-2">
          <IconButton
            onClick={handlePrevPage}
            disabled={page === 0}
            sx={{
              backgroundColor: page === 0 ? "#e0e0e0" : "rgba(0, 0, 0, 0.05)",
              "&:hover": { backgroundColor: page === 0 ? "#e0e0e0" : "#ccc" },
              transition: "0.3s",
            }}
          >
            <ChevronLeft />
          </IconButton>

          <span
            style={{
              fontWeight: "bold",
              fontSize: "1.1rem",
              minWidth: "40px",
              textAlign: "center",
              color: "#333",
            }}
          >
            {page + 1}
          </span>

          <IconButton
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
            sx={{
              backgroundColor:
                page === totalPages - 1 ? "#e0e0e0" : "rgba(0, 0, 0, 0.05)",
              "&:hover": {
                backgroundColor: page === totalPages - 1 ? "#e0e0e0" : "#ccc",
              },
              transition: "0.3s",
            }}
          >
            <ChevronRight />
          </IconButton>
        </div>
      </div>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          marginBottom: 4,
        }}
      >
        <Table sx={{ minWidth: 750, textTransform: "capitalize" }}>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell align="center" sx={{fontSize:"16px"}}>
                <b>Sl.no</b>
              </TableCell>
              <TableCell align="center" sx={{fontSize:"16px"}}>
                <b>User Name</b>
              </TableCell>
              <TableCell align="center" sx={{fontSize:"16px"}}>
                <b>Change Status</b>
              </TableCell>
              <TableCell align="center" sx={{fontSize:"16px"}}>
                <b>Current Status</b>
              </TableCell>
              <TableCell align="center" sx={{fontSize:"16px"}}>
                <b>Updated At</b>
              </TableCell>
              <TableCell align="center" sx={{fontSize:"16px"}}>
                {/* <b style={{background:"linear-gradient"}}>Details</b> */}

                <b
      style={{
        background: "linear-gradient(to right, #1E3A8A, #3B82F6)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: "24px",
        fontWeight: "bold"
      }}
    >
      Details
    </b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPosts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    padding: "20px",
                  }}
                >
                  No posts available
                </TableCell>
              </TableRow>
            ) : (
              paginatedPosts.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                >
                  <TableCell align="center" style={{ fontWeight: "bolder" }}>
                    {page * postsPerPage + index + 1}
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: "1.1rem" }}>
                    {item.author?.username || "Unknown"}
                  </TableCell>
                  <TableCell align="center">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChangeofpostsdata(item._id, e.target.value)
                      }
                      style={{
                        minWidth: "140px",
                        fontWeight: "bold",
                        color:
                          item.status === "pending"
                            ? "orange"
                            : item.status === "approved"
                            ? "green"
                            : "red",
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        border: "2px solid #ccc",
                        outline: "none",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <option style={{ color: "orange" }} value="pending">
                        🟠 Pending
                      </option>
                      <option style={{ color: "green" }} value="approved">
                        ✅ Approved
                      </option>
                      <option style={{ color: "red" }} value="rejected">
                        ❌ Rejected
                      </option>
                    </select>
                  </TableCell>
                  <TableCell align="center">
                    <button
                      style={{
                        minWidth: "100px",
                        textTransform: "none",
                        fontWeight: "bold",
                        backgroundColor:
                          item.status === "pending"
                            ? "#ff9800"
                            : item.status === "approved"
                            ? "#4CAF50"
                            : "#F44336",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "8px 12px",
                        cursor: "pointer",
                      }}
                    >
                      {item.status.toUpperCase()}
                    </button>
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ fontSize: "1.1rem", fontWeight: "bolder" }}
                  >
                    {new Date(item.updatedAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell align="center">
                    <button  className="contentSubbutton"
                      style={{
                        background: "linear-gradient(to right, #1E3A8A, #3B82F6)",
                        color: "#ffffff",
                        padding: "10px",
                        border: "1px solid #007bff",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                      onClick={() => handleOpenModalofposts(item)}
                    >
                      Details
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedPostinadminpanel && (
        <PostDetailsModal
          post={selectedPostinadminpanel}
          onHide={handleCloseModalofposts}
          show={true}
        />
      )}
      {/* Post Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Post Details</DialogTitle>
        <DialogContent>
          {selectedPost && (
            <Box>
              <Box
                component="img"
                src={selectedPost.image}
                alt="Post"
                sx={{ width: "100%", borderRadius: 1 }}
              />
              <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedPost.description}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContentPart;
