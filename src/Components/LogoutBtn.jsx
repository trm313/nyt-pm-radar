import React from "react";
import { GoogleLogout } from "react-google-login";
import { Flex } from "@chakra-ui/react";

const LogoutBtn = ({ onLogout }) => {
  return (
    <Flex mt='4'>
      <GoogleLogout
        clientId='12032474523-j8qabilh90gi615h4luvhc608aq4ar8n.apps.googleusercontent.com'
        buttonText='Disconnect from Google'
        onLogoutSuccess={onLogout}
      ></GoogleLogout>
    </Flex>
  );
};

export default LogoutBtn;
