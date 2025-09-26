import { toast } from "react-toastify";

export const handle_edit = async (edit_data, api, path, id, state, setState, set_open) => {
    let res;
    try {
        res = await api.patch(path, edit_data);

        const indexToUpdate = state?.findIndex((item) => item.id === id);

        if (indexToUpdate > -1) {
            // Replace the item at found index with the updated item from the response
            const updatedData = [...state];
            updatedData[indexToUpdate] = res; // Assuming `res.data` contains the updated item
            setState(updatedData);
        }
    } catch (error) {
        console.error("Error updating item:", error);
    } finally {
        set_open(false);
    }

    return res;
};


export const getPreviewUrl = (file) => (file ? URL.createObjectURL(file) : null);


export const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};


