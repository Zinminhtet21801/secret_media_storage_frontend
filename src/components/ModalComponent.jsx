import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
console.log("JSDLKFJDSKL");

function ModalComponent({
  children,
  isModalOpen,
  closeModal,
  secondButtonName,
  secondButtonAction,
  secondButtonDisable,
}) {
  // console.log(secondButtonDisable);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          onClose();
          closeModal();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          {children}
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                onClose();
                closeModal();
              }}
            >
              Close
            </Button>
            <Button
              variant="ghost"
              onClick={secondButtonAction}
              disabled={secondButtonDisable}
            >
              {secondButtonName}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ModalComponent;
