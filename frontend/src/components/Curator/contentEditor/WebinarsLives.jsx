import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Button,
  Typography,
  TextField,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Grid,
  Divider,
  Chip,
  Link,
} from "@mui/material";
import { 
  AccessTime, 
  Event,
  Notifications,
  ExpandMore,
} from "@mui/icons-material";

const WebinarsLives = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const rows = [
    {
      subject: "Education",
      concepts: "Introduction to React fundamentals.",
      liveWebinar: "React Fundamentals",
      liveWebinarUrl: "https://example.com/react-fundamentals",
      hostDetails: { name: "John Doe", id: "12345", role: "Admin" },
      schedule: "Yes",
      timeDate: "2025-03-01T10:00:00",
    },
    {
      subject: "Standup",
      concepts: "Deep dive into Node.js.",
      liveWebinar: "Node.js Deep Dive",
      liveWebinarUrl: "https://example.com/nodejs-deep-dive",
      hostDetails: { name: "Jane Smith", id: "67890", role: "Editor" },
      schedule: "No",
      timeDate: "2025-03-02T14:00:00",
    },
    {
      subject: "Science",
      concepts: "Advanced CSS techniques.",
      liveWebinar: "Advanced CSS",
      liveWebinarUrl: "https://example.com/advanced-css",
      hostDetails: { name: "Alice Johnson", id: "11223", role: "Contributor" },
      schedule: "Yes",
      timeDate: "2025-03-03T09:00:00",
    },
    {
      subject: "Technology",
      concepts: "New features in ES6.",
      liveWebinar: "ES6 Features",
      liveWebinarUrl: "https://example.com/es6-features",
      hostDetails: { name: "Bob Brown", id: "44556", role: "Admin" },
      schedule: "No",
      timeDate: "2025-03-04T16:00:00",
    },
  ];

  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [rowsData] = useState(rows);
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  // Handle webinar title click for preview
  const handleWebinarClick = (title, description) => {
    setSelectedTitle(title);
    setSelectedDescription(description);
    setPreviewDialogOpen(true);
  };

  // Close preview dialog
  const handleClose = () => {
    setPreviewDialogOpen(false);
    setSelectedTitle("");
    setSelectedDescription("");
  };

  // Handle time icon click
  const handleTimeClick = (index) => {
    setCurrentRowIndex(index);
    setTimeDialogOpen(true);
  };

  // Handle date icon click
  const handleDateClick = (index) => {
    setCurrentRowIndex(index);
    setDateDialogOpen(true);
  };

  // Handle reminder button click
  const handleReminderClick = (index) => {
    setCurrentRowIndex(index);
    setReminderDialogOpen(true);
  };

  // Save reminder settings
  const handleSaveReminder = () => {
    setReminderDialogOpen(false);
    setSnackbarMessage("Reminder set successfully!");
    setSnackbarOpen(true);
  };

  // Toggle expanded row for mobile view
  const toggleExpandRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // Calculate remaining time
  const calculateRemainingTime = (dateTime) => {
    const eventDate = new Date(dateTime);
    const now = new Date();
    const diff = eventDate - now;
    
    if (diff <= 0) return "Event has started";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m remaining`;
  };

  // Render desktop table view
  const renderDesktopTable = () => (
    <TableContainer 
    component={Paper} 
    sx={{ 
      boxShadow: 4, 
      borderRadius: 3, 
      overflow: "hidden",
      border: "1px solid #e0e0e0"
    }}
  >
    <Table sx={{ minWidth: 900 }}>
      <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
        <TableRow>
          {["Subject", "Concepts", "Live/Webinar", "Host Details", "Schedule", "Time", "Date", "Reminder"].map((header) => (
            <TableCell 
              key={header} 
              sx={{ 
                color: "white", 
                fontWeight: "bold", 
                textAlign: "center",
                fontSize: "1rem",
                padding: "12px"
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rowsData.map((row, index) => (
          <TableRow 
            key={index} 
            sx={{ 
              "&:nth-of-type(odd)": { backgroundColor: "#fafafa" }, 
              "&:hover": { backgroundColor: "#e3f2fd" }, 
              transition: "background-color 0.2s ease"
            }}
          >
            {/* Bold Subject */}
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>{row.subject}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>{row.concepts}</TableCell>
            <TableCell sx={{ textAlign: "center" }}>
              <Link
                href={row.liveWebinarUrl}
                underline="hover"
                sx={{ 
                  cursor: "pointer",
                  fontWeight: "medium",
                  color: theme.palette.primary.main,
                  "&:hover": { color: theme.palette.primary.dark }
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleWebinarClick(row.subject, row.concepts);
                }}
              >
                {row.liveWebinar}
              </Link>
            </TableCell>
            {/* Host Details */}
            <TableCell sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  {row.hostDetails.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {row.hostDetails.id}
                </Typography>
                <Chip 
                  label={row.hostDetails.role} 
                  size="small" 
                  sx={{ 
                    width: "fit-content",
                    backgroundColor: row.hostDetails.role === "Admin" ? "#e3f2fd" : 
                                    row.hostDetails.role === "Editor" ? "#e8f5e9" : "#fff3e0"
                  }}
                />
              </Box>
            </TableCell>
            <TableCell sx={{ textAlign: "center" }}>
              <Chip 
                label={row.schedule} 
                color={row.schedule === "Yes" ? "success" : "default"} 
                size="small"
              />
            </TableCell>
            {/* Time Column */}
            <TableCell sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <AccessTime fontSize="small" sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body2">{new Date(row.timeDate).toLocaleTimeString()}</Typography>
              </Box>
            </TableCell>
            {/* Date Column */}
            <TableCell sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <Event fontSize="small" sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body2">{new Date(row.timeDate).toLocaleDateString()}</Typography>
              </Box>
            </TableCell>
            <TableCell sx={{ textAlign: "center" }}>
              <Button 
                variant="contained" 
                size="small" 
                startIcon={<Notifications />}
                onClick={() => handleReminderClick(index)}
                sx={{ 
                  borderRadius: 2,
                  boxShadow: 1,
                  "&:hover": {
                    boxShadow: 2
                  }
                }}
              >
                Reminder
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  
  );

  // Render mobile card view
  const renderMobileView = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {rowsData.map((row, index) => (
        <Card 
          key={index} 
          sx={{ 
            p: 2, 
            boxShadow: 2,
            borderRadius: 2,
            overflow: "visible",
            transition: "transform 0.2s",
            backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {row.subject}
              </Typography>
            </Box>
            <IconButton 
              onClick={() => toggleExpandRow(index)}
              sx={{ 
                transform: expandedRow === index ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s"
              }}
            >
              <ExpandMore />
            </IconButton>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {row.concepts}
            </Typography>
          </Box>

          <Link
            href={row.liveWebinarUrl}
            underline="hover"
            onClick={(e) => {
              e.preventDefault();
              handleWebinarClick(row.subject, row.concepts);
            }}
            sx={{ mb: 2, display: "block", color: theme.palette.primary.main }}
          >
            {row.liveWebinar}
          </Link>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Chip 
              label={row.schedule === "Yes" ? "Scheduled" : "Not Scheduled"} 
              color={row.schedule === "Yes" ? "success" : "default"} 
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              {calculateRemainingTime(row.timeDate)}
            </Typography>
          </Box>

          {expandedRow === index && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ my: 1 }} />
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>Host Details</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", mt: 0.5 }}>
                    <Typography variant="caption">{row.hostDetails.name}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" color="text.secondary">ID: {row.hostDetails.id}</Typography>
                      <Chip label={row.hostDetails.role} size="small" sx={{ height: 20 }} />
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Event fontSize="small" color="action" />
                    <Typography variant="body2">
                      {new Date(row.timeDate).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Button 
                    fullWidth
                    variant="contained" 
                    size="small" 
                    startIcon={<Notifications />}
                    onClick={() => handleReminderClick(index)}
                    sx={{ borderRadius: 2 }}
                  >
                    Reminder
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Card>
      ))}
    </Box>
  );

  return (
    <Box sx={{ 
      padding: { xs: 1.5, sm: 2, md: 3 }, 
      backgroundColor: "#f9f9f9",
      minHeight: "100vh"
    }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          fontWeight: "bold",
          textAlign: { xs: "center", sm: "left" },
          color: theme.palette.primary.main
        }}
      >
        Webinars & Live Sessions
      </Typography>
      
      {isMobile ? renderMobileView() : renderDesktopTable()}

      {/* Preview Dialog - Responsive */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: "white" }}>
          {selectedTitle}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedDescription}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Time Dialog */}
      <Dialog 
        open={timeDialogOpen} 
        onClose={() => setTimeDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: "white" }}>
          Set Time
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Time"
            type="time"
            defaultValue={currentRowIndex !== null ? new Date(rowsData[currentRowIndex].timeDate).toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}) : ""}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setTimeDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={() => setTimeDialogOpen(false)} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Date Dialog */}
      <Dialog 
        open={dateDialogOpen} 
        onClose={() => setDateDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: "white" }}>
          Set Date
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Date"
            type="date"
            defaultValue={currentRowIndex !== null ? new Date(rowsData[currentRowIndex].timeDate).toISOString().split('T')[0] : ""}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDateDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={() => setDateDialogOpen(false)} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog 
        open={reminderDialogOpen} 
        onClose={() => setReminderDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: "white" }}>
          Set Reminder
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Set a reminder for: {currentRowIndex !== null ? rowsData[currentRowIndex].subject : ""}
          </Typography>
          <TextField
            label="Reminder (minutes before)"
            type="number"
            defaultValue={15}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Event time: {currentRowIndex !== null ? new Date(rowsData[currentRowIndex].timeDate).toLocaleString() : ""}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReminderDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleSaveReminder} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          variant="filled"
          sx={{ boxShadow: 3 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WebinarsLives;