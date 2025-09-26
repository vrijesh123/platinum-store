import InfoCard from "@/components/global_components/Cards/InfoCard";
import Drawer from "@/components/global_components/components/Drawer";
import GlobalTable from "@/components/global_components/GlobalTable";
import PasswordConfirmationDialog from "@/components/global_components/utils/PasswordConfirmationDialog";
import useFetch from "@/hooks/useFetch";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import TableSkeleton from "@/utils/LoadingSkeletons/TableSkeleton";
import { Add } from "@mui/icons-material";
import { Breadcrumbs, Menu, MenuItem, Tooltip } from "@mui/material";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import POD from "./POD";

const Notices = () => {
  const router = useRouter();
  const tenantAPI = useTenantAPI();

  const {
    data,
    setData,
    isLoading,
    setIsLoading,
    deleteItem,
    nextUrl,
    setNextUrl,
    prevUrl,
    setPrevUrl,
    currentPage,
    setCurrentPage,
    totalPages,
    setTotalPages,
    setTotalItems,
    totalItems,
    fetchInitialData,
    fetchPageData,
    setFilterParams,
    setFilterEndpoint,
  } = useFetch(tenantAPI, `/api/notice/group/?depth=3&nested=True`);

  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [viewAnchorEl, setviewAnchorEl] = useState(null);
  const [openPOD, setOpenPOD] = useState(false);
  const [openIndividualNotice, setopenIndividualNotice] = useState(false);
  const [openBulkNotice, setopenBulkNotice] = useState(false);

  const handleDeleteClick = (item) => {
    setSelectedGroup(item);
    setOpen(true);
  };

  const handleConfirm = async (password) => {
    const pk = selectedGroup?.id;
    try {
      const res = await tenantAPI.secureDelete(
        `/api/notice/group/?pk=${selectedGroup?.id}`,
        pk,
        password
      );

      toast.success("Notice Group Deleted Successfully");
      fetchInitialData();
      // Handle success
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.detail);
      // Handle error
    }
  };

  const handleSearch = async (term) => {
    try {
    } catch (error) {}
  };

  const handleSort = (key, direction) => {
    const sorted = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setData(sorted);
  };

  const handleViewClick = (event) => {
    setviewAnchorEl(event.currentTarget);
  };

  const handleViewClose = () => {
    setviewAnchorEl(null);
  };

  const AddCTA = (
    <div className="flex">
      <button className="white-cta" onClick={() => setOpenPOD(true)}>
        <div className="icon-container">
          <img src="/icons/letterhead.svg" alt="" />
        </div>
        Upload POD
      </button>

      <button className="black-cta" onClick={handleViewClick}>
        <Add sx={{ fontSize: "24px" }} />
        Add New
      </button>

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
            bgcolor: "#FFFF",
            color: "#121212",
            borderRadius: "5px",
            boxShadow: "0px 1px 5px rgba(0,0,0,0.2)",
            marginTop: "5px",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setopenIndividualNotice(true);
            handleViewClose();
          }}
        >
          Send Individual Notice
        </MenuItem>
        <MenuItem>Send Bulk Notice</MenuItem>
      </Menu>
    </div>
  );

  const columns = [
    {
      key: "notice_type",
      label: "Notice Type",
      render: (_, item) => <p>{item?.notice_type?.notice_type}</p>,
    },
    {
      key: "created_at",
      label: "Created On",
      render: (_, item) => (
        <p>{moment(item?.created_at).format("DD-MMM-YYYY")}</p>
      ),
    },

    {
      key: "updated_at",
      label: "Last Modified",
      render: (_, item) => (
        <p>{moment(item?.updated_at).format("DD-MMM-YYYY")}</p>
      ),
    },

    {
      key: "action",
      label: "Actions",
      render: (_, item) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <Tooltip arrow placement="top" title="Edit">
            {/* <Link href={`/notices/drafts/edit/${item?.id}`}> */}
            <button
              className="edit-icon"
              onClick={() => router.push(`/notices/drafts/edit/${item?.id}`)}
            >
              <img src="/icons/edit.svg" alt="Edit" />
            </button>
            {/* </Link> */}
          </Tooltip>
          <Tooltip arrow placement="top" title="Delete">
            <button
              className="trash-icon"
              onClick={() => handleDeleteClick(item)}
            >
              <img src="/icons/trash.svg" alt="Delete" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  console.log("Notice", isLoading);

  return (
    <div className="container tenant-container">
      <div className="heading">
        <div role="presentation" className="bread-crumbs">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <p>Notices</p>
          </Breadcrumbs>
        </div>

        <div className="title">
          <h4>Notices</h4>
        </div>
      </div>

      <div className="card-grid">
        <InfoCard
          title={"Total Notices Sent"}
          value={"762"}
          icon={"/icons/lock.svg"}
        />

        <InfoCard
          title={"Total Notices Sent"}
          value={"762"}
          icon={"/icons/lock.svg"}
        />

        <InfoCard
          title={"Total Notices Sent"}
          value={"762"}
          icon={"/icons/lock.svg"}
        />
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <GlobalTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          allData={data}
          title={""}
          handleSearch={handleSearch}
          onSort={handleSort}
          onFilter={() => {}}
          pageSize={20}
          totalItems={totalItems}
          currentPage={currentPage}
          fetchPageData={fetchPageData}
          fetchInitialData={fetchInitialData}
          next={nextUrl}
          prev={prevUrl}
          showExportCTA={false}
          headerActions={AddCTA}
        />
      )}

      <Drawer
        open={openPOD}
        setOpen={setOpenPOD}
        icon={"/icons/send.svg"}
        title={"Upload POD"}
      >
        <POD />
      </Drawer>

      <Drawer
        open={openIndividualNotice}
        setOpen={setopenIndividualNotice}
        icon={"/icons/send.svg"}
        title={"Send Individual Notice"}
      >
        frdf
      </Drawer>

      <PasswordConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title={"Are you sure?"}
        message={
          "This action will put the case on hold and temporarily pause all associated proceedings."
        }
        warning={
          "Proceedings will remain paused until manually resumed. This action does not delete any data but will halt all ongoing tasks."
        }
        btnText={"Delete Draft"}
        noticeId="925792922496"
        noticeType="LRN"
      />
    </div>
  );
};

export default Notices;
