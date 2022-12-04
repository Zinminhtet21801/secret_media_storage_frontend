import {
  Box,
  HStack,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { motion } from "framer-motion";
import ModalComponent from "./ModalComponent";
import { AttachmentIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import { toastConfig } from "../services/toastConfig";
import { useMutation, useQueryClient } from "react-query";

const baseURL = import.meta.env.VITE_BASE_URL;
let count = 0;

const Compose = ({ category = "image" }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chosenFiles, setChosenFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { isLoading, isError, error, mutate } = useMutation(uploadFiles, {
    onSuccess: () => {
      queryClient.invalidateQueries("itemsQuantity");
      queryClient.refetchQueries("itemsQuantity");
      queryClient.invalidateQueries(`${category}Items`);
      queryClient.refetchQueries(`${category}Items`);
    },
  });
  const fileInputRef = useRef(null);

  function closeModal() {
    setIsModalOpen(false);
  }

  const handleAddFile = (e) => {
    // const newFile = e.target.files[0];
    // setChosenFiles((old) => [...old, newFile]);
    console.log("HERERE", e);
    const newFile = e.target.files[0];
    newFile && setChosenFiles([newFile]);
  };

  const handleFileChange = (files) => {
    console.log("removeFile", files);
    setChosenFiles([...files]);
  };

  const Upload = () => {
    mutate({ id: "itemsQuantity", count });
  };

  async function uploadFiles() {
    let fileName = chosenFiles[0].name;
    setChosenFiles([]);
    closeModal();
    if (
      toast.isActive(fileName) ||
      uploadingFiles.find((file) => file === fileName)
    ) {
      count++;
      return toast({
        id: fileName + count,
        duration: 3000,
        render: ({ id, onClose }) =>
          toastConfig(
            id,
            onClose,
            fileName,
            `${fileName} is already in queue.`,
            100
          ),
      });
    }
    if (chosenFiles.length > 0) {
      setUploadingFiles((files) => [fileName, ...files]);
      toast({
        id: fileName,
        duration: 3000,
        status: "loading",
        render: ({ id, onClose }) =>
          toastConfig(id, onClose, fileName, `Uploading...`, 0),
      });
      const formData = new FormData();
      formData.append("files", chosenFiles[0]);
      try {
        const res = await axios({
          method: "post",
          url: `${baseURL}/media/uploadFiles`,
          data: formData,
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            let pendingProgress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            if (pendingProgress === 100) {
              toast.update(fileName, {
                id: fileName,
                duration: 3000,
                status: "loading",
                render: ({ id, onClose }) =>
                  toastConfig(
                    id,
                    onClose,
                    fileName,
                    `Completed!!!`,
                    pendingProgress
                  ),
              });
              setUploadingFiles((files) =>
                files.filter((file) => file !== fileName)
              );
            } else {
              toast.update(fileName, {
                id: fileName,
                duration: null,
                status: "loading",
                render: ({ id, onClose }) =>
                  toastConfig(
                    id,
                    onClose,
                    fileName,
                    `Uploading...`,
                    pendingProgress
                  ),
              });
            }
          },
        });
      } catch (e) {
        console.log(e.response.data.message, "Error: sdfsdafjklsj");
        toast.update(fileName, {
          id: fileName,
          duration: 3000,
          status: "loading",
          render: ({ id, onClose }) =>
            toastConfig(
              id,
              onClose,
              fileName,
              e?.response?.data?.message,
              null
            ),
        });
      }
    }
  }

  return (
    <>
      <motion.div whileHover={{ y: -5 }} onClick={() => setIsModalOpen(true)}>
        <HStack
          borderWidth={1}
          borderRadius={20}
          p={3}
          // m={2}
          _hover={{ cursor: "pointer" }}
        >
          <IoMdAddCircle size={25} />
          <Text fontSize={15}>Compose</Text>
        </HStack>
      </motion.div>
      {isModalOpen && (
        <ModalComponent
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          secondButtonName={"Upload"}
          secondButtonAction={Upload}
          secondButtonDisable={chosenFiles.length > 0 ? false : true}
        >
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {chosenFiles.length > 0 && (
              <ModalBodyItem
                files={chosenFiles}
                handleFileChange={handleFileChange}
              />
            )}
            <IconButton
              colorScheme="blue"
              aria-label="Attach a file"
              icon={<AttachmentIcon />}
              onClick={() => fileInputRef.current.click()}
            />
            <input
              ref={fileInputRef}
              type={"file"}
              onClick={() => "this.value=null;"}
              onChange={(event) => handleAddFile(event)}
              style={{ display: "none" }}
              // multiple
            />
          </ModalBody>
        </ModalComponent>
      )}
    </>
  );
};

export default Compose;

const ModalBodyItem = ({ files, handleFileChange }) => {
  console.log({ files });
  const removeFile = (name) => {
    handleFileChange(files?.filter((file) => file?.name !== name));
  };
  return (
    <Box>
      {files?.map((file, index) => (
        <HStack
          key={index}
          justifyContent={"space-between"}
          alignItems={"center"}
          p={1}
        >
          <Text
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            overflow={"hidden"}
          >
            {file?.name}
          </Text>
          <IconButton
            colorScheme="red"
            aria-label="Attach a file"
            icon={<DeleteIcon />}
            onClick={() => removeFile(file?.name)}
          />
        </HStack>
      ))}
    </Box>
  );
};
