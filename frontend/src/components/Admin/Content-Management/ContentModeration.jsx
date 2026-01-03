import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Modal,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { Bar, Pie } from "react-chartjs-2";
import { styled } from "@mui/system";
import axios from "axios";
import ContentPart from "./ContentModerationSub";
import { getallpostsdata } from "../../../APIServices/posts/postsAPI";
import PostDetailsModal from "./Postdetailmodal";
import Dashboard from "../Dashboard/Dashboard";

const FormContainer = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    padding: "10px",
    form: {
      display: "block",
    },
  },
  [theme.breakpoints.up("md")]: {
    padding: "20px",
    form: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
    },
  },
}));

const ContentForm = () => {
  const [selectedPostinadminpanelcmd, setselectedPostinadminpanelcdm] = useState(null);
  const [publishedContent, setPublishedContent] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getallpostsdata();
      console.log()
      setPublishedContent(data);
    };
    fetchData();
  }, []);

  const handleOpenModalofpostsincmd = (post) => setselectedPostinadminpanelcdm(post);
  const handleCloseModalofpostsincdm = () => setselectedPostinadminpanelcdm(null);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Dashboard/>
      <ContentPart />
      {/* <FormContainer>
        <Typography
          variant="h6"
          sx={{
            width: "100%",
            marginBottom: 2,
            color: "black",
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            padding: "15px 0",
            fontSize: "1.5rem",
          }}
        >
          Published content
        </Typography>

        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={publishedContent.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ marginBottom: 2 }}
        />

        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell align="center"><b>Sl.no</b></TableCell>
                <TableCell align="center"><b>Title</b></TableCell>
                <TableCell align="center"><b>Approved</b></TableCell>
                <TableCell align="center"><b>Publish Date</b></TableCell>
                <TableCell align="center"><b
      style={{
        background: "linear-gradient(to right, #1E3A8A, #3B82F6)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: "24px",
        fontWeight: "bold"
      }}
    >
      Details
    </b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {publishedContent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No content available</TableCell>
                </TableRow>
              ) : (
                publishedContent.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="center">{item.title}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: item.status === "pending" ? "#ff9800" : item.status === "approved" ? "#4CAF50" : "#F44336",
                          color: "#fff",
                        }}
                      >
                        {item.status.toUpperCase()}
                      </Button>
                    </TableCell>
                    <TableCell align="center">{new Date(item.publisheddate).toLocaleDateString("en-GB")}</TableCell>
                    <TableCell align="center">
                      <Button className="contentSubbutton" style={{background: "linear-gradient(to right, #1E3A8A, #3B82F6)", 
                        color: "#ffffff",
                        padding: "10px",
                        border: "1px solid #007bff",
                        cursor: "pointer",
                        borderRadius: "5px",}} color="primary" onClick={() => handleOpenModalofpostsincmd(item)}>
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal open={Boolean(selectedPostinadminpanelcmd)} onClose={handleCloseModalofpostsincdm}>
          <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2 }}>
            {selectedPostinadminpanelcmd && (
              <>
                <Typography variant="h6" gutterBottom>{selectedPostinadminpanelcmd.title}</Typography>
                <Typography>Status: {selectedPostinadminpanelcmd.status.toUpperCase()}</Typography>
                <Typography>Publish Date: {new Date(selectedPostinadminpanelcmd.publisheddate).toLocaleDateString("en-GB")}</Typography>
                <Button onClick={handleCloseModalofpostsincdm} sx={{ mt: 2 }} variant="contained" color="secondary">Close</Button>
              </>
            )}
          </Box>
        </Modal>
      </FormContainer> */}
      <FormContainer>
  {/* Title */}
  <Typography
    variant="h6"
    sx={{
      width: "100%",
      marginBottom: 2,
      color: "#1E3A8A",
      fontWeight: "bold",
      textAlign: "center",
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      padding: "15px 0",
      fontSize: "1.6rem",
      background: "linear-gradient(to right, #1E3A8A, #3B82F6)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    Published Content
  </Typography>

  {/* Pagination - Centered */}
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 2 }}>
    <TablePagination
      rowsPerPageOptions={[5, 10, 15]}
      component="div"
      count={publishedContent.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      labelRowsPerPage="Items Per Page"
      onRowsPerPageChange={handleChangeRowsPerPage}
      sx={{
        "& .MuiTablePagination-toolbar": {
          justifyContent: "center", // Centering the pagination controls
        },
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input": {
          fontSize: "1rem", // Adjust font size
          fontWeight: "bold",
        },
        "& .MuiTablePagination-select": {
          borderRadius: "8px",
          backgroundColor: "#f5f5f5",
          padding: "4px 8px",
        },
      }}
    />
  </Box>

  {/* Table */}
  <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 3, overflow: "hidden" }}>
    <Table>
      <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
        <TableRow>
          {["Sl.no", "Title", "Approved", "Publish Date", "Details"].map((heading, index) => (
            <TableCell key={index} align="center" sx={{ fontWeight: "bold", fontSize: "1rem", color: "#1E3A8A" }}>
              {heading}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      
      <TableBody>
        {publishedContent.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} align="center">No content available</TableCell>
          </TableRow>
        ) : (
          publishedContent.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
            <TableRow 
              key={item._id} 
              sx={{ 
                "&:hover": { backgroundColor: "#f0f7ff", transition: "0.3s" } // Smooth hover effect
              }}
            >{console.log("REF",item.refId)}
              <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
              <TableCell align="center">{item.refId.title || "Unknown"}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: item.status === "pending" ? "#ff9800" : item.status === "approved" ? "#4CAF50" : "#F44336",
                    color: "#fff",
                    fontWeight: "bold",
                    "&:hover": { opacity: 0.8 }
                  }}
                >
                  {item.status.toUpperCase()}
                </Button>
              </TableCell>
              <TableCell align="center" style={{fontSize:16}}>{new Date(item.updatedAt).toLocaleDateString("en-GB")}</TableCell>
              <TableCell align="center">
                <Button
                  className="contentSubbutton"
                  sx={{
                    background: "linear-gradient(to right, #1E3A8A, #3B82F6)",
                    color: "#ffffff",
                    padding: "8px 16px",
                    fontWeight: "bold",
                    border: "1px solid #3B82F6",
                    cursor: "pointer",
                    borderRadius: "6px",
                    transition: "0.3s",
                    "&:hover": { background: "linear-gradient(to right, #3B82F6, #1E3A8A)" }
                  }}
                  onClick={() => handleOpenModalofpostsincmd(item)}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>

  {/* Modal */}
  <Modal open={Boolean(selectedPostinadminpanelcmd)} onClose={handleCloseModalofpostsincdm}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 10,
        p: 4,
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      {selectedPostinadminpanelcmd && (
        <>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            {selectedPostinadminpanelcmd.title}
          </Typography>
          <Typography>Status: <b>{selectedPostinadminpanelcmd.status.toUpperCase()}</b></Typography>
          <Typography>Publish Date: {new Date(selectedPostinadminpanelcmd.updatedAt).toLocaleDateString("en-GB")}</Typography>
          <Button
            onClick={handleCloseModalofpostsincdm}
            sx={{ mt: 2, backgroundColor: "#d32f2f", color: "#fff", "&:hover": { backgroundColor: "#b71c1c" } }}
            variant="contained"
          >
            Close
          </Button>
        </>
      )}
    </Box>
  </Modal>
</FormContainer>

    </>
  );
};

export default ContentForm;
