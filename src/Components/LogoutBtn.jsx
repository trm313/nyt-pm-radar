import React from "react";
import { GoogleLogout } from "react-google-login";
import { Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { FcGoogle, FcCancel } from "react-icons/fc";

import { GOOGLE_CLIENT_ID } from "../Utils/constants";

const LogoutBtn = ({ onLogout }) => {
  return (
    <Flex>
      <GoogleLogout
        clientId={GOOGLE_CLIENT_ID}
        buttonText='Disconnect from Google'
        onLogoutSuccess={onLogout}
        render={(renderProps) => (
          <Flex
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            cursor='pointer'
            alignItems='center'
            justifyContent='center'
            w='xs'
            p='3'
            borderWidth='2px'
            rounded='md'
          >
            <Icon as={FcCancel} mr={4} w={6} h={6} />
            <Heading size='sm'>Disconnect from Google</Heading>
          </Flex>
        )}
      />
    </Flex>
  );
};

export default LogoutBtn;
