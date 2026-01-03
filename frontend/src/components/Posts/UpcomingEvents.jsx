import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import LockIcon from "@mui/icons-material/Lock";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

// Function to format date
const formatDate = (dateString) => {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-IN", options);
};

// Function to format time
const formatTime = (timeString) => {
  const options = { hour: "2-digit", minute: "2-digit", hour12: true };
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString(
    "en-IN",
    options
  );
};

// Function to check if webinar is expired
const isWebinarExpired = (dateString, timeString) => {
  const now = new Date();
  const webinarDate = new Date(dateString);

  // Set the time from timeString to webinarDate
  const [hours, minutes] = timeString.split(":");
  webinarDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

  return now > webinarDate;
};

// Function to get webinar date object with time
const getWebinarDateTime = (dateString, timeString) => {
  const webinarDate = new Date(dateString);
  const [hours, minutes] = timeString.split(":");
  webinarDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
  return webinarDate;
};

// Function to check if date is today
const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Function to check if date is tomorrow
const isTomorrow = (date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

const isThisWeek = (date) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Start of week (Monday)
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End of week (Sunday)
  endOfWeek.setHours(23, 59, 59, 999);

  return date >= startOfWeek && date <= endOfWeek;
};

const isThisMonth = (date) => {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
};

const isThisYear = (date) => {
  const now = new Date();
  return date.getFullYear() === now.getFullYear();
};

