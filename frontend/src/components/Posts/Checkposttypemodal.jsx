import React from "react";
import { Modal, Button } from "react-bootstrap";
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import ArticleIcon from '@mui/icons-material/Article';
import { useQuery } from "@tanstack/react-query";
import VideocamIcon from '@mui/icons-material/Videocam';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'; 
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import "bootstrap/dist/css/bootstrap.min.css";
import "./checkposttypemodal.css";
import { Link } from "react-router-dom";
import { checkAuthStatusAPI } from "../../APIServices/users/usersAPI";

export default function Checkposttypemodal({
  show,
  onHide,
  contentType,
  handleContentTypeChange,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const getContentIcon = (type) => {
    switch(type) {
      case 'article':
        return <ArticleIcon className="content-icon" style={{ color: '#3B82F6' }} />;
      case 'webinar':
        return <VideocamIcon className="content-icon" style={{ color: '#EF4444' }} />;
      case 'stepbystepguide':
        return <LibraryBooksIcon className="content-icon" style={{ color: '#10B981' }} />;
      // case 'videotutorial':
      //   return <PlayCircleIcon className="content-icon" style={{ color: '#F59E0B' }} />;
      default:
        return <HelpOutlineIcon className="content-icon" style={{ color: '#9CA3AF' }} />;
    }
  };
  
  const isOpenButtonDisabled = contentType === 'selectyourcontent';

  const { isLoading, data,  } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
    refetchOnWindowFocus: true, 
  });
  
    const userRole = data?.role;

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
      className="checkposttypemodal"
      size={isMobile ? "sm" : "md"}
    >
      <Modal.Header closeButton>
        <Modal.Title>Select Content Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          px: { xs: 1, sm: 3 }
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3, 
              textAlign: 'center',
              color: 'text.secondary'
            }}
          >
            Choose the type of content you want to create. Different content types have different formats and features.
          </Typography>
          
          <FormControl 
            fullWidth 
            variant="outlined" 
            className="content-type-select"
            sx={{ maxWidth: '400px' }}
          >
            <InputLabel id="content-type-label">Select Your Content</InputLabel>
            <Select
              labelId="content-type-label"
              id="content-type-select"
              value={contentType}
              onChange={handleContentTypeChange}
              label="Select Your Content"
            >
              <MenuItem value="selectyourcontent" disabled>
                {getContentIcon('selectyourcontent')}
                Select Your Content
              </MenuItem>
              <MenuItem value="article">
                {getContentIcon('article')}
                Articles
              </MenuItem>
              <MenuItem value="webinar">
                {getContentIcon('webinar')}
                Webinar
              </MenuItem>
              <MenuItem value="stepbystepguide">
                {getContentIcon('stepbystepguide')}
                Step By Step guide
              </MenuItem>
              {/* <MenuItem value="videotutorial">
                {getContentIcon('videotutorial')}
                Video Tutorial
              </MenuItem> */}
            </Select>
          </FormControl>
          
          <Box sx={{ 
            mt: 4,
            p: 2,
            bgcolor: '#f0f9ff',
            borderRadius: 2,
            borderLeft: '4px solid #3B82F6',
            width: '100%',
            maxWidth: '400px',
            display: contentType !== 'selectyourcontent' ? 'block' : 'none'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1E3A8A' }}>
              {contentType === 'article' ? 'Article Format' : contentType === 'webinar' ? 'Webinar Format' : ''}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#4B5563' }}>
              {contentType === 'article' 
                ? 'Articles allow you to share in-depth written content with images and formatting options.'
                : contentType === 'webinar' 
                ? 'Webinars let you create and schedule video presentations with registration options.'
                : contentType === 'stepbystepguide'
                ? 'Step-by-step guides help users follow a structured approach with detailed instructions and visuals.'
                : contentType === 'videotutorial'
                ? 'Video tutorials provide hands-on learning through recorded demonstrations and explanations.'
                : ''}
            </Typography>

          </Box>
        </Box>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <Button variant="secondary" className="close-button" onClick={onHide}>
          Cancel
        </Button>
        <Link 
          to={isOpenButtonDisabled ? '#' : `/${userRole}/create-post/${contentType}`}
          style={{ textDecoration: 'none', display: 'block', width: isMobile ? '100%' : 'auto' }}
          onClick={(e) => {
            if (isOpenButtonDisabled) {
              e.preventDefault();
            } else {
              onHide();
            }
          }}
        >
          <Button 
            variant="primary" 
            className="open-button"
            disabled={isOpenButtonDisabled}
            style={{ 
              opacity: isOpenButtonDisabled ? 0.6 : 1,
              cursor: isOpenButtonDisabled ? 'not-allowed' : 'pointer',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            Continue
          </Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}