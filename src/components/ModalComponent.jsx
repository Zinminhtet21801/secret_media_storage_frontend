import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

function ModalComponent({
  children,
  isModalOpen,
  closeModal,
  secondButtonName,
  secondButtonAction,
  secondButtonDisable,
}) {
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
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
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
