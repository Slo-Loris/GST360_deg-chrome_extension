import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import ContentSkeleton from "./components/ContentSkeleton";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Theme from "./components/Theme";
const AppBar = React.lazy(() => import("./components/AppBar"));
const Home = React.lazy(() => import("./routes/Home"));

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
      <Suspense fallback={<ContentSkeleton />}>
        <AppBar themeToggleClick={(e) => handleOnClick(e)} />
        <Home />
      </Suspense>
    </ThemeProvider>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<Popup />);
