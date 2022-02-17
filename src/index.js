import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/700.css";
// import "@fontsource/open-sans/700.css";

import App from "./App";

const theme = extendTheme({
  fonts: {
    heading: "Raleway",
    body: "Helvetica Neue, Helvetica, Raleway",
  },
});

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
  document.getElementById("root")
);
