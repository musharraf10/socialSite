import React, { useState } from "react";
import { Button, ToggleButton, ToggleButtonGroup, Badge, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Articles from "./Articles";
import Videos from "./Videos";
import TutorialsGuides from "./TutorialsGuides";
import WebinarsLives from "./WebinarsLives";

const StyledToggleButton = styled(ToggleButton)({
  borderRadius: "8px",
  padding: "10px 20px",
  fontSize: "14px",
  textTransform: "none",
});

const DashBoard = () => {
  const [category, setCategory] = useState("Articles");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleCategoryChange = (event, newValue) => setCategory(newValue);
  const handleStatusChange = (status) => setStatusFilter(status);

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9" }}>
      {/* Category Selection */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, justifyContent: "center" }}>
        {['Articles', 'Videos', 'Tutorials / Guides', 'Webinars / Lives'].map((item) => (
          <StyledToggleButton
            key={item}
            value={item}
            selected={category === item}
            onClick={() => setCategory(item)}
            sx={{
              backgroundColor: category === item ? "#9c27b0" : "#fff",
              color: category === item ? "#fff" : "#000",
              "&:hover": { backgroundColor: "#7b1fa2", color: "#fff" },
            }}
          >
            {item}
          </StyledToggleButton>
        ))}
      </Box>

      {/* Conditionally Render Components */}
      {category === "Articles" && <Articles statusFilter={statusFilter} handleStatusChange={handleStatusChange} />}
      {category === "Videos" && <Videos statusFilter={statusFilter} handleStatusChange={handleStatusChange} />}
      {category === "Tutorials / Guides" && <TutorialsGuides statusFilter={statusFilter} handleStatusChange={handleStatusChange} />}
      {category === "Webinars / Lives" && <WebinarsLives statusFilter={statusFilter} handleStatusChange={handleStatusChange} />}
    </Box>
  );
};

export default DashBoard;