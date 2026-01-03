import React, { useState, useRef, useEffect } from 'react';
import {
  Pencil,
  Eye,
  Trash2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  X,
  Clock,
  Calendar,
  Bell,
} from 'lucide-react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

// Toolbar Button Component
const ToolbarButton = ({ icon: Icon, onClick, active, title }) => (
  <Tooltip title={title}>
    <IconButton
      onClick={onClick}
      sx={{
        p: 1,
        borderRadius: 1,
        bgcolor: active ? 'grey.200' : 'transparent',
        '&:hover': { bgcolor: 'grey.800' },
        color: '#f1f1f1',
      }}
    >
      <Icon size={16} />
    </IconButton>
  </Tooltip>
);

// Schedule Ticker Component - Updated to properly handle scheduled content
const ScheduleTicker = ({ contents = [], setContents }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState(null);
  const tickerRef = useRef(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check for content that should be published
  // Inside ScheduleTicker useEffect
useEffect(() => {
  if (!Array.isArray(contents)) return;

  // Get current timestamp for comparison
  const currentTimestamp = currentTime.getTime();

  // Loop through all scheduled content items
  contents.forEach(item => {
    if (
      item.status === 'Scheduled' && 
      item.scheduledDate && 
      !item.completed
    ) {
      const scheduledTimestamp = new Date(item.scheduledDate).getTime();
      
      // Check if this item is due
      if (scheduledTimestamp <= currentTimestamp) {
        console.log('Publishing scheduled content:', item.title);
        
        // Use the state update function properly
        setContents(prevContents => 
          prevContents.map(contentItem => 
            contentItem.id === item.id 
              ? { ...contentItem, status: 'Published', completed: true }
              : contentItem
          )
        );
        
        // Show alert for this item
        setAlertContent(item);
        setShowAlert(true);
      }
    }
  });
}, [currentTime]); // Remove contents from dependency to avoid infinite loops

  // Animation effect for ticker
  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;
  
    // Define the MutationObserver callback
    const observerCallback = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // Handle node insertion or removal
          console.log('DOM nodes added or removed:', mutation.addedNodes, mutation.removedNodes);
        }
      }
    };
  
    // Create a MutationObserver instance
    const observer = new MutationObserver(observerCallback);
  
    // Start observing the ticker element for child node changes
    observer.observe(ticker, {
      childList: true, // Observe direct child nodes
      subtree: true,   // Observe all descendants
    });
  
    // Cleanup the observer on component unmount
    return () => observer.disconnect();
  }, [contents]);

  // Filter upcoming scheduled content
  const upcomingContent = Array.isArray(contents)
    ? contents
        .filter(
          (item) =>
            item.status === 'Scheduled' &&
            item.scheduledDate &&
            new Date(item.scheduledDate) > currentTime &&
            !item.completed
        )
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    : [];

  if (upcomingContent.length === 0) {
    return null;
  }

  return (
    <div className="schedule-ticker">
      <div className="ticker-header">
        <Calendar size={16} />
        <span>Upcoming Publications</span>
      </div>

      <div className="ticker-container">
        <div className="ticker-wrapper">
          <div ref={tickerRef} className="ticker-content">
            {upcomingContent.map((content) => {
              const timeRemaining = Math.max(0, new Date(content.scheduledDate) - currentTime);
              const minutes = Math.floor(timeRemaining / 60000);
              const seconds = Math.floor((timeRemaining % 60000) / 1000);
              const isUrgent = timeRemaining < 30000; // Less than 30 seconds

              return (
                <div
                  key={content.id}
                  className={`ticker-card ${isUrgent ? 'urgent' : ''}`}
                >
                  <div className="card-title">{content.title}</div>
                  <div className="card-time">
                    <Clock size={12} />
                    <span>
                      {minutes}m {seconds}s until publish
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showAlert && alertContent && (
        <div className="publish-alert">
          <Bell size={18} />
          <div className="alert-content">
            <div className="alert-title">Content Published!</div>
            <div className="alert-message">
              "{alertContent.title}" has been published.
            </div>
          </div>
          <button className="alert-close" onClick={() => setShowAlert(false)}>
            ×
          </button>
        </div>
      )}

      <style jsx="true">{`
        .schedule-ticker {
          margin-top: 20px;
          padding: 10px;
          background-color: #1a1a1a;
          border-radius: 4px;
          overflow: hidden;
        }

        .ticker-header {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #f1f1f1;
          margin-bottom: 10px;
        }

        .ticker-container {
          position: relative;
          overflow: hidden;
          height: 80px;
        }

        .ticker-wrapper {
          overflow: hidden;
        }

        .ticker-content {
          display: inline-flex;
          gap: 16px;
          padding: 10px 0;
        }

        .ticker-card {
          min-width: 200px;
          background-color: #2d2d2d;
          border: 1px solid #444;
          border-radius: 4px;
          padding: 10px;
          color: #f1f1f1;
        }

        .ticker-card.urgent {
          border-color: #ff5722;
          background-color: rgba(255, 87, 34, 0.1);
        }

        .card-title {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .card-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: #aaa;
        }

        .urgent .card-time {
          color: #ff5722;
        }

        .publish-alert {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #4caf50;
          color: white;
          padding: 16px;
          border-radius: 4px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }

        .alert-content {
          flex: 1;
        }

        .alert-title {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .alert-close {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const ContentEditor = () => {
  const [contents, setContents] = useState([
    {
      id: 1,
      title: 'React Hooks Guide',
      type: 'Article',
      status: 'Published',
      category: 'React',
      content: '<h1>React Hooks Guide</h1><p>This is a guide about React Hooks.</p>',
      completed: true,
    },
    {
      id: 2,
      title: 'Material UI Components',
      type: 'Tutorial/Guide',
      status: 'Draft',
      category: 'UI/UX',
      content: '<h1>Material UI Components</h1><p>Learn about Material UI.</p>',
      completed: false,
    },
    {
      id: 3,
      title: 'Upcoming Webinar',
      type: 'Webinar/Live',
      status: 'Scheduled',
      category: 'Events',
      content: '<h1>Upcoming Webinar</h1><p>Join us for an exciting event.</p>',
      scheduledDate: '2025-03-15T14:30:00',
      completed: false,
    },
  ]);

  const [showEditor, setShowEditor] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUploadedFile({
        name: file.name,
        url: fileUrl,
        type: file.type,
      });
    }
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setSelectedCard(content.type);
    setShowCreateNew(true);

    // If there's a media URL, set the uploaded file
    if (content.mediaUrl) {
      setUploadedFile({
        name: 'Current Media',
        url: content.mediaUrl,
        type: content.mediaType,
      });
    }

    // Wait for the edit form to be rendered, then set content in editor
    setTimeout(() => {
      const titleField = document.getElementById('content-title');
      if (titleField) {
        titleField.value = content.title;
      }

      if (editorRef.current) {
        editorRef.current.innerHTML = content.content;
      }

      // Set date and time if scheduled
      if (content.scheduledDate) {
        const dateObj = new Date(content.scheduledDate);
        const dateField = document.getElementById('content-date');
        const timeField = document.getElementById('content-time');

        if (dateField) {
          const formattedDate = dateObj.toISOString().split('T')[0];
          dateField.value = formattedDate;
        }

        if (timeField) {
          const hours = String(dateObj.getHours()).padStart(2, '0');
          const minutes = String(dateObj.getMinutes()).padStart(2, '0');
          timeField.value = `${hours}:${minutes}`;
        }
      }
    }, 100);
  };

  const handleSave = (status) => {
    if (!document.getElementById('content-title').value.trim()) {
      alert('Please enter a title for your content');
      return;
    }

    const dateValue = document.getElementById('content-date')?.value;
    const timeValue = document.getElementById('content-time')?.value;
    let scheduledDate = null;

    if (status === 'Scheduled' && dateValue && timeValue) {
      scheduledDate = `${dateValue}T${timeValue}:00`;
    }

    const newContent = {
      id: editingContent?.id || Date.now(),
      title: document.getElementById('content-title').value,
      type: selectedCard,
      status: status,
      category: editingContent?.category || 'General',
      content: editorRef.current?.innerHTML || '',
      mediaUrl: uploadedFile?.url || editingContent?.mediaUrl || '',
      mediaType: uploadedFile?.type || editingContent?.mediaType || '',
      lastModified: new Date().toISOString(),
      scheduledDate: scheduledDate,
      completed: status === 'Published', // Mark as completed if published
    };

    setContents((prev) =>
      editingContent
        ? prev.map((item) => (item.id === editingContent.id ? newContent : item))
        : [newContent, ...prev] // Add new content at the beginning of the array
    );

    setShowCreateNew(false);
    setSelectedCard(null);
    setEditingContent(null);
    setUploadedFile(null);
  };

  // FIXED Schedule Button Function
  const handleScheduleContent = () => {
    // Get title and validate
    const titleValue = document.getElementById('content-title')?.value;
    if (!titleValue || titleValue.trim() === '') {
      alert('Please enter a title for your content');
      return;
    }

    // Get date and time values and validate

    // Get date and time values and validate
    const dateValue = document.getElementById('content-date')?.value;
    const timeValue = document.getElementById('content-time')?.value;

    if (!dateValue || !timeValue) {
      alert('Please select both date and time to schedule content');
      return;
    }

    // Create a Date object from the input values
    const scheduledDateTime = new Date(`${dateValue}T${timeValue}:00`);


    // Validate the date
    if (isNaN(scheduledDateTime.getTime())) {
      alert('Invalid date or time format');
      return;
    }

    // Compare with current time
    const currentDateTime = new Date();
    if (scheduledDateTime <= currentDateTime) {
      if (!confirm('The scheduled time is in the past or present. Content will be published immediately. Do you want to proceed?')) {
        return;
      }
    }

    // Format the date properly for storage
    const formattedScheduledDate = scheduledDateTime.toISOString();

    // Create the content object
    const newContent = {
      id: editingContent?.id || Date.now(),
      title: titleValue,
      type: selectedCard,
      status: 'Scheduled',
      category: editingContent?.category || 'General',
      content: editorRef.current?.innerHTML || '',
      mediaUrl: uploadedFile?.url || editingContent?.mediaUrl || '',
      mediaType: uploadedFile?.type || editingContent?.mediaType || '',
      lastModified: new Date().toISOString(),
      scheduledDate: formattedScheduledDate,
      completed: false // Not completed yet since it's scheduled
    };

    // Update the content state
    setContents((prev) =>
      editingContent
        ? prev.map((item) => (item.id === editingContent.id ? newContent : item))
        : [newContent, ...prev]
    );

    // Reset form state
    setShowCreateNew(false);
    setSelectedCard(null);
    setEditingContent(null);
    setUploadedFile(null);

    // Alert the user (optional)
    console.log('Content scheduled successfully:', newContent);
  };

  const confirmDelete = () => {
    setContents(prev => prev.filter(item => item.id !== contentToDelete.id));
    setShowDeleteDialog(false);
    setContentToDelete(null);
  };

  const handleDelete = (content) => {
    setContentToDelete(content);
    setShowDeleteDialog(true);
  };

  const handlePreview = (content) => {
    setPreviewContent(content);
    setShowPreview(true);
  };

  const handleCardClick = (cardType) => {
    setSelectedCard(cardType);
  };

  const handleCancel = () => {
    setShowCreateNew(false);
    setSelectedCard(null);
    setEditingContent(null);
    setUploadedFile(null);
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto', position: 'relative', bgcolor: '#0f0f0f', color: '#ffffff' }}>
      {/* Main Content */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#0f0f0f', color: '#ffffff' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' }, // Change to row on small and larger screens
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between', // Space between items
            mb: 3
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Content Editor
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' }, // Change to column on extra small screens
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: { xs: 'flex-start', sm: 'flex-end' }
            }}
          >
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              size="small"
              sx={{
                minWidth: 150,
                color: '#ffffff',
                '.MuiSelect-icon': { color: '#ffffff' },
                '.MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' }
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: '#1e1e1e',
                    color: '#ffffff',
                    '& .MuiMenuItem-root': {
                      '&:hover': {
                        bgcolor: '#333333'
                      },
                      '&.Mui-selected': {
                        bgcolor: '#444444',
                        '&:hover': {
                          bgcolor: '#555555'
                        }
                      }
                    }
                  }
                }
              }}
            >
              <MenuItem value="all">All Content</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
            </Select>
            <Button
              variant="contained"
              onClick={() => setShowCreateNew(true)}
            >
              Create New
            </Button>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#ffffff' }}>Title</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Type</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Status</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Category</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contents
                .filter(item => filter === 'all' || item.status.toLowerCase() === filter.toLowerCase())
                .map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ color: '#ffffff' }}>{item.title}</TableCell>
                    <TableCell sx={{ color: '#ffffff' }}>{item.type}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        sx={{
                          bgcolor: item.status === 'Published' ? 'success.light' :
                            item.status === 'Draft' ? 'info.light' :
                              'warning.light',
                          color: '#ffffff',
                        }}
                      />
                      {item.status === 'Scheduled' && item.scheduledDate && (
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: '#ffffff' }}>
                          {new Date(item.scheduledDate).toLocaleString()}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#ffffff' }}>{item.category}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleEdit(item)}
                            sx={{ color: 'primary.main' }}
                          >
                            <Pencil size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Preview">
                          <IconButton
                            onClick={() => handlePreview(item)}
                            sx={{ color: 'info.main' }}
                          >
                            <Eye size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(item)}
                            sx={{ color: 'error.main' }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Schedule Ticker - FIXED: pass setContents */}
        <ScheduleTicker contents={contents} setContents={setContents} />
      </Paper>

      {/* Create New Overlay */}
      {showCreateNew && (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bgcolor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1200,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'auto'
    }}
  >
    <Paper
      sx={{
        width: '90%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        p: 3,
        bgcolor: '#0f0f0f',
        color: '#f1f1f1',
        borderRadius: 2,
        boxShadow: 5
      }}
    >
      <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
        <IconButton onClick={handleCancel} sx={{ color: '#f1f1f1' }}>
          <X />
        </IconButton>
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        {editingContent ? 'Edit Content' : 'Create New'}
      </Typography>

      {!editingContent && (
        <Grid container spacing={3}>
          {['Article', 'Video', 'Tutorial/Guide', 'Webinar/Live'].map((cardType) => (
            <Grid item xs={12} sm={6} md={3} key={cardType}>
              <Card
                onClick={() => handleCardClick(cardType)}
                sx={{
                  cursor: 'pointer',
                  border: selectedCard === cardType ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  '&:hover': { boxShadow: 3 },
                  bgcolor: selectedCard === cardType ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                  color: '#f1f1f1'
                }}
              >
                <CardContent>
                  <Typography variant="h6" align="center">{cardType}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {selectedCard && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>{selectedCard} Editor</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              id="content-title"
              label="Title"
              fullWidth
              defaultValue={editingContent?.title || ''}
              InputLabelProps={{ style: { color: '#f1f1f1' } }}
              InputProps={{ style: { color: '#f1f1f1' } }}
              sx={{ bgcolor: '#1e1e1e', borderRadius: 1 }}
            />
            {selectedCard === 'Article' && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ bgcolor: '#1e1e1e', color: '#f1f1f1', borderRadius: 1, width: 'auto' }}
                  size="small"
                >
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                </Button>
                {uploadedFile && (
                  <Typography variant="caption" sx={{ color: '#f1f1f1' }}>
                    Uploaded: {uploadedFile.name}
                  </Typography>
                )}
                {editingContent?.mediaUrl && !uploadedFile && (
                  <Typography variant="caption" sx={{ color: '#f1f1f1' }}>
                    Current image: {editingContent.mediaUrl.split('/').pop()}
                  </Typography>
                )}
              </Box>
            )}
            {(selectedCard === 'Video' || selectedCard === 'Tutorial/Guide') && (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ bgcolor: '#1e1e1e', color: '#f1f1f1', borderRadius: 1, width: 'auto' }}
                  size="small"
                >
                  Upload Video
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                </Button>
                {uploadedFile && (
                  <Typography variant="caption" sx={{ color: '#f1f1f1' }}>
                    Uploaded: {uploadedFile.name}
                  </Typography>
                )}
                {editingContent?.mediaUrl && !uploadedFile && (
                  <Typography variant="caption" sx={{ color: '#f1f1f1' }}>
                    Current video: {editingContent.mediaUrl.split('/').pop()}
                  </Typography>
                )}
              </Box>
            )}
            {selectedCard === 'Webinar/Live' && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <Box sx={{
                    position: 'relative',
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid red'
                  }}>
                    <video
                      autoPlay
                      muted
                      loop
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    >
                      <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-typing-on-a-macbook-4831-large.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: 'rgba(255, 0, 0, 0.7)',
                      color: 'white',
                      textAlign: 'center',
                      padding: '2px 0',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}>
                      LIVE
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>Webinar Status</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: 'red',
                          animation: 'pulse 1.5s infinite'
                        }}></Box>
                        <Typography>Broadcasting Live</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>
                        Current viewers: 124
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#aaa' }}>
                        Duration: 00:43:12
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ bgcolor: '#1e1e1e', color: '#f1f1f1', borderRadius: 1, width: 'auto', mt: 2 }}
                  size="small"
                >
                  Change Stream Source
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                </Button>
                <style jsx="true">{`
                  @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                  }
                `}</style>
              </>
            )}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>Description</Typography>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <ToolbarButton icon={Bold} onClick={() => execCommand('bold')} title="Bold" />
                <ToolbarButton icon={Italic} onClick={() => execCommand('italic')} title="Italic" />
                <ToolbarButton icon={Underline} onClick={() => execCommand('underline')} title="Underline" />
                <ToolbarButton icon={AlignLeft} onClick={() => execCommand('justifyLeft')} title="Align Left" />
                <ToolbarButton icon={AlignCenter} onClick={() => execCommand('justifyCenter')} title="Center" />
                <ToolbarButton icon={AlignRight} onClick={() => execCommand('justifyRight')} title="Align Right" />
                <ToolbarButton icon={List} onClick={() => execCommand('insertUnorderedList')} title="Bullet List" />
                <ToolbarButton icon={ListOrdered} onClick={() => execCommand('insertOrderedList')} title="Numbered List" />
              </Box>
              <Box
                ref={editorRef}
                contentEditable
                dangerouslySetInnerHTML={{ __html: editingContent?.content || '' }}
                sx={{ minHeight: '300px', p: 2, outline: 'none', bgcolor: '#1e1e1e', color: '#f1f1f1', borderRadius: 1 }}
              />
            </Box>
            <TextField
              id="content-date"
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ style: { color: '#f1f1f1' }, shrink: true }}
              inputProps={{ style: { color: '#ffffff' } }}
              sx={{
                bgcolor: '#1e1e1e',
                borderRadius: 1,
                '& input::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)'
                },
                maxWidth: '200px'
              }}
            />
            <TextField
              id="content-time"
              label="Time"
              type="time"
              fullWidth
              InputLabelProps={{ style: { color: '#f1f1f1' }, shrink: true }}
              inputProps={{ style: { color: '#ffffff' } }}
              sx={{
                bgcolor: '#1e1e1e',
                borderRadius: 1,
                '& input::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)'
                },
                maxWidth: '200px'
              }}
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel} variant="outlined" sx={{
                color: '#f1f1f1', borderColor: '#f1f1f1',
                fontSize: { xs: '0.60rem', sm: '0.875rem' }, // Smaller font size for xs screens
                padding: { xs: '4px 8px', sm: '6px 16px' }, // Smaller padding for xs screens
                width: { xs: '100%', sm: 'auto' } // Full width on xs screens
              }}>Cancel</Button>
              <Button
                onClick={handleScheduleContent}
                variant="contained"
                sx={{
                  bgcolor: '#ff9800', '&:hover': { bgcolor: '#ed8c00' },
                  fontSize: { xs: '0.60rem', sm: '0.875rem' }, // Smaller font size for xs screens
                  padding: { xs: '4px 8px', sm: '6px 16px' }, // Smaller padding for xs screens
                  width: { xs: '100%', sm: 'auto' } // Full width on xs screens
                }}
              >
                Schedule
              </Button>
              <Button 
                onClick={() => handleSave('Draft')} 
                variant="contained"
                sx={{
                  fontSize: { xs: '0.60rem', sm: '0.875rem' }, // Smaller font size for xs screens
                  padding: { xs: '4px 8px', sm: '6px 16px' }, // Smaller padding for xs screens
                  width: { xs: '100%', sm: 'auto' } // Full width on xs screens
                }}
              >
                Save as Draft
              </Button>
              <Button 
                onClick={() => handleSave('Published')} 
                variant="contained"
                sx={{
                  fontSize: { xs: '0.60rem', sm: '0.875rem' }, // Smaller font size for xs screens
                  padding: { xs: '4px 8px', sm: '6px 16px' }, // Smaller padding for xs screens
                  width: { xs: '100%', sm: 'auto' } // Full width on xs screens
                }}
              >
                Publish
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Paper>
  </Box>
)}
{/* Preview Dialog */}
<Dialog
  open={showPreview}
  onClose={() => setShowPreview(false)}
  maxWidth="md"
  fullWidth
  PaperProps={{
    style: {
      backgroundColor: '#0f0f0f',
      color: '#f1f1f1',
    },
  }}
>
  <DialogTitle sx={{ color: '#f1f1f1' }}>{previewContent?.title}</DialogTitle>
  <DialogContent>
    {previewContent?.mediaUrl && (
      <Box sx={{ mb: 2 }}>
        {previewContent.mediaType?.includes('image') || previewContent.type === 'Article' ? (
          <img
            src={previewContent.mediaUrl}
            alt={previewContent.title}
            style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
          />
        ) : (previewContent.mediaType?.includes('video') || previewContent.type === 'Video' || previewContent.type === 'Tutorial/Guide') ? (
          <video
            width="100%"
            height="300"
            controls
            style={{ backgroundColor: '#000' }}
          >
            <source src={previewContent.mediaUrl} type={previewContent.mediaType} />
            Your browser does not support the video tag.
          </video>
        ) : null}
      </Box>
    )}
    <Box dangerouslySetInnerHTML={{ __html: previewContent?.content }} sx={{ color: '#f1f1f1' }} />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowPreview(false)} variant="contained">Close</Button>
  </DialogActions>
</Dialog>

{/* Delete Dialog */}
<Dialog
  open={showDeleteDialog}
  onClose={() => setShowDeleteDialog(false)}
  PaperProps={{
    style: {
      backgroundColor: '#0f0f0f',
      color: '#f1f1f1',
    },
  }}
>
  <DialogTitle sx={{ color: '#f1f1f1' }}>Delete Content</DialogTitle>
  <DialogContent>
    <Typography sx={{ color: '#f1f1f1' }}>Are you sure you want to delete "{contentToDelete?.title}"?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowDeleteDialog(false)} sx={{ color: '#f1f1f1' }}>Cancel</Button>
    <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
  </DialogActions>
</Dialog>
</Box>
);
};

export default ContentEditor;