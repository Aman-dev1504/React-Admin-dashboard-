import React, { useContext, useState } from "react";
import { AuthContext } from "../Auth/AuthContext";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Icon from "../Assets/fulllogo.png";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { auth } from "../firebaseConfig";
import MainListItems from "../Components/ListItems";
import SignOut from "./SignOut";
import Title from "../Components/Title";
import Home from "../Components/Home";
import ManageAppointment from "../Components/ManageAppointment";
import RequestAccount from "../Components/RequestAccount";
import ManageUser from "../Components/ManageUser";
import ManageFeedback from "../Components/ManageFeedback";
import TeachersEval from "../Components/TeacherEval";
import ManageReviews from "../Components/ManageReviews";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();



export default function Dashboard() {
  const { logout, currentUser } = useContext(AuthContext);
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => setOpen((prev) => !prev);
  const [selectedComponent, setSelectedComponent] = useState("home");
  const handleSignout = () => {
    logout();
    auth.signOut();
  };
  const handleCardClick = (newState) => {
    setSelectedComponent(newState);
  };
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex", fontFamily: "Poppins" }}>
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px",
              backgroundColor: "#F4D03F",
              backgroundImage: "linear-gradient(45deg, #16A085 10%, #F4D03F 100%)",
              color:"#fff" // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <img
              src={Icon} // Replace with the path to your company logo
              alt="Company Logo"
              height="40px" // Set the desired height of the logo
              width="40px" // Set the desired width of the logo
              style={{ marginRight: "10px" }} // Adjust the margin if needed
            />

            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              <Title userName={currentUser?.name} />
            </Typography>

            <SignOut handleSignOut={handleSignout} />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            <MainListItems setSelectedComponent={setSelectedComponent} />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {selectedComponent === "home" && <Home handleCardClick={handleCardClick}/>}
            {selectedComponent === "ManageUser" && <ManageUser />}
            {selectedComponent === "RequestAccount" && <RequestAccount />}
            {selectedComponent === "manage-feedback" && <ManageFeedback />}
            {selectedComponent === "teachers-evaluation" && (
              <TeachersEval />
            )}
            {selectedComponent === "Manage-reviews" && <ManageReviews />}
            {selectedComponent === "Manage-appointment" && <ManageAppointment />}
          </Container>
          
        </Box>
      </Box>
    </ThemeProvider>
  );
}
