import React, { useState, useEffect } from "react";
import axios from "axios";
import { Flex, Text, Heading, Button, Image } from "@chakra-ui/react";
import "./style.css";

// Components
import RadarChart from "./Components/RadarChart";
import GetStartedContent from "./Components/GetStartedContent";
import FormsList from "./Components/FormsList";

// Util Functions
import {
  compileSurveyResponses,
  compileAveragesFromAllResponses,
} from "./Utils/functions";

// Util Data
import { demoSurveyResponses, demoSurveyForm } from "./Utils/data";

// Wisteria Purple: #8e44ad // rgba(142,68,173)

// Form IDs for testing:
// 13GkiY6JRDyLRUV1seSOKQVzavfh7rh-9-ro81tl--zs
// 1bJJfgk-jKLS9tNQnxg0wnjcutBmtt7whunBjLXkw200

export default function App() {
  const [user, setUser] = useState(null);
  const [forms, setForms] = useState([]);
  const [activeForm, setActiveForm] = useState(null);
  const [formData, setFormData] = useState(null);
  const [storageNeedsUpdating, setStorageNeedsUpdating] = useState(false);

  // Authentication
  const login = (user) => {
    console.log(user.accessToken);
    setUser(user);
  };

  const logout = () => {
    setUser(null);
    setFormData(null);
    setActiveForm(null);
  };

  // LocalStorage Interactions
  const getDataFromLocalStorage = () => {
    const key = "forms";
    if (localStorage.getItem(key)) {
      let storedForms = JSON.parse(localStorage.getItem(key));
      setForms(storedForms);
    } else {
      // If data doesn't exist, initialize it here (eg. first time user)
      localStorage.setItem(key, JSON.stringify([]));
    }
  };

  const storeDataInLocalStorage = () => {
    localStorage.setItem("forms", JSON.stringify(forms));
    setStorageNeedsUpdating(false);
  };

  // Data Functions
  const selectForm = (form) => {
    setActiveForm(form);
  };

  const handleAddSheet = (newForm) => {
    setForms([...forms, newForm]);
    setStorageNeedsUpdating(true);
    fetchDataFromSheet(newForm);
    setActiveForm(newForm);
  };

  const fetchDataFromSheet = (form) => {
    axios
      .get(
        `https://sheets.googleapis.com/v4/spreadsheets/${form.id}/values/A:AZ`
      )
      .then((res) => {
        let structuredFormResponses = compileSurveyResponses(res.data);
        console.log("Data for demo:", structuredFormResponses);
        setFormData({
          id: form.id,
          data: structuredFormResponses,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Effects
  useEffect(() => {
    if (user?.accessToken) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.accessToken}`;
    } else {
      axios.defaults.headers.common["Authorization"] = "";
    }
  }, [user]);

  useEffect(() => {
    getDataFromLocalStorage();
  }, []);

  useEffect(() => {
    if (storageNeedsUpdating) {
      storeDataInLocalStorage();
    }
  }, [storageNeedsUpdating]);

  useEffect(() => {
    if (activeForm) {
      fetchDataFromSheet(activeForm);
    }
  }, [activeForm]);

  useEffect(() => {
    // Auto-load the first form to start
    if (user && !activeForm && forms.length > 0) {
      selectForm(forms[0]);
    }
  }, [forms, activeForm, user]);

  return (
    <Flex
      direction='column'
      alignItems='center'
      w='full'
      maxW='5xl'
      px='2'
      py='4'
      mx='auto'
    >
      <Flex
        direction='column'
        alignItems='center'
        px='4'
        py='16'
        maxW='4xl'
        mx='auto'
      >
        <GetStartedContent
          user={user}
          onLogin={login}
          onLogout={logout}
          onAddSheet={handleAddSheet}
        />

        <Flex direction='column' w='full' maxW='2xl' mt='16'>
          <Heading size='lg' display='flex' alignItems='center' my='4'>
            My Surveys
          </Heading>
          {!user && <Text>Connect to Google to see results</Text>}
          {forms.length === 0 && user && <Text>No surveys added yet</Text>}

          {user && (
            <FormsList
              forms={forms}
              activeForm={activeForm}
              onSelect={selectForm}
            />
          )}
        </Flex>
      </Flex>
      {!formData && (
        <RadarChart
          form={demoSurveyForm}
          labels={demoSurveyResponses.data.labels}
          values={compileAveragesFromAllResponses(
            demoSurveyResponses.data.responses
          )}
          size='auto'
        />
      )}
      {formData && (
        <RadarChart
          form={activeForm}
          labels={formData.data.labels}
          values={compileAveragesFromAllResponses(formData.data.responses)}
          size='auto'
        />
      )}
    </Flex>
  );
}
