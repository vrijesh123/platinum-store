import FileDropzone from "@/components/global_components/components/FileDropzone";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { getPreviewUrl } from "@/utils/functionUtils";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddLetterHead = () => {
  const tenantAPI = useTenantAPI();

  const [title, setTitle] = useState("");
  const [letterheadFile, setLetterheadFile] = useState(null);
  const [footerFile, setFooterFile] = useState(null);
  const [errors, setErrors] = useState({
    title: null,
    letterheadFile: null,
    footerFile: null,
  });

  const validateForm = () => {
    const newErrors = {
      title: title ? null : "Title is required",
      letterheadFile: letterheadFile ? null : "Letterhead file is required",
      footerFile: footerFile ? null : "Footer file is required",
    };

    setErrors(newErrors);

    // Check if any errors exist
    return !Object.values(newErrors).some((error) => error !== null);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value) {
      setErrors((prev) => ({ ...prev, title: null }));
    }
  };

  useEffect(() => {
    if (letterheadFile) {
      setErrors((prev) => ({ ...prev, letterheadFile: null }));
    }

    if (footerFile) {
      setErrors((prev) => ({ ...prev, footerFile: null }));
    }
  }, [letterheadFile, footerFile]);

  const handleAddLetterhead = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", title);
    formData.append("letter_head", letterheadFile);
    formData.append("letter_footer", footerFile);

    try {
      await tenantAPI.post("/api/notice/letterhead-footer/", formData);

      setTitle("");
      setLetterheadFile(null);
      setFooterFile(null);
      setErrors({
        title: null,
        letterheadFile: null,
        footerFile: null,
      });

      toast.success("Letterhead uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

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
            <Link
              underline="hover"
              color="inherit"
              href="/notices/drafts/letterheads"
            >
              Manage Letterhead - Footer
            </Link>
            <p>Add Letterhead & Footer</p>
          </Breadcrumbs>
        </div>

        <div className="title">
          <h4>Add Notice Drafts</h4>
        </div>
      </div>

      <div className="add-letterhead-container">
        <div className="box-container">
          <div className="input">
            <label>Title </label>
            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={handleTitleChange}
            />
            {errors.title && <div className="error">{errors.title}</div>}
          </div>

          <FileDropzone
            label="Upload Letterhead (Top Header)"
            onFileUpload={setLetterheadFile}
            error={errors?.letterheadFile}
            // previewUrl={getPreviewUrl(letterheadFile)}
          />

          <FileDropzone
            label="Upload Letter Footer (Bottom Section)"
            onFileUpload={setFooterFile}
            error={errors?.footerFile}
          />

          <div className="preview-section">
            <div>
              <label>Letterhead Preview</label>

              <div className="img-container">
                {letterheadFile && (
                  <img
                    src={getPreviewUrl(letterheadFile)}
                    alt="Letterhead Preview"
                    className="preview-img"
                  />
                )}
              </div>
            </div>

            <div>
              <label>Footer Preview</label>

              <div className="img-container">
                {footerFile && (
                  <img
                    src={getPreviewUrl(footerFile)}
                    alt="Footer Preview"
                    className="preview-img"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="actions">
          <button className="black-cta" onClick={handleAddLetterhead}>
            Add Letterhead & Footer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLetterHead;
