import FileDropzone from "@/components/global_components/components/FileDropzone";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import { getPreviewUrl } from "@/utils/functionUtils";
import { FormControl, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";

const POD = () => {
  const tenantAPI = useTenantAPI();

  const [podFile, setPodFile] = useState(null);
  const [noticeGroup, setNoticeGroup] = useState([]);

  const fetchNoticeGroups = async () => {
    try {
      const res = await tenantAPI.get(`/api/notice/group/`);

      if (res?.results?.length > 0) {
        setNoticeGroup(res?.results);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchNoticeGroups();
  }, [tenantAPI]);

  console.log("noticeGroups", noticeGroup);

  return (
    <div className="pod-container">
      <FormControl sx={{ margin: "10px 0" }} fullWidth size="small">
        <label htmlFor="">Select Notice Group ID</label>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={0}
          onChange={() => {}}
          placeholder="Select Notice Group ID"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>

      <FileDropzone
        label="Upload Document Zip File"
        onFileUpload={setPodFile}
        document={podFile}
        previewUrl={getPreviewUrl(podFile)}
        accept=".pdf"
        fileType="pdf"
      />
    </div>
  );
};

export default POD;
