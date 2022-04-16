import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Theme from "./components/Theme";
import AppBar from "./components/AppBar";
import Home from "./routes/Home";

const Popup = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  const handleOnClick = async (e) => {
    switch (e.currentTarget.id) {
      case "toggle-theme-button":
        setDarkMode(!darkMode);
        break;
      default:
        console.log("No action defined");
    }
  };

  return (
    <ThemeProvider theme={Theme({ darkmode: darkMode })}>
      <CssBaseline />
      <AppBar themeToggleClick={(e) => handleOnClick(e)} />
      <Home />
    </ThemeProvider>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<Popup />);
