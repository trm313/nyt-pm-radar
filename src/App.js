import React, { useState, useEffect } from "react";
import axios from "axios";
import { Flex, Text, Heading, Button, Image } from "@chakra-ui/react";
import "./style.css";

// Components
import RadarChart from "./Components/RadarChart";
import GetStartedContent from "./Components/GetStartedContent";
import FormsList from "./Components/FormsList";

// Constants
import { FORM_STORAGE_VERSION } from "./Utils/constants";

// Util Functions
import {
  fetchAndCompileResponsesForForm,
  compileRadarDataSeries,
} from "./Utils/functions";

// Util Data
import { demoSurveyResponses, demoSurveyForm } from "./Utils/data";

// Form IDs for testing:
// 1Yus5UpgfAi641Fl9FT-esu5ljGJD5f4h49Qf-WU9rK8
// 1TdAudL-djiD9W2hWjaO-FAp3N_hxiQ0L5f85R4sdVC4

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
      storedForms = storedForms.filter((f) => f.v === FORM_STORAGE_VERSION);
      setForms(storedForms);
    } else {
      // If localStorage key doesn't exist, initialize it here (eg. first time user)
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

  const handleAddForm = (newForm) => {
    setForms([...forms, { ...newForm, v: FORM_STORAGE_VERSION }]);
    setStorageNeedsUpdating(true);
    loadFormResponses(newForm.id);
    setActiveForm(newForm);
  };

  const loadFormResponses = async (id) => {
    let data = await fetchAndCompileResponsesForForm(id);
    setFormData({
      id,
      data,
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
      loadFormResponses(activeForm.id);
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
          onAddForm={handleAddForm}
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
          values={compileRadarDataSeries(
            demoSurveyResponses.data.questions,
            demoSurveyResponses.data.responses
          )}
          responseCount={demoSurveyResponses.data.responses.length}
          size='auto'
        />
      )}
      {formData && (
        <RadarChart
          form={activeForm}
          labels={formData.data.labels}
          values={compileRadarDataSeries(
            formData.data.questions,
            formData.data.responses
          )}
          responseCount={formData.data.responses.length}
          size='auto'
        />
      )}
    </Flex>
  );
}
