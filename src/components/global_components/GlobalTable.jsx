"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DeleteOutline } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/utils/theme";
import moment from "moment";

function GlobalTable({
  columns,
  data = null,
  isLoading,
  pageSize,
  totalItems,
  currentPage,
  fetchPageData,
  fetchInitialData,
  next,
  prev,
  handleSearch,
  showActions = true,
  showView = false,
  headerActions = null,
}) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [viewAnchorEl, setviewAnchorEl] = useState(null);
  const [openView, setopenView] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState(
    columns.filter((col) => col.key !== "action").map((col) => col.key)
  );

  useEffect(() => {
    // Whenever `data` changes, reset `filteredData`
    setFilteredData(data?.results ?? data);
  }, [data]);

  const handleViewClick = (event) => {
    setviewAnchorEl(event.currentTarget);
    setopenView(true);
  };

  const handleViewClose = () => {
    setviewAnchorEl(null);
    setopenView(false); // optional toggle flag
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const CustomPagination = styled(Pagination)(({ theme }) => ({
    "& .MuiPaginationItem-root": {
      color: theme.palette.common.white, // White text color for pagination items
      backgroundColor: "#202020", // Dark background for pagination items
      borderRadius: "8px", // Rounded corners for items
      margin: "0 4px", // Slight spacing between items
      "&:hover": {
        backgroundColor: "#444444", // Darker shade on hover
      },
      "&.Mui-selected": {
        backgroundColor: "#2C2C2C", // Primary color for selected page
        color: theme.palette.common.white, // White text color for selected item
        fontWeight: "bold",
      },
    },
  }));

  // console.log("Global Table", isLoading, data, filteredData);

  return (
    <ThemeProvider theme={theme}>
      <div className="table-container">
        {/* Search and Actions */}
        {showActions && (
          <div className="search-container-wrapper">
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div className="search-container">
                <div className="icon-container">
                  <img src={"/icons/searchIcon.svg"} alt="" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch(e.target.value); // call your function here
                    }
                  }}
                  className="search-input"
                />
              </div>
            </Box>

            <Box
              sx={{
                display: "flex",
              }}
            >
              {headerActions && <>{headerActions}</>}

              {showView && (
                <button
                  className="white-cta"
                  onClick={handleViewClick}
                  style={{
                    marginLeft: "10px",
                    marginRight: "0",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-settings2 lucide-settings-2"
                  >
                    <path d="M20 7h-9"></path>
                    <path d="M14 17H5"></path>
                    <circle cx="17" cy="17" r="3"></circle>
                    <circle cx="7" cy="7" r="3"></circle>
                  </svg>
                  View
                </button>
              )}
            </Box>
          </div>
        )}

        {/* Table Container with Scroll */}
        <div
          style={{
            position: "relative", // Important for positioning the No Data overlay
            overflowX: "auto", // Enables horizontal scrolling
            whiteSpace: "nowrap", // Prevents content from wrapping in table cells
            minHeight: "300px", // Optional: To ensure table height even when empty
          }}
        >
          <table className="table">
            {/* Sets a minimum width for the table */}
            <thead className="table-head">
              <tr>
                {columns
                  ?.filter(
                    (column) =>
                      column.key === "action" ||
                      visibleColumns.includes(column.key)
                  )
                  ?.map((column) => (
                    <th
                      key={column.key}
                      // onClick={() => column.sortable && handleSort(column.key)}
                      style={{
                        cursor: column.sortable ? "pointer" : "default",
                        color: "white",
                        minWidth: column?.minWidth ? column?.minWidth : "none",
                        maxWidth: column?.maxWidth ? column?.maxWidth : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {column.label}
                        {column.sortable &&
                          sortColumn === column.key &&
                          (sortDirection === "asc" ? (
                            <span
                              style={{ marginLeft: "8px", fontSize: "10px" }}
                            >
                              ↑
                            </span>
                          ) : (
                            <span
                              style={{ marginLeft: "8px", fontSize: "10px" }}
                            >
                              ↓
                            </span>
                          ))}
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            {filteredData?.length > 0 ? (
              <tbody className="table-body">
                {filteredData?.map((item, index) => (
                  <tr key={index}>
                    {columns
                      ?.filter(
                        (column) =>
                          column.key === "action" ||
                          visibleColumns.includes(column.key)
                      )
                      ?.map((column) => (
                        <td
                          key={column.key}
                          style={{
                            whiteSpace: "normal", // Allows text wrapping
                            color: "white",
                            minWidth: column?.minWidth
                              ? column.minWidth
                              : "none",
                            maxWidth: column?.maxWidth
                              ? column.maxWidth
                              : "none",
                          }}
                        >
                          {column.render
                            ? column.render(item[column.key], item)
                            : item[column.key]}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            ) : (
              <div className="no-data-overlay">
                <div className="img-container">
                  <img src={"/icons/no-data.svg"} alt="" />
                </div>
                <p>No Data</p>
                <span>There is no data to show you right now</span>
              </div>
            )}
          </table>

          {/* Render No Data Modal */}
          {/* {data?.length <= 0 && (
            <div className="no-data-overlay">
              <div className="img-container">
                <img src={"/icons/no-data.svg"} alt="" />
              </div>
              <p>No Data</p>
              <span>There is no data to show you right now</span>
            </div>
          )} */}
        </div>

        {/* Pagination */}
        {(next || prev) && (
          <div className="pagination-container">
            <span style={{ marginRight: "1rem" }}>
              {/* Displaying the current range of items */}
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
            </span>

            {/* MUI Pagination Component */}
            <CustomPagination
              count={totalPages} // Total number of pages
              page={currentPage} // Current page
              onChange={(event, value) => {
                fetchPageData(value);
              }}
              siblingCount={1}
              boundaryCount={1}
              shape="rounded" // To give rounded corners
            />
          </div>
        )}

        {/* View Menu */}
        <Menu
          anchorEl={viewAnchorEl}
          open={Boolean(viewAnchorEl)}
          onClose={handleViewClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              bgcolor: "#131314",
              color: "#ffffff",
              borderRadius: "10px",
              boxShadow: "0px 4px 20px rgba(0,0,0,1)",
            },
          }}
        >
          <FormGroup sx={{ padding: "10px 15px" }}>
            {columns
              .filter((col) => col.key !== "action")
              .map((col) => (
                <FormControlLabel
                  key={col.key}
                  control={
                    <Checkbox
                      checked={visibleColumns.includes(col.key)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...visibleColumns, col.key]
                          : visibleColumns.filter((key) => key !== col.key);
                        setVisibleColumns(updated);
                      }}
                      sx={{
                        color: "#fff",
                        "&.Mui-checked": {
                          color: "#fff",
                        },
                      }}
                    />
                  }
                  label={col.label}
                  sx={{ color: "#fff" }}
                />
              ))}
          </FormGroup>
        </Menu>
      </div>
    </ThemeProvider>
  );
}

export default GlobalTable;
