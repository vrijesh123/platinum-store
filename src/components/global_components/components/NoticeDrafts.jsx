import React, { useEffect, useState } from "react";
import TextEditor from "../utils/RichTextEditor/TextEditor";
import Handlebars from "handlebars";
import { Tooltip } from "@mui/material";

const NoticeDrafts = ({
  drafts,
  setDrafts,
  errors = null,
  initialData = null,
  showBottomBar = false,
  actions = "",
}) => {
  const [selectedDraft, setSelectedDraft] = useState("post");

  const draftTypes = [
    { value: "post", label: "Post" },
    { value: "email", label: "Email" },
    { value: "whatsapp", label: "Whatsapp" },
    { value: "sms", label: "SMS", message: "No Drafts" },
  ];

  // Compile the current draft template with data
  const compileTemplate = (content) => {
    if (!initialData) return content;

    try {
      const compiled = Handlebars.compile(content || "");
      return compiled(initialData);
    } catch (error) {
      console.error("Template compilation error:", error);
      return content || "";
    }
  };

  // Handle content change for the current draft
  const onChange = (content) => {
    setDrafts({
      ...drafts,
      [selectedDraft]: content,
    });
  };

  // Handle draft type change
  const handleDraftChange = (draftType) => {
    setSelectedDraft(draftType);
  };

  // Get all drafts (useful for parent component)
  const getAllDrafts = () => {
    return drafts;
  };

  console.log("errors", errors);

  return (
    <div className="notice-drafts-container">
      <div className="drafts">
        {draftTypes?.map((item, i) => (
          <div
            onClick={() => handleDraftChange(item.value)}
            className={`draft ${item.value === selectedDraft && "active"}`}
            key={i}
          >
            <p>{item.label}</p>

            {item?.message && (
              <Tooltip arrow placement="top" title={item?.message}>
                <div className="icon-container">
                  <img src="/icons/info-circle.svg" alt="" />
                </div>
              </Tooltip>
            )}
          </div>
        ))}
      </div>

      {selectedDraft == "sms" ? (
        <div className="box-container">
          <p>SMS draft cannot be added</p>
        </div>
      ) : (
        <>
          <TextEditor
            content={compileTemplate(drafts[selectedDraft])}
            onChange={onChange}
            showBottomBar={showBottomBar}
            errors={errors}
          >
            {actions}
          </TextEditor>
        </>
      )}
    </div>
  );
};

export default NoticeDrafts;
