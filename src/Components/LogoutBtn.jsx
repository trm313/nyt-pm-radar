import React from "react";
import { GoogleLogout } from "react-google-login";
import { Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

const LogoutBtn = ({ onLogout }) => {
  return (
    <Flex mt='4'>
      <GoogleLogout
        clientId='12032474523-j8qabilh90gi615h4luvhc608aq4ar8n.apps.googleusercontent.com'
        buttonText='Disconnect from Google'
        onLogoutSuccess={onLogout}
        render={(renderProps) => (
          <Flex
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            cursor='pointer'
            alignItems='center'
            justifyContent='center'
            maxW='sm'
            py='2'
            px='4'
            borderWidth='1px'
            rounded='md'
            mt='4'
          >
            <Icon as={FcGoogle} mr={4} w={4} h={4} />
            <Text fontSize='sm'>Disconnect from Google</Text>
          </Flex>
        )}
      />
    </Flex>
  );
};

export default LogoutBtn;
