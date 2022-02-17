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

// TODO: Validate Sheet ID / access before adding
// Show a check if it's good, or an error signal if not

// TODO: Validate other inputs like Name

const AddSheetForm = ({ handleAddSheet }) => {
  const [formIdInput, setFormIdInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = () => {
    let id = formIdInput;
    axios
      .get(`https://sheets.googleapis.com/v4/spreadsheets/${id}`)
      .then((res) => {
        let newForm = {
          id,
          name: res.data.properties.title,
        };
        setFormIdInput("");
        setErrorMessage("");
        handleAddSheet(newForm);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("Error adding Google Sheet, please re-check sheet ID");
      });
  };

  return (
    <FormControl w='full' mt='4' isInvalid={errorMessage}>
      <Flex>
        <Input
          id='sheetId'
          placeholder='Google Sheet ID'
          value={formIdInput}
          variant='flushed'
          focusBorderColor='#8e44ad'
          onChange={(e) => setFormIdInput(e.target.value)}
          onFocus={() => setErrorMessage("")}
        />
        <Button
          onClick={() => onSubmit()}
          type='submit'
          rounded='0'
          backgroundColor='#8e44ad'
          color='white'
          shadow='0'
          _hover={{
            opacity: 0.7,
          }}
        >
          ADD
        </Button>
      </Flex>

      <FormHelperText>
        This part: https://docs.google.com/spreadsheets/d/
        <strong>SHEET_ID</strong>/edit
      </FormHelperText>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};

export default AddSheetForm;
