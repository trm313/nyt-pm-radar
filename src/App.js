import React, { useState, useEffect } from "react";
import axios from "axios";
import { Flex, Text, Heading, Button, Image } from "@chakra-ui/react";
import "./style.css";

import formToSheetsBtnImage from "./Assets/formToSheetsBtn.png";
// Components
import RadarChart from "./Components/RadarChart";
import AddSheetForm from "./Components/AddSheetForm";
import GoogleLoginBtn from "./Components/GoogleLoginBtn";
import LogoutBtn from "./Components/LogoutBtn";
import GetStartedContent from "./Components/GetStartedContent";
import FormsList from "./Components/FormsList";

// Helper Functions

const compileSurveyResponses = (data) => {
  // TODO: Rewrite this so it's more readable

  // Pull survey responses into array
  let responses = [];
  // data.values[0] = headers ( ['label1', 'label2', 'label3'] )
  // data.values[1-n] = submissions ( ['timestamp', '2', '3', '4', '5', ..., '3'] )
  for (let i = 1; i < data.values.length; i++) {
    let responseValues = data.values[i].slice(1);

    // Convert all strings to integers
    for (let j = 0; j < responseValues.length; j++) {
      responseValues[j] = parseInt(responseValues[j]);
    }

    responses.push(responseValues);
  }
  return responses;
};

const compileAveragesFromAllResponses = (responses) => {
  if (responses.length === 0) {
    return [];
  }

  let nonZeroResponseCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let dataSeries = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  responses.map((answers, responseIndex) => {
    answers.map((answer, questionIndex) => {
      if (answer > 0) {
        nonZeroResponseCounts[questionIndex]++;
        dataSeries[questionIndex] += answer;
      }
    });
  });

  // Find averages based on nonZeroResponseCounts
  for (let i = 0; i < dataSeries.length; i++) {
    if (nonZeroResponseCounts[i] > 0) {
      dataSeries[i] = dataSeries[i] / nonZeroResponseCounts[i];
    }
  }

  return dataSeries;
};

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
  };

  const fetchDataFromSheet = (form) => {
    axios
      .get(
        `https://sheets.googleapis.com/v4/spreadsheets/${form.id}/values/A:M`
      )
      .then((res) => {
        let responses = compileSurveyResponses(res.data);
        setFormData({
          id: form.id,
          responses,
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
      px='4'
      py='16'
      maxW='4xl'
      mx='auto'
    >
      <GetStartedContent />

      <Flex direction='column' w='full' maxW='2xl'>
        <Heading size='lg' display='flex' alignItems='center' my='4'>
          {" "}
          <Image src={formToSheetsBtnImage} /> My Surveys
        </Heading>

        {!user && <GoogleLoginBtn onLogin={login} />}

        {user && (
          <FormsList
            forms={forms}
            activeForm={activeForm}
            onSelect={selectForm}
          />
        )}
        {user && <AddSheetForm handleAddSheet={handleAddSheet} />}

        {user && <LogoutBtn onLogout={logout} />}

        {formData && formData.responses && (
          <RadarChart
            form={activeForm}
            values={compileAveragesFromAllResponses(formData.responses)}
            size='auto'
          />
        )}
      </Flex>
    </Flex>
  );
}
