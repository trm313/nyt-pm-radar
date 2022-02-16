import React from "react";
import { Flex, Text, Heading, Image } from "@chakra-ui/react";

import GoogleLoginBtn from "./GoogleLoginBtn";
import formToSheetsBtnImage from "../Assets/formToSheetsBtn.png";

const FormsList = ({ forms, activeForm, onSelect }) => {
  return (
    <Flex direction='column' w='full'>
      {forms.map((form, index) => (
        <Flex
          key={`saved-form-${index}`}
          onClick={() => onSelect(form)}
          direction='column'
          cursor='pointer'
          p='4'
          mt='2'
          border='1px'
          borderColor='gray.200'
          borderRadius='10'
          borderLeftWidth='8px'
          borderLeftColor={
            form.id === activeForm?.id ? "rgba(255, 99, 132, 1)" : "gray.300"
          }
        >
          <Heading size='md'>{form.name}</Heading>
          <Text fontSize='xs'>{form.id}</Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default FormsList;
