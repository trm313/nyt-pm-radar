import React, { useState } from "react";
import axios from "axios";
import {
  Flex,
  Text,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

const AddFormControl = ({ user, handleAddForm }) => {
  const [formIdInput, setFormIdInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = () => {
    let id = formIdInput;
    axios
      .get(`https://forms.googleapis.com/v1beta/forms/${id}`)
      .then((res) => {
        let newForm = {
          id,
          name: res.data.info.documentTitle,
        };
        setFormIdInput("");
        setErrorMessage("");
        handleAddForm(newForm);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("Error adding Google Form, please re-check sheet ID");
      });
  };

  return (
    <FormControl w='full' mt='4' isInvalid={errorMessage} isDisabled={!user}>
      <Flex>
        <Input
          id='sheetId'
          placeholder='Google Form ID'
          value={formIdInput}
          variant='flushed'
          focusBorderColor='brand.600'
          onChange={(e) => setFormIdInput(e.target.value)}
          onFocus={() => setErrorMessage("")}
        />
        <Button
          isDisabled={!user}
          onClick={() => onSubmit()}
          type='submit'
          rounded='0'
          backgroundColor='brand.600'
          color='white'
          shadow='0'
          _hover={{
            backgroundColor: "brand.400",
          }}
        >
          ADD
        </Button>
      </Flex>

      <FormHelperText>
        This part: https://docs.google.com/forms/d/
        <strong>SHEET_ID</strong>/edit
      </FormHelperText>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};

export default AddFormControl;
