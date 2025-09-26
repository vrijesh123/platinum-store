import FileDropzone from "@/components/global_components/components/FileDropzone";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditLetterHead = () => {
  const router = useRouter();
  const { id } = router.query;

  const tenantAPI = useTenantAPI();

  const [title, setTitle] = useState(null);
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
      letterheadFile:
        letterheadFile || existingLetterheadUrl
          ? null
          : "Letterhead file is required",
      footerFile:
        footerFile || existingFooterUrl ? null : "Footer file is required",
    };

    setErrors(newErrors);

    // Check if any errors exist
    return !Object.values(newErrors).some((error) => error !== null);
  };

  const [existingLetterheadUrl, setExistingLetterheadUrl] = useState("");
  const [existingFooterUrl, setExistingFooterUrl] = useState("");

  const getLetterheadPreview = () =>
    letterheadFile
      ? URL.createObjectURL(letterheadFile)
      : `${tenantAPI?.config.baseURL}${existingLetterheadUrl}`;

  const getFooterPreview = () =>
    footerFile
      ? URL.createObjectURL(footerFile)
      : `${tenantAPI?.config.baseURL}${existingFooterUrl}`;

  const fetchLetterHead = async () => {
    try {
      const res = await tenantAPI.get(
        `/api/notice/letterhead-footer/?id_exact=${id}`
      );

      if (res?.results?.length > 0) {
        const data = res?.results?.[0];

        console.log(data);

        setTitle(data?.name);
        setExistingLetterheadUrl(data?.letter_head);
        setExistingFooterUrl(data?.letter_footer);
      }
    } catch (error) {}
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value) {
      setErrors((prev) => ({ ...prev, title: null }));
    }
  };

  useEffect(() => {
    if (letterheadFile || existingLetterheadUrl) {
      setErrors((prev) => ({ ...prev, letterheadFile: null }));
    }

    if (footerFile || existingFooterUrl) {
      setErrors((prev) => ({ ...prev, footerFile: null }));
    }
  }, [letterheadFile, existingLetterheadUrl, existingFooterUrl, footerFile]);

  useEffect(() => {
    if (tenantAPI && id) {
      fetchLetterHead();
    }
  }, [tenantAPI, id]);

  const handleEditLetterhead = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", title);

    if (letterheadFile) {
      formData.append("letter_head", letterheadFile);
    }

    if (footerFile) {
      formData.append("letter_footer", footerFile);
    }

    try {
      await tenantAPI.patch(
        `/api/notice/letterhead-footer/?pk=${id}`,
        formData
      );

      router.push("/notices/drafts/letterheads");

      setErrors({
        title: null,
        letterheadFile: null,
        footerFile: null,
      });
      toast.success("Letterhead updated successfully");
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
            <p>Edit Letterhead & Footer</p>
          </Breadcrumbs>
        </div>

        <div className="title">
          <h4>Edit Letterhead & Footer</h4>
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
                {(letterheadFile || existingLetterheadUrl) && (
                  <img
                    src={getLetterheadPreview()}
                    alt="Letterhead Preview"
                    className="preview-img"
                  />
                )}
              </div>
            </div>

            <div>
              <label>Footer Preview</label>

              <div className="img-container">
                {(footerFile || existingFooterUrl) && (
                  <img
                    src={getFooterPreview()}
                    alt="Footer Preview"
                    className="preview-img"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="actions">
          <button className="black-cta" onClick={handleEditLetterhead}>
            Edit Letterhead & Footer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLetterHead;