const UpcomingEvents = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const [planName, setPlanName] = useState("");

  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;

  // Fetch webinars
  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const response = await axios.get(
          `${BackendServername}/webinar/upcomingevents`
        );
        console.log(response.data);
        setWebinars(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
  }, []);

  // Fetch user's current plan
  const getPlan = async () => {
    try {
      const response = await axios.get(`${BackendServername}/users/currentplan`, {
        withCredentials: true,
      });

      console.log("Fetched Plan:", response.data.data);
      setPlanName(response.data.data);
    } catch (error) {
      console.error("Error fetching plan:", error);
    }
  };

  useEffect(() => {
    getPlan();
  }, []);

  useEffect(() => {
    setIsUserSubscribed(planName);
  }, [planName]);

  // Stripe payment handling
  const handleContent = async (webinarId, price) => {
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

      const response = await axios.post(
        `${BackendServername}/payments/create-checkout-session`,
        {
          webinarId,
          price,
        },
        { withCredentials: true }
      );

      const { sessionId } = response.data;
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const getFilteredWebinars = () => {
    return webinars.filter((webinar) => {
      const webinarDateTime = getWebinarDateTime(webinar.date, webinar.time);
      const expired = isWebinarExpired(webinar.date, webinar.time);

      switch (selectedTab) {
        case 0: // All
          return true;
        case 1: // Today
          return isToday(webinarDateTime) && !expired;
        case 2: // Tomorrow
          return isTomorrow(webinarDateTime);
        case 3: // This Week
          return isThisWeek(webinarDateTime) && !expired;
        case 4: // This Month
          return isThisMonth(webinarDateTime) && !expired;
        case 5: // This Year
          return isThisYear(webinarDateTime) && !expired;
        case 6: // Expired
          return expired;
        default:
          return true;
      }
    });
  };

  // Check if a webinar is premium
  const isPremiumWebinar = (webinar) => {
    return webinar.isPremium || webinar.price > 0;
  };

  const filteredWebinars = getFilteredWebinars();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        Upcoming Webinars
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTab-root": {
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: "white",
              },
            },
          }}
        >
          <Tab label="All" />
          <Tab label="Today" />
          <Tab label="Tomorrow" />
          <Tab label="This Week" />
          <Tab label="This Month" />
          <Tab label="This Year" />
          <Tab label="Expired" />
        </Tabs>
      </Box>

      {loading ? (
        <Typography align="center" color="gray">
          Loading webinars...
        </Typography>
      ) : filteredWebinars.length === 0 ? (
        <Typography align="center" color="gray">
          No webinars found for this time period.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredWebinars.map((webinar) => {
            const expired = isWebinarExpired(webinar.date, webinar.time);
            const isPremium = isPremiumWebinar(webinar);
            const canAccess = !isPremium || isUserSubscribed;

            return (
              <Grid item xs={12} sm={6} md={4} key={webinar._id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  {/* Premium Badge */}
                  {isPremium && (
                    <Chip
                      icon={<WorkspacePremiumIcon />}
                      label="Premium"
                      color="primary"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        zIndex: 10,
                      }}
                    />
                  )}
                  
                  <div style={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={webinar.thumbnail}
                      alt={webinar.title}
                      sx={{ filter: isPremium && !isUserSubscribed ? "blur(2px)" : "none" }}
                    />
                    
                    {/* Premium Content Overlay */}
                    {isPremium && !isUserSubscribed && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "16px",
                          zIndex: 5,
                        }}
                      >
                        <LockIcon
                          sx={{ fontSize: 40, color: "white", mb: 1 }}
                        />
                        <Typography
                          variant="body1"
                          align="center"
                          sx={{ color: "white", mb: 2 }}
                        >
                          This is premium content
                        </Typography>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleContent(webinar._id, webinar.price || 9.99)}
                          size="small"
                        >
                          {webinar.price ? `Buy for $${webinar.price}` : "Subscribe to access"}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        noWrap
                        sx={{ flex: 1 }}
                      >
                        {webinar.title}
                      </Typography>
                      <Chip
                        label={expired ? "Expired" : "Upcoming"}
                        color={expired ? "error" : "success"}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </div>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(webinar.date)} | {formatTime(webinar.time)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textPrimary"
                      mt={1}
                      noWrap
                    >
                      {webinar.description.slice(0, 80)}...
                    </Typography>
                  </CardContent>
                  <CardContent
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setSelectedWebinar(webinar)}
                    >
                      View Details
                    </Button>
                    {isPremium && !isUserSubscribed ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleContent(webinar._id, webinar.price || 9.99)}
                        disabled={expired}
                      >
                        {expired ? "Ended" : "Unlock Access"}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        href={webinar.link}
                        target="_blank"
                        disabled={expired}
                      >
                        {expired ? "Ended" : "Join Webinar"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Modal Popup */}
      <Dialog
        open={Boolean(selectedWebinar)}
        onClose={() => setSelectedWebinar(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedWebinar && (
          <>
            <DialogTitle>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {selectedWebinar.title}
                <div style={{ display: "flex", gap: "8px" }}>
                  {isPremiumWebinar(selectedWebinar) && (
                    <Chip
                      icon={<WorkspacePremiumIcon />}
                      label="Premium"
                      color="primary"
                      size="small"
                    />
                  )}
                  <Chip
                    label={
                      isWebinarExpired(selectedWebinar.date, selectedWebinar.time)
                        ? "Expired"
                        : "Upcoming"
                    }
                    color={
                      isWebinarExpired(selectedWebinar.date, selectedWebinar.time)
                        ? "error"
                        : "success"
                    }
                    size="small"
                  />
                </div>
              </div>
            </DialogTitle>
            <DialogContent>
              <Typography color="textSecondary">
                {formatDate(selectedWebinar.date)} |{" "}
                {formatTime(selectedWebinar.time)}
              </Typography>
              <div style={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  image={selectedWebinar.thumbnail}
                  alt={selectedWebinar.title}
                  sx={{ 
                    borderRadius: 2, 
                    my: 2, 
                    height: 300, 
                    objectFit: "cover",
                    filter: isPremiumWebinar(selectedWebinar) && !isUserSubscribed ? "blur(2px)" : "none"
                  }}
                />
                
                {/* Premium Overlay in Modal */}
                {isPremiumWebinar(selectedWebinar) && !isUserSubscribed && (
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: 0,
                      width: "100%",
                      height: "300px",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "16px",
                      borderRadius: "8px",
                    }}
                  >
                    <LockIcon
                      sx={{ fontSize: 50, color: "white", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{ color: "white", mb: 2 }}
                    >
                      Premium Content
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{ color: "white", mb: 3 }}
                    >
                      Subscribe to our plan or purchase this webinar to access the content.
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleContent(selectedWebinar._id, selectedWebinar.price || 9.99)}
                    >
                      {selectedWebinar.price 
                        ? `Buy for $${selectedWebinar.price}` 
                        : "Subscribe to access"
                      }
                    </Button>
                  </div>
                )}
              </div>

              <Typography>{selectedWebinar.description}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedWebinar(null)} color="error">
                Close
              </Button>
              {isPremiumWebinar(selectedWebinar) && !isUserSubscribed ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleContent(selectedWebinar._id, selectedWebinar.price || 9.99)}
                  disabled={isWebinarExpired(
                    selectedWebinar.date,
                    selectedWebinar.time
                  )}
                >
                  {isWebinarExpired(selectedWebinar.date, selectedWebinar.time)
                    ? "Ended"
                    : "Unlock Access"
                  }
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  href={selectedWebinar.link}
                  target="_blank"
                  disabled={isWebinarExpired(
                    selectedWebinar.date,
                    selectedWebinar.time
                  )}
                >
                  {isWebinarExpired(selectedWebinar.date, selectedWebinar.time)
                    ? "Ended"
                    : "Join Webinar"
                  }
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default UpcomingEvents;