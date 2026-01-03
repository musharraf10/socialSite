import React, { useState, useEffect } from "react";
import {
  Button,
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
  Badge,
  Box,
  TextField,
  Popover,
  Snackbar,
  Alert,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
import { Favorite, ThumbDown, Comment, Share, Delete, Visibility, Close, Send } from "@mui/icons-material";

const ContentTable = ({ rows, onDelete }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentComment, setCurrentComment] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [comments, setComments] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [rowsData, setRowsData] = useState(rows);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusCounts, setStatusCounts] = useState({});

  // Calculate status counts for badge display
  useEffect(() => {
    const counts = {
      All: rowsData.length,
      Posted: rowsData.filter(row => row.status === "Posted").length,
      Verified: rowsData.filter(row => row.status === "Verified").length,
      Pending: rowsData.filter(row => row.status === "Pending").length,
      Rejected: rowsData.filter(row => row.status === "Rejected").length
    };
    setStatusCounts(counts);
  }, [rowsData]);

  // Handle image click for preview
  const handleImageClick = (image, title, description) => {
    setSelectedImage(image);
    setSelectedTitle(title);
    setSelectedDescription(description);
    setPreviewDialogOpen(true);
  };

  // Handle status filter change
  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  // Handle like button click
  const handleLike = (id) => {
    setLikes((prevLikes) => {
      const alreadyLiked = prevLikes[id];
      return {
        ...prevLikes,
        [id]: alreadyLiked ? 0 : 1, // Toggle Like
      };
    });

    // Remove dislike if it exists
    setDislikes((prevDislikes) => ({
      ...prevDislikes,
      [id]: 0, // Reset Dislike if Liked
    }));
  };

  // Handle dislike button click
  const handleDislike = (id) => {
    setDislikes((prevDislikes) => {
      const alreadyDisliked = prevDislikes[id];
      return {
        ...prevDislikes,
        [id]: alreadyDisliked ? 0 : 1, // Toggle Dislike
      };
    });

    // Remove like if it exists
    setLikes((prevLikes) => ({
      ...prevLikes,
      [id]: 0, // Reset Like if Disliked
    }));
  };

  // Comment functionality
  const handleCommentClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setCurrentUser(user);
    setCurrentComment("");
  };

  const handleCommentClose = () => {
    setAnchorEl(null);
    setCurrentComment("");
  };

  const handleCommentSubmit = () => {
    if (!currentComment.trim()) return;
    
    setComments((prevComments) => ({
      ...prevComments,
      [currentUser.id]: [...(prevComments[currentUser.id] || []), currentComment],
    }));
    
    handleCommentClose();
    setSnackbarMessage(`Message sent to ${currentUser.name}!`);
    setSnackbarOpen(true);
  };

  // Handle share button click
  const handleShare = (title, description) => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: window.location.href,
      })
      .then(() => setSnackbarMessage("Content shared successfully!"))
      .catch((error) => setSnackbarMessage("Error sharing content: " + error));
    } else {
      setSnackbarMessage("Web Share API is not supported in your browser.");
    }
    setSnackbarOpen(true);
  };

  // Handle delete button click
  const handleDelete = (id) => {
    setRowsData((prevRows) => prevRows.filter((row, idx) => idx !== id));
    if (onDelete) {
      onDelete(id);
    }
    setSnackbarMessage("Content deleted!");
    setSnackbarOpen(true);
  };

  // Rejection functionality
  const handleRejectionDialogOpen = (id) => {
    setSelectedRowId(id);
    setRejectionDialogOpen(true);
  };

  const handleRejectionDialogClose = () => {
    setRejectionDialogOpen(false);
    setRejectionReason("");
    setOtherReason("");
  };

  const handleRejectionReasonChange = (event) => {
    setRejectionReason(event.target.value);
  };

  const handleOtherReasonChange = (event) => {
    setOtherReason(event.target.value);
  };

  const handleRejectionSubmit = () => {
    if (rejectionReason === "Other" && !otherReason) {
      setSnackbarMessage("Please provide a reason for rejection.");
      setSnackbarOpen(true);
      return;
    }
    
    const reason = rejectionReason === "Other" ? otherReason : rejectionReason;
    
    // Create a new array with updated status to avoid mutation issues
    const updatedRows = [...rowsData];
    updatedRows[selectedRowId] = { 
      ...updatedRows[selectedRowId], 
      status: "Rejected",
      rejectionReason: reason
    };
    
    setRowsData(updatedRows);
    setSnackbarMessage(`Content rejected. Reason: ${reason}`);
    setSnackbarOpen(true);
    handleRejectionDialogClose();
  };

  // Filter rows by status
  const filteredRows = statusFilter === "All" 
    ? rowsData 
    : rowsData.filter(row => row.status === statusFilter);

  return (
    <Box sx={{ 
      padding: isMobile ? 1 : 3, 
      backgroundColor: "#f8f9fa",
      borderRadius: 2,
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
    }}>
      {/* Status Selection - Responsive Grid */}
      <Grid container spacing={1} sx={{ mb: 3, justifyContent: "center" }}>
        {["All", "Posted", "Verified", "Pending", "Rejected"].map((status) => (
          <Grid item key={status}>
            <Badge 
              badgeContent={statusCounts[status] || 0} 
              color="error"
              sx={{ "& .MuiBadge-badge": { fontSize: "0.7rem" } }}
            >
              <Button
                variant={statusFilter === status ? "contained" : "outlined"}
                color={statusFilter === status ? "primary" : "inherit"}
                onClick={() => handleStatusChange(status)}
                size={isMobile ? "small" : "medium"}
                sx={{ 
                  minWidth: isMobile ? '70px' : '100px',
                  borderRadius: "20px",
                  boxShadow: statusFilter === status ? 3 : 0,
                  transition: "all 0.3s ease"
                }}
              >
                {status}
              </Button>
            </Badge>
          </Grid>
        ))}
      </Grid>

      {/* Table or Mobile Cards */}
      {isMobile ? (
        // Mobile Card View
        <Box>
          {filteredRows.length > 0 ? (
            filteredRows.map((row, index) => (
              <Card key={index} sx={{ mb: 2, borderRadius: 2, overflow: "hidden", boxShadow: 2 }}>
                <Box sx={{ p: 2, display: "flex", alignItems: "center", backgroundColor: "#f5f5f5" }}>
                  <img
                    src={row.image}
                    alt="Preview"
                    style={{ width: 60, height: 60, borderRadius: "8px", objectFit: "cover" }}
                    onClick={() => handleImageClick(row.image, row.title, row.description)}
                  />
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">{row.title}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>{row.description}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ 
                          fontSize: "0.7rem",
                          padding: "2px 8px",
                          backgroundColor: 
                            row.status === "Posted" ? "#ff9800" : 
                            row.status === "Verified" ? "#4caf50" : 
                            row.status === "Rejected" ? "#f44336" : 
                            "#3f51b5", 
                          color: "#fff",
                          mr: 1
                        }}
                      >
                        {row.status}
                      </Button>
                      <Typography variant="caption">User: {row.user.name}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ display: "flex", justifyContent: "space-around", p: 1, borderTop: "1px solid #eee" }}>
                  <IconButton size="small" color="primary" onClick={() => handleLike(index)}>
                    <Favorite fontSize="small" />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>{likes[index] || 0}</Typography>
                  </IconButton>
                  <IconButton size="small" color="secondary" onClick={() => handleDislike(index)}>
                    <ThumbDown fontSize="small" />
                    <Typography variant="caption" sx={{ ml: 0.5 }}>{dislikes[index] || 0}</Typography>
                  </IconButton>
                  <IconButton size="small" onClick={(event) => handleCommentClick(event, row.user)}>
                    <Comment fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleShare(row.title, row.description)}>
                    <Share fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                    <Delete fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="warning" 
                    onClick={() => handleRejectionDialogOpen(index)}
                    disabled={row.status === "Rejected"}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
            ))
          ) : (
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
              <Typography variant="body1">No content found matching the selected filter</Typography>
            </Paper>
          )}
        </Box>
      ) : (
        // Desktop Table View
<TableContainer 
  component={Paper} 
  sx={{ 
    borderRadius: 3, 
    boxShadow: 4, 
    overflow: "hidden", 
    border: "1px solid #e0e0e0"
  }}
>
  <Table>
    <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
      <TableRow>
        {["Title", "Description", "Preview", "User Details", "Status", "Actions"].map((header) => (
          <TableCell key={header} sx={{ fontWeight: "bold", color: "#0d47a1", fontSize: "1rem" }}>
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredRows.length > 0 ? (
        filteredRows.map((row, index) => (
          <TableRow 
            key={index} 
            sx={{ 
              "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
              "&:hover": { backgroundColor: "#f1f8ff" },
              transition: "background-color 0.2s ease"
            }}
          >
            <TableCell>{row.title}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell>
              <img
                src={row.image}
                alt="Preview"
                style={{ 
                  width: 60, 
                  height: 60, 
                  cursor: "pointer", 
                  borderRadius: "12px", 
                  objectFit: "cover",
                  border: "3px solid white"  // White border added
                }}
                onClick={() => handleImageClick(row.image, row.title, row.description)}
              />
            </TableCell>
            <TableCell>
              <Typography variant="body2"><strong>User ID:</strong> {row.user.id}</Typography>
              <Typography variant="body2"><strong>User Name:</strong> {row.user.name}</Typography>
              <Typography variant="body2"><strong>Role:</strong> {row.user.role}</Typography>
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                size="small"
                sx={{ 
                  backgroundColor: 
                    row.status === "Posted" ? "#ff9800" : 
                    row.status === "Verified" ? "#4caf50" : 
                    row.status === "Rejected" ? "#f44336" : 
                    "#3f51b5", 
                  color: "#fff",
                  fontWeight: "bold",
                  boxShadow: 2,
                  "&:hover": { opacity: 0.9 }
                }}
              >
                {row.status}
              </Button>
              {row.status === "Rejected" && row.rejectionReason && (
                <Typography variant="caption" sx={{ mt: 1, color: "text.secondary" }}>
                  Reason: {row.rejectionReason}
                </Typography>
              )}
            </TableCell>
            <TableCell>
              {/* Actions in a Single Row */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "nowrap" }}>
                <IconButton size="small" color="primary" onClick={() => handleLike(index)}>
                  <Favorite />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>{likes[index] || 0}</Typography>
                </IconButton>
                <IconButton size="small" color="secondary" onClick={() => handleDislike(index)}>
                  <ThumbDown />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>{dislikes[index] || 0}</Typography>
                </IconButton>
                <IconButton size="small" onClick={(event) => handleCommentClick(event, row.user)}>
                  <Comment />
                </IconButton>
                <IconButton size="small" onClick={() => handleShare(row.title, row.description)}>
                  <Share />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                  <Delete />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="warning" 
                  onClick={() => handleRejectionDialogOpen(index)}
                  disabled={row.status === "Rejected"}
                >
                  <Close />
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={6} align="center">
            <Typography variant="body1">No content found matching the selected filter</Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

      )}

      {/* Preview Dialog */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={() => setPreviewDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 2,
            overflow: "hidden"
          } 
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: "#f5f5f5", 
          borderBottom: "1px solid #e0e0e0",
          fontWeight: "bold"
        }}>
          {selectedTitle}
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 1 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedDescription}
          </Typography>
          <Card sx={{ overflow: "hidden", borderRadius: 2, boxShadow: 3 }}>
            <CardMedia 
              component="img" 
              image={selectedImage} 
              alt="Expanded Preview"
              sx={{ 
                height: isMobile ? 200 : 400,
                objectFit: "cover"
              }}
            />
          </Card>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <Button 
            onClick={() => setPreviewDialogOpen(false)}
            variant="contained"
            sx={{ borderRadius: 20 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog 
        open={rejectionDialogOpen} 
        onClose={handleRejectionDialogClose}
        PaperProps={{ 
          sx: { 
            borderRadius: 2,
            overflow: "hidden",
            maxWidth: isMobile ? '95%' : '500px'
          } 
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: "#f44336", 
          color: "white",
          fontWeight: "bold"
        }}>
          Why do you want to reject this content?
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 1 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select a reason</FormLabel>
            <RadioGroup
              aria-label="rejection-reason"
              name="rejection-reason"
              value={rejectionReason}
              onChange={handleRejectionReasonChange}
            >
              <FormControlLabel value="Inappropriate Content" control={<Radio />} label="Inappropriate Content" />
              <FormControlLabel value="Low Quality" control={<Radio />} label="Low Quality" />
              <FormControlLabel value="Spam" control={<Radio />} label="Spam" />
              <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>
          {rejectionReason === "Other" && (
            <TextField
              label="Please specify"
              multiline
              rows={2}
              fullWidth
              value={otherReason}
              onChange={handleOtherReasonChange}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <Button 
            onClick={handleRejectionDialogClose}
            variant="outlined"
            sx={{ borderRadius: 20 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRejectionSubmit} 
            color="error"
            variant="contained"
            sx={{ borderRadius: 20 }}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Comment Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCommentClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: { borderRadius: 2, boxShadow: 3 }
        }}
      >
        <Box sx={{ p: 2, width: isMobile ? 280 : 300 }}>
          <Typography variant="subtitle1"><strong>User ID:</strong> {currentUser?.id}</Typography>
          <Typography variant="subtitle1"><strong>User Name:</strong> {currentUser?.name}</Typography>

          <TextField
            label="Enter your message"
            multiline
            rows={2}
            fullWidth
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<Send />}
              onClick={handleCommentSubmit}
              sx={{ borderRadius: 20 }}
            >
              Send
            </Button>
            <Button
              variant="outlined"
              onClick={handleCommentClose}
              sx={{ borderRadius: 20 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContentTable;