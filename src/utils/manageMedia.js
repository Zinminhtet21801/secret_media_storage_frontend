import axios from "axios";
import { baseURL } from "../main";
import { toastConfig } from "../services/toastConfig";

export const removeMedia = async (id) => {
  const res = await axios.delete(`${baseURL}/media/remove/${id}`, {
    // headers: {
    //   Authorization: `Bearer ${document.cookie.split("=")[1]}`,
    // },
    withCredentials: true,
  });
  return res;
};

export const downloadMedia = async (toast, name, category, id) => {
  if (toast.isActive(name)) {
    count++;
    return toast({
      id: name + count,
      duration: 3000,
      render: ({ id, onClose }) =>
        toastConfig(id, onClose, name, `${name} is already in queue.`, 100),
    });
  }

  toast({
    id: name,
    duration: 3000,
    status: "loading",
    render: ({ id, onClose }) =>
      toastConfig(id, onClose, name, `Downloading...`, 0),
  });
  const link = document.createElement("a");
  const res = await axios.get(`${baseURL}/media/download/${category}/${id}`, {
    // headers: {
    //   Authorization: `Bearer ${document.cookie.split("=")[1]}`,
    // },
    withCredentials: true,
    responseType: "blob",
    onDownloadProgress: (progressEvent) => {
      let pendingProgress = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      );
      if (pendingProgress === 100) {
        toast.update(name, {
          id: name,
          duration: 3000,
          status: "loading",
          render: ({ id, onClose }) =>
            toastConfig(id, onClose, name, `Completed!!!`, pendingProgress),
        });
      } else {
        toast.update(name, {
          id: name,
          duration: null,
          status: "loading",
          render: ({ id, onClose }) =>
            toastConfig(id, onClose, name, `Downloading...`, pendingProgress),
        });
      }
    },
  });

  const url = window.URL.createObjectURL(
    new Blob([res.data], {
      type: res.headers["content-type"],
    })
  );

  link.href = url;
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);

  return res;
};
