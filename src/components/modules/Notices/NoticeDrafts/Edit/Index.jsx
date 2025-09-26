import NoticeDrafts from "@/components/global_components/components/NoticeDrafts";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditNoticeDraft = () => {
  const router = useRouter();
  const { id } = router.query;

  const tenantAPI = useTenantAPI();

  // State for main notice title
  const [noticeType, setNoticeType] = useState("");

  // State for sub-categories
  const [subCategories, setSubCategories] = useState([]);

  // Add a new sub-category
  const addSubCategory = () => {
    setSubCategories((prev) => [
      ...prev,
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

  const fetchNoticeType = async () => {
    try {
      const res = await tenantAPI.get(`/api/notice/draft/?id_exact=${id}`);

      if (res?.results?.length > 0) {
        setNoticeType(res?.results?.[0]?.notice_type);
      }
    } catch (error) {}
  };

  const fetchNoticeTemplate = async () => {
    try {
      const res = await tenantAPI.get(
        `/api/notice/template/?notice_type=${id}`
      );

      if (res?.results?.length > 0) {
        const data = res?.results?.map((item) => ({
          title: item?.name,
          id: item?.id,
          drafts: {
            post: item?.post_template,
            email: item?.email_template,
            whatsapp: item?.whatsapp_template,
            sms: item?.sms_template,
          },
        }));

        setSubCategories(data);
      }
      console.log("fetchNoticeTemplate", res);
    } catch (error) {}
  };

  useEffect(() => {
    if (router.isReady && tenantAPI && id) {
      fetchNoticeType();
      fetchNoticeTemplate();
    }
  }, [router.isReady, tenantAPI, id]);

  const handleEditTemplate = async () => {
    try {
      const requests = subCategories?.map((record) => {
        const payload = {
          notice_type: id,
          name: record?.title,
          post_template: record?.drafts?.post,
          email_template: record?.drafts?.email,
          whatsapp_template: record?.drafts?.whatsapp,
          sms_template: "-",
        };

        if (record?.id) {
          return tenantAPI.patch(
            `/api/notice/template/?pk=${record?.id}`,
            payload
          );
        } else {
          return tenantAPI.post(`/api/notice/template/`, payload);
        }
      });

      const responses = await Promise.all(requests);
    } catch (error) {
      console.error("Error in handleAddTemplate:", error);
    }
  };

  const handleEditDraft = async () => {
    try {
      const res = await tenantAPI.patch(`/api/notice/draft/?pk=${id}`, {
        notice_type: noticeType,
      });

      await handleEditTemplate();

      toast.success("Notice has been successfully edited");
    } catch (error) {
      console.error("Error in handleAddDraft:", error);
    }
  };

  if (!router.isReady || !tenantAPI || !id) return null; // or show a loader

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
          <h4>Add Notice Drafts</h4>
        </div>
      </div>

      <div className="add-notice-draft-container">
        <div className="box-container">
          <div className="input">
            <label>Main Notice Draft Title *</label>
            <input
              type="text"
              placeholder="Notice Title"
              value={noticeType}
              onChange={(e) => setNoticeType(e.target.value)}
            />
          </div>
        </div>

        <div className="add-subcategory-btn-container">
          <button className="white-cta" onClick={addSubCategory}>
            + Add Sub-category
          </button>
        </div>

        {/* Sub-categories */}
        {subCategories.map((subCategory, index) => (
          <div className="box-container" key={subCategory.id}>
            <div className="input">
              <label>Sub-Category Title *</label>
              <input
                type="text"
                placeholder="Notice Sub-Category Title"
                value={subCategory.title}
                onChange={(e) => updateSubcategoryTitle(index, e.target.value)}
              />
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
            />
          </div>
        ))}

        <div className="actions">
          <button className="black-cta" onClick={handleEditDraft}>
            Edit Notice
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNoticeDraft;
