import * as React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Tabs from "@mui/joy/Tabs";
import Tab from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import tabClasses from "@mui/joy/Tab/tabClasses";
import { useQuery } from "@tanstack/react-query";
import { checkAuthStatusAPI } from "../../../APIServices/users/usersAPI";

export default function Settings() {
  const [user, setUser] = React.useState();
  
  const { isLoading, data } = useQuery({ queryKey: ["user-auth"], queryFn: checkAuthStatusAPI });

  if (isLoading) return <div>Loading...</div>;
  
  React.useEffect(() => {
    setUser(data.username);
  }, [data]);

  return (
    <Box sx={{ flex: 1, width: "100%" }}>
      {/* Breadcrumbs */}
      <Box sx={{ px: { xs: 2, md: 6 } }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="sm" />}
        >
          <NavLink to="/subscriber">
            <HomeRoundedIcon />
          </NavLink>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            Settings
          </Typography>
        </Breadcrumbs>
        <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
          {user} profile
        </Typography>
      </Box>

      {/* Tabs for navigation */}
      <Tabs sx={{ bgcolor: "transparent" }}>
        <TabList
          size="sm"
          sx={{
            justifyContent: "left",
            [`&& .${tabClasses.root}`]: {
              fontWeight: "600",
              flex: "initial",
              color: "text.tertiary",
              [`&.${tabClasses.selected}`]: {
                bgcolor: "transparent",
                color: "text.primary",
              },
            },
          }}
        >
          <Tab component={NavLink} to="profilesettings">Profile</Tab>
          <Tab component={NavLink} to="plan">Plan</Tab>
          <Tab component={NavLink} to="billing">Billing</Tab>
          <Tab component={NavLink} to="security">Privacy & Security</Tab>
          <Tab component={NavLink} to="become-creator">Become a Creator</Tab>
          <Tab component={NavLink} to="update-email"></Tab>
        </TabList>
      </Tabs>

      {/* Nested Routes Content */}
      <Box sx={{ maxWidth: "800px", mx: "auto", px: { xs: 2, md: 6 }, py: { xs: 2, md: 3 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}
