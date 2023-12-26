import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={"flex"}
          icon={<VisibilityOutlinedIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h={"410px"} bg={"cyan"}>
                  <ModalHeader
                      fontSize={"40px"}
                      fontFamily={"Work sans"}
                      display={"flex"}
                      justifyContent={"center"}
                  >
                      {user.name}
                  </ModalHeader>
          <ModalCloseButton />
                  <ModalBody
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                  >
                      <Image
                          borderRadius={"full"}
                          boxSize={"150px"}
                          src={user.pic}
                          alt={user.name}
                      />
                      <Text
                          fontSize={{ base: "28px",md: "30px" }}
                          fontFamily={"Work sans"}
                      >
                          Email:{user.email}
                      </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal