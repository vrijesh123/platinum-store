import { createTheme } from "@mui/material";


export const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    // This affects the root container of the TextField
                    // Add your custom global styling here
                    // For example, a global light-gray background and rounded corners:

                    borderRadius: "4px",
                    // Add spacing or margins if desired
                    // marginBottom: "16px",
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    // This targets the actual input element inside Outlined variants.
                    // You can define border styling, focus states, etc.
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #E6E6E6", // Example focus color
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                        border: "1px solid #E6E6E6", // Example focus color
                    },
                },
                input: {
                    // This targets the text inside the input
                    padding: "10px",
                    // Change font or color if you want:
                    fontSize: "1rem",
                    backgroundColor: "transparent",
                    color: "#121212",
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: "lightgrey", // This changes the color of the visibility icon
                },
            },
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    // For filled input variants if you use them
                    backgroundColor: "#transparent",
                    borderRadius: "4px",
                    "&.Mui-focused": {
                        backgroundColor: "#transparent",
                    },
                },
                input: {
                    padding: "10px",
                    fontSize: "1rem",
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    // This can apply to all base input styles, including select, etc.
                    padding: 0,
                    fontSize: "1rem",
                    backgroundColor: "#transparent",
                    color: "#121212",
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    // For all select inputs
                    backgroundColor: "#fafafa",
                    borderRadius: "4px",
                },
                icon: {
                    color: "#333",
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    // Style checkboxes globally
                    color: "#3f51b5",
                    "&.Mui-checked": {
                        color: "#3f51b5",
                    },
                },
            },
        },
        MuiRadio: {
            styleOverrides: {
                root: {
                    // Style radio buttons globally
                    color: "#3f51b5",
                    "&.Mui-checked": {
                        color: "#3f51b5",
                    },
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    // Style switches globally
                    color: "#999",
                    "&.Mui-checked": {
                        color: "#3f51b5",
                    },
                },
                track: {
                    backgroundColor: "#ccc",
                    ".Mui-checked + &": {
                        backgroundColor: "#3f51b5",
                    },
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    // This targets the root element of the Autocomplete
                    // and from there, we can nest selectors to target inner elements.
                    "& .MuiAutocomplete-tag": {
                        // This specifically targets the chips inside the Autocomplete.
                        backgroundColor: "#00000", // Dark background for the chips
                        borderRadius: "5px", // Rounded corners
                        border: "1px solid #777777", // A subtle border
                        color: "#eeeeee", // Light text for readability against dark background
                        // You can also target inner parts of the chip:
                        "& .MuiChip-label": {
                            padding: "0 8px", // Adjust spacing inside the label
                            fontSize: "0.9rem", // Slightly adjust font size if desired
                        },
                        "& .MuiChip-deleteIcon": {
                            color: "#eeeeee", // Make the delete icon match the text color
                        },
                    },
                },
                inputRoot: {
                    fontSize: "1rem",
                },
                input: {
                    padding: "10px",
                    fontSize: "1rem",
                },
            },
        },
        // MuiMenuItem: {
        //     styleOverrides: {
        //         root: {
        //             color: "white",
        //             "&.Mui-selected": {
        //                 backgroundColor: "#7A5CFA", // purple
        //                 color: "white",
        //             },
        //             "&.Mui-selected:hover": {
        //                 backgroundColor: "#7A5CFA",
        //             },
        //             "&:hover": {
        //                 backgroundColor: "#7A5CFA",
        //             },
        //         },
        //     },
        // },
        MuiPaper: {
            styleOverrides: {
                root: {
                    // This ensures the dropdown menu has black background
                },
            },
        },
        MuiPickersDay: {
            styleOverrides: {
                root: {
                    color: "white",
                    "&.Mui-selected": {
                        backgroundcolor: "#121212",
                        color: "white",
                    },
                    "&:hover": {
                        backgroundcolor: "#121212",
                    },
                },
            },
        },
        MuiPickersDay: {
            styleOverrides: {
                root: {
                    color: "white", // Default text color for dates
                    "&.Mui-selected": {
                        backgroundColor: "#7A5CFA", // Purple for selected date
                        color: "white",
                    },
                    "&.MuiPickersDay-today": {
                        border: "1px solid #7A5CFA", // Optional: highlight today
                    },
                    "&:hover": {
                        backgroundColor: "#7A5CFA",
                        color: "white",
                    },
                },
            },
        },
        MuiDayCalendar: {
            styleOverrides: {
                weekDayLabel: {
                    color: "white", // Weekday names (Sun, Mon, etc.)
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: "white", // Also targets header month/year text
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: "white", // Arrow icons in calendar header
                },
            },
        },

        // Add more overrides as needed for other input types
    },


});