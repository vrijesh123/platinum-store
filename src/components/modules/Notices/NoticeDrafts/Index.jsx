import GlobalTable from "@/components/global_components/GlobalTable";
import DeleteConfirmation from "@/components/global_components/utils/DeleteConfirmation";
import PasswordConfirmationDialog from "@/components/global_components/utils/PasswordConfirmationDialog";
import useFetch from "@/hooks/useFetch";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { modes } from "@/utils/commonUtils";
import TableSkeleton from "@/utils/LoadingSkeletons/TableSkeleton";
import { Add } from "@mui/icons-material";
import { Breadcrumbs, Tooltip } from "@mui/material";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const NoticeDrafts = () => {
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
  } = useFetch(tenantAPI, `/api/notice/draft/`);

  const [open, setOpen] = useState(false);
  const [selectedDraft, setselectedDraft] = useState(null);

  const handleDeleteClick = (item) => {
    setselectedDraft(item);
    setOpen(true);
  };

  const handleConfirm = async (password) => {
    console.log("Confirmed with password:", password);
    const pk = selectedDraft?.id;
    try {
      const res = await tenantAPI.secureDelete(
        `/api/notice/draft/?pk=${selectedDraft?.id}`,
        pk,
        password
      );

      toast.success("Draft Deleted Successfully");
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
      const res = await tenantAPI.get(`/api/notice/draft/?notice_type=${term}`);
      const results = res?.results || [];
      setData(results);
      setNextUrl(res?.next);
      setPrevUrl(res?.previous);
      const totalItems = res?.count || 0;
      setTotalItems(totalItems);
      const pageSize = results.length;
      setTotalPages(Math.ceil(totalItems / pageSize));
      setCurrentPage(pageNumber || 1);
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

  const AddCTA = (
    <div className="flex">
      <Link href={`/notices/drafts/letterheads/`}>
        <button className="white-cta">
          <div className="icon-container">
            <img src="/icons/letterhead.svg" alt="" />
          </div>
          Manage Letterheads
        </button>
      </Link>

      <Link href={`/notices/drafts/add`}>
        <button className="black-cta">
          <Add sx={{ fontSize: "22px" }} />
          Add New Draft
        </button>
      </Link>
    </div>
  );

  const columns = [
    {
      key: "notice_type",
      label: "Notice Type",
      sortable: true,
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
        <p>{moment(item?.created_at).format("DD-MMM-YYYY")}</p>
      ),
    },

    // {
    //   key: "modes",
    //   label: "Modes",
    //   render: (_, item) => (
    //     <p style={{ width: "140px", textWrap: "wrap" }}>{modes}</p>
    //   ),
    // },

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

  return (
    <div className="container tenant-container">
      <div className="heading">
        <div role="presentation" className="bread-crumbs">
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <p>Notice Drafts</p>
          </Breadcrumbs>
        </div>

        <div className="title">
          <h4>Manage Notice Drafts</h4>
        </div>
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
        noticeType={selectedDraft?.notice_type}
      />
    </div>
  );
};

export default NoticeDrafts;
