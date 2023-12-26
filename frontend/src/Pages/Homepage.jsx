import React, { useEffect } from "react";
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";
const Homepage = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"))
    if (user) {
      navigate("/chats")
    }
  },[navigate])
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={2}
        bg={"white"}
        w="90%"
        m="10px 0 "
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color={"black"}>
          Chit-Chat
        </Text>
      </Box>

      <Box bg="white" p={4} w={"90%"} borderRadius={"lg"} borderWidth={"1px"}>
        <Tabs variant="soft-rounded" color={"black"}>
          <TabList >
            <Tab w={"50%"}>Login</Tab>
            <Tab w={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
