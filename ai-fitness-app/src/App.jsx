import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import WelcomePage from "./pages/WelcomePage";
import ActionListPage from "./pages/ActionListPage";
import InfoPage from "./pages/InfoPage";
import CameraPage from "./pages/CameraPage";
import { AppProvider } from "./context/AppContext";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#10B981",
    },
    error: {
      main: "#EF4444",
    },
    background: {
      default: "#F3F4F6",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: "hidden",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Routes>
            {/* The root path always displays the welcome page */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/actionlist" element={<ActionListPage />} />
            <Route path="/pose/:id" element={<InfoPage />} />
            <Route path="/camera/:id" element={<CameraPage />} />
            {/* Other unknown paths redirect to the welcome page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
