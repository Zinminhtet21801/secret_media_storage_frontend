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
import { toastConfig } from "../services/toastConfig";
import { useMutation, useQueryClient } from "react-query";
import { Uploader } from "../utils/upload";
let count = 0;

const Compose = ({ category = "image" }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chosenFiles, setChosenFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [uploader, setUploader] = useState(undefined);

  const { isLoading, isError, error, mutate } = useMutation(uploadFiles);
  const fileInputRef = useRef(null);

  function closeModal() {
    setIsModalOpen(false);
  }

  const handleRemoveFile = (fileName) => [
    setUploadingFiles((files) => files.filter((file) => file !== fileName)),
  ];

  const handleAddFile = (e) => {
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
            100,
            uploader
          ),
      });
    }
    if (chosenFiles.length > 0) {
      let percentage = undefined;
      toast({
        id: fileName,
        duration: null,
        status: "loading",
        render: ({ id, onClose }) =>
          toastConfig(id, onClose, fileName, `Uploading...`, 0, uploader),
      });
      const uploader = new Uploader({
        fileName,
        file: chosenFiles[0],
        queryClient: queryClient,
        category: category,
      });
      setUploader(uploader);

      uploader
        .onProgress(async ({ percentage: newPercentage }) => {
          // to avoid the same percentage to be logged twice
          if (newPercentage !== percentage) {
            percentage = newPercentage;
            if (percentage === 100) {
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
                    percentage,
                    uploader
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
                    percentage,
                    uploader,
                    "visible",
                    fileName,
                    handleRemoveFile
                  ),
              });
            }
          }
        })
        .onError((error) => {
          setChosenFiles([]);
          console.error(error);
          toast.update(fileName, {
            id: fileName,
            duration: 3000,
            status: "loading",
            render: ({ id, onClose }) =>
              toastConfig(
                id,
                onClose,
                fileName,
                error?.response?.data?.message,
                null,
                "hidden"
              ),
          });
        });

      uploader.start();

      setUploadingFiles((files) => [fileName, ...files]);
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
