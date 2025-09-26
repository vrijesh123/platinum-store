import ModalBox from "@/components/global_components/components/ModalBox";
import GlobalTable from "@/components/global_components/GlobalTable";
import PasswordConfirmationDialog from "@/components/global_components/utils/PasswordConfirmationDialog";
import useFetch from "@/hooks/useFetch";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { PAGE_SIZE } from "@/utils/commonUtils";
import TableSkeleton from "@/utils/LoadingSkeletons/TableSkeleton";
import { Add } from "@mui/icons-material";
import { Breadcrumbs, Tooltip } from "@mui/material";
import moment from "moment";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

const LetterHeads = () => {
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
  } = useFetch(tenantAPI, `/api/notice/letterhead-footer/`);

  const [open, setOpen] = useState(false);
  const [selectedHead, setselectedHead] = useState(null);

  const [openView, setOpenView] = useState(false);

  const handleDeleteClick = (item) => {
    setselectedHead(item);
    setOpen(true);
  };

  const handleConfirm = async (password) => {
    console.log("Confirmed with password:", password);
    const pk = selectedHead?.id;
    try {
      const res = await tenantAPI.secureDelete(
        `/api/notice/letter-head/?pk=${selectedHead?.id}`,
        pk,
        password
      );

      toast.success("Letter Head Deleted Successfully");
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
      const res = await tenantAPI.get(
        `/api/notice/letterhead-footer/?name=${term}`
      );
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
    <Link href={`/notices/drafts/letterheads/add`}>
      <button className="black-cta">
        <Add sx={{ fontSize: "22px" }} />
        Add Letterhead & Footer
      </button>
    </Link>
  );

  const columns = [
    {
      key: "name",
      label: "Title",
      sortable: true,
    },
    {
      key: "",
      label: "Preview",
      render: (_, item) => (
        <a
          href="#"
          onClick={() => {
            setselectedHead(item);
            setOpenView(true);
          }}
        >
          View
        </a>
      ),
    },
    {
      key: "created_at",
      label: "Uploaded On",
      render: (_, item) => (
        <p>{moment(item?.created_at).format("DD-MMM-YYYY")}</p>
      ),
    },

    {
      key: "action",
      label: "Actions",
      render: (_, item) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <Tooltip arrow placement="top" title="Edit">
            <Link href={`/notices/drafts/letterheads/${item?.id}`}>
              <button className="edit-icon">
                <img src="/icons/edit.svg" alt="Edit" />
              </button>
            </Link>
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
            <Link underline="hover" color="inherit" href="/notices/drafts">
              Notice Drafts
            </Link>
            <p>Letterhead & Footer</p>
          </Breadcrumbs>
        </div>

        <div className="title">
          <h4>Manage Letterhead & Footer</h4>
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
          pageSize={PAGE_SIZE}
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

      <ModalBox open={openView} setOpen={setOpenView} title={"Preview"}>
        <div className="preview-section">
          <div>
            <label>Letterhead Preview</label>

            <div className="img-container">
              <img
                src={`${tenantAPI?.config.baseURL}${selectedHead?.letter_head}`}
                alt="Letterhead Preview"
                className="preview-img"
              />
            </div>
          </div>

          <div>
            <label>Footer Preview</label>

            <div className="img-container">
              <img
                src={`${tenantAPI?.config.baseURL}${selectedHead?.letter_footer}`}
                alt="Footer Preview"
                className="preview-img"
              />
            </div>
          </div>
        </div>
      </ModalBox>

      <PasswordConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title={"Are you sure?"}
        message={
          "You are about to permanently delete this letterhead & footer:"
        }
        warning={
          "Proceedings will remain paused until manually resumed. This action does not delete any data but will halt all ongoing tasks."
        }
        btnText={"Delete Draft"}
      />
    </div>
  );
};

export default LetterHeads;
