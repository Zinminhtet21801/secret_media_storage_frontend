import {
  Box,
  HStack,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
  useToast,
  CircularProgress,
  CircularProgressLabel,
  Center,
  // useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { motion } from "framer-motion";
import ModalComponent from "./ModalComponent";
import { AttachmentIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import Toast from "./Toast";
import { useRecoilState } from "recoil";
import { progressState } from "../atoms/atoms";

const baseURL = import.meta.env.VITE_BASE_URL;
let count = 0;

// const ToastIcon = () => (
//   <Center position={"absolute"}>
//     <CircularProgress value={progress}>
//       <CircularProgressLabel>{progress}</CircularProgressLabel>
//     </CircularProgress>
//   </Center>
// );

const Compose = () => {
  const toast = useToast();
  const toastIdRef = useRef();
  const [progress, setProgress] = useRecoilState(progressState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chosenFiles, setChosenFiles] = useState([]);
  const fileInputRef = useRef(null);

  function closeModal() {
    setIsModalOpen(false);
  }

  const handleAddFile = (e) => {
    const newFile = e.target.files[0];
    console.log([...chosenFiles, newFile], "hherlerj");
    setChosenFiles((old) => [...old, newFile]);
  };

  const handleFileChange = (files) => {
    // const newFile = =
    setChosenFiles([...files]);
  };

  const uploadFiles = async () => {
    if (chosenFiles.length > 0) {
      console.log(toastIdRef.current, "currebnt biuildsfjlkj");
      count++;
      let oldProgress = null;
      // toastIdRef.current = toast({
      //   id: count,
      //   icon: (
      //     <Center position={"absolute"}>
      //       <CircularProgress value={0}>
      //         <CircularProgressLabel>{0}</CircularProgressLabel>
      //       </CircularProgress>
      //     </Center>
      //   ),
      //   title: "Uploading.",
      //   description: "Uploading file.",
      //   status: "loading",
      //   // duration: 90000,
      //   isClosable: true,
      //   containerStyle: {
      //     position: "relative",
      //   },
      // });
      const formData = new FormData();
      formData.append("files", chosenFiles[0]);
      console.log(formData, "formData");
      const res = await axios({
        method: "post",
        url: `${baseURL}media/uploadFiles`,
        data: formData,
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (oldProgress == null) {
            oldProgress = progressEvent;
          }
          console.log(
            oldProgress == progressEvent,
            progressEvent,
            progressEvent.loaded,
            progressEvent.total,
            count,
            toastIdRef,
            "progressEvent"
          );
          let pendingProgress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          // if (toastIdRef.current) {
          // toast.update(count, {
          //   id: count,
          //   icon: (
          //     <Center position={"absolute"}>
          //       <CircularProgress value={pendingProgress}>
          //         <CircularProgressLabel>
          //           {pendingProgress}
          //         </CircularProgressLabel>
          //       </CircularProgress>
          //     </Center>
          //   ),
          //   title: "Uploading.",
          //   description: "Uploading file.",
          //   status: "loading",
          //   duration: null,
          //   isClosable: true,
          //   containerStyle: {
          //     position: "relative",
          //   },
          // });
        },
        // },
      });
      toast.close(toastIdRef.current);
      console.log(res);
    }
  };

  return (
    <>
      <motion.div whileHover={{ y: -5 }} onClick={() => setIsModalOpen(true)}>
        <HStack
          borderWidth={1}
          borderRadius={20}
          p={3}
          m={2}
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
          secondButtonAction={uploadFiles}
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
