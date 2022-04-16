import PropTypes from "prop-types";
import { createTheme, alpha } from "@mui/material/styles";

const Theme = ({ darkmode }) => {
  let darkTheme = createTheme({
    typography: {
      fontFamily: "'Open Sans', sans-serif",
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      fontSize: 14,
    },
    palette: {
      mode: "dark",
      background: {
        default: "#212121",
        paper: "#090909",
      },
      text: {
        primary: "#fafafa",
      },
      primary: {
        main: "#9595ff",
      },
      tonalOffset: 0.2,
    },
  });

  let lightTheme = createTheme({
    typography: {
      fontFamily: "'Open Sans', sans-serif",
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      fontSize: 14,
    },
    palette: {
      mode: "light",
      background: {
        default: "#f5f5ff",
        paper: "#f5f5ff",
      },
      text: {
        primary: "#000066",
      },
      primary: {
        main: "#000066",
      },
      tonalOffset: 0.2,
    },
  });

  let theme = darkmode ? darkTheme : lightTheme;

  theme = createTheme(theme, {
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
            backgroundColor: "#F5F5F5",
          },
          "*::-webkit-scrollbar-track": {
            borderRadius: "10px",
            WebkitBoxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#F5F5F5",
          },
          "*::-webkit-scrollbar-thumb": {
            borderRadius: "10px",
            WebkitBoxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: `${theme.palette.primary.main}`,
          },
          root: {
            borderRadius: "10px",
          },
        },
      },

      MuiTypography: {
        styleOverrides: {
          h6: {
            fontWeight: 700,
            fontSize: 22,
            textTransform: "uppercase",
          },
          body1: {
            fontWeight: 400,
            fontSize: 16,
          },
          body2: {
            fontWeight: 400,
            fontSize: 14,
          },
        },
      },

      /* MuiAppBar: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            border: 0,
            boxShadow: "none",
            margin: 0,
            borderBottom: "1px solid #d5d2ff",
            color: isDarkMode ? "#fff" : "#000",
            backgroundImage: isDarkMode
              ? "linear-gradient(rgb(18,18,18),rgb(18,18,18))"
              : "linear-gradient(rgb(255,255,255),rgb(255,255,255))",
          },
        },
      }, */

      MuiButton: {
        styleOverrides: {
          outlined: {
            borderRadius: "10px",
            border: "1px solid #d5d2ff",
            padding: "4px",
          },
          root: {},
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            border: "1px solid #d5d2ff",
            color: theme.palette.secondary.main,
            "&:hover": {
              //border: `1px solid ${theme.palette.primary.main}`,
              background: alpha(`${theme.palette.primary.main}`, 0.12),
            },
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            border: "1px solid #d5d2ff",
            boxShadow: "none",
            margin: "2px",
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          root: {
            "& .MuiMenu-paper": {
              boxShadow:
                "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
            },
          },
        },
      },

      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            border: "1px solid #d5d2ff",
            marginTop: "4px",
            "& .MuiDataGrid-iconButtonContainer": {
              margin: "2px",
            },
            "& .MuiDataGrid-columnHeader": {
              "&:focus": {
                outline: "none",
              },
            },
            "& .MuiTablePagination-actions": {
              "& .MuiButtonBase-root": {
                margin: "2px",
              },
              "& .MuiIconButton-root": {
                borderRadius: 0,
                border: 0,
              },
            },
            "& .dg-cell-text": {
              //color: "#FF0000",
            },
          },
        },
      },

      /* MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: isDarkMode
              ? "linear-gradient(rgb(18,18,18),rgb(18,18,18))"
              : "linear-gradient(rgb(255,255,255),rgb(255,255,255))",
          },
        },
      }, */

      /* MuiAccordion: {
        styleOverrides: {
          root: {
            borderStyle: "none",
            backgroundImage: isDarkMode
              ? "linear-gradient(rgb(18,18,18),rgb(18,18,18))"
              : "linear-gradient(rgb(255,255,255),rgb(255,255,255))",
          },
        },
      }, */

      /* MuiAccordionSummary: {
        styleOverrides: {
          root: {
            "&[aria-expanded=true]": {
              backgroundColor: alpha(`${theme.palette.primary.main}`, 0.48),
              borderRadius: "10px",
              margin: "4px",
            },
          },
        },
      }, */

      MuiItemButton: {
        styleOverrides: {
          root: {
            "& .Mui-selected": {
              backgroundColor: alpha(`${theme.palette.primary.main}`, 0.48),
              borderRadius: "10px",
              margin: "4px",
            },
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "14px",
            "& fieldset": {
              border: "1px solid #d5d2ff",
              "& MuiSvgIcon-root": {
                color: `${theme.palette.text.primary}`,
              },
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontWeight: "600",
            fontSize: "14px",
            color: `${theme.palette.text.primary}`,
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            "&:hover": {
              borderRadius: "10px",
              margin: "0px 4px",
              padding: "2px 12px",
            },
            "&[aria-selected=true]": {
              backgroundColor: alpha(`${theme.palette.primary.main}`, 0.48),
              borderRadius: "10px",
              margin: "2px 4px",
              padding: "2px 12px",
            },
            //Currently this crap is not working. Have searched the whole documentation and cant any crap. Let the bull shit stay
            /* "& .Mui-focusVisible": {
              //hex for blue is #039be5
              color: "#039be5",
              backgroundColor: "transparent",
              borderRadius: "10px",
            }, */
          },
        },
      },
    },
  });

  return theme;
};

Theme.propTypes = {
  darkmode: PropTypes.bool,
};

Theme.defaultProps = {
  darkmode: false,
};

export default Theme;
