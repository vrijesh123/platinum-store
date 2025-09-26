import NoticeDrafts from "@/components/global_components/components/NoticeDrafts";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { Add } from "@mui/icons-material";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddNoticeDraft = () => {
  const tenantAPI = useTenantAPI();

  // State for main notice title
  const [noticeType, setNoticeType] = useState(null);

  // State for sub-categories
  const [subCategories, setSubCategories] = useState([
    {
      title: null,
      drafts: {
        post: null,
        email: null,
        whatsapp: null,
        sms: "-",
      },
    },
  ]);

  const [errors, setErrors] = useState({
    noticeType: null,
    subCategories: [],
  });

  // Validate all fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      noticeType: noticeType ? null : "Draft title is required",
      subCategories: subCategories.map((item) => ({
        title: item.title ? null : "Template title is required",
        drafts: {
          post: item.drafts.post ? null : "Post is required",
          email: item.drafts.email ? null : "Email is required",
          whatsapp: item.drafts.whatsapp ? null : "WhatsApp is required",
          sms: null, // assuming sms is optional
        },
      })),
    };

    setErrors(newErrors);

    // Check if any errors exist
    if (newErrors.noticeType) isValid = false;
    for (const category of newErrors.subCategories) {
      if (
        category.title ||
        category.drafts.post ||
        category.drafts.email ||
        category.drafts.whatsapp
      ) {
        isValid = false;
        break;
      }
    }

    return isValid;
  };

  // Add a new sub-category
  const addSubCategory = () => {
    setSubCategories((prev) => [
      ...prev,
      {
        title: null,
        drafts: {
          post: null,
          email: null,
          whatsapp: null,
          sms: "-",
        },
      },
    ]);
  };

  // Update sub-category title
  const updateSubcategoryTitle = (index, title) => {
    const updated = [...subCategories];
    updated[index].title = title;
    setSubCategories(updated);
  };

  const updateSubcategoryDrafts = (index, newDrafts) => {
    const updated = [...subCategories];
    updated[index].drafts = newDrafts;
    setSubCategories(updated);
  };

  // Remove a sub-category
  const removeSubCategory = (indexToRemove) => {
    if (subCategories.length > 1) {
      setSubCategories((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
    }
  };

  const handleAddTemplate = async (id) => {
    try {
      const requests = subCategories?.map((record) => {
        const payload = {
          notice_type: id,
          name: record?.title,
          post_template: record?.drafts?.post,
          email_template: record?.drafts?.email,
          whatsapp_template: record?.drafts?.whatsapp,
          sms_template: record?.drafts?.sms,
        };

        return tenantAPI.post("/api/notice/template/", payload);
      });

      const responses = await Promise.all(requests);
      console.log("Template responses:", responses);
    } catch (error) {
      console.error("Error in handleAddTemplate:", error);
    }
  };

  const handleAddDraft = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await tenantAPI.post("/api/notice/draft/", {
        notice_type: noticeType,
      });

      await handleAddTemplate(res?.id);

      toast.success("Notice has been successfully added");
      setNoticeType("");
      setSubCategories([
        {
          title: "",
          drafts: {
            post: "",
            email: "",
            whatsapp: "",
            sms: "",
          },
        },
      ]);

      setErrors({
        noticeType: null,
        subCategories: [],
      });
    } catch (error) {
      console.error("Error in handleAddDraft:", error);
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
            <p>Add Notice Drafts</p>
          </Breadcrumbs>
        </div>

        <div className="title">
          <h4>Add New Notice Drafts</h4>
        </div>
      </div>

      <div className="add-notice-draft-container">
        <div className="box-container">
          <div className="input">
            <label>
              Notice Draft Title <span>*</span>
            </label>
            <input
              type="text"
              placeholder="Notice Title"
              value={noticeType}
              onChange={(e) => setNoticeType(e.target.value)}
            />
            {errors.noticeType && (
              <div className="error">{errors.noticeType}</div>
            )}
          </div>
        </div>

        <div className="add-subcategory-btn-container">
          <button className="white-cta" onClick={addSubCategory}>
            <Add /> Add Templates
          </button>
        </div>

        {/* Sub-categories */}
        {subCategories.map((subCategory, index) => (
          <div className="box-container" key={subCategory.id}>
            <div className="input">
              <label>Template Title</label>
              <input
                type="text"
                placeholder="Title"
                value={subCategory.title}
                onChange={(e) => updateSubcategoryTitle(index, e.target.value)}
              />
              {errors.subCategories[index]?.title && (
                <div className="error">{errors.subCategories[index].title}</div>
              )}
            </div>

            <div className="actions">
              <button
                className="red-cta"
                onClick={() => removeSubCategory(index)}
              >
                Delete Draft
              </button>
            </div>

            <NoticeDrafts
              drafts={subCategory.drafts}
              setDrafts={(updated) => updateSubcategoryDrafts(index, updated)}
              errors={errors.subCategories[index]?.drafts}
            />
          </div>
        ))}

        <div className="actions">
          <button className="black-cta" onClick={handleAddDraft}>
            Add Notice
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNoticeDraft;
