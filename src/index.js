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
  colors: {
    brand: { 200: "#ddc7e6", 400: "#bb8fce", 600: "#8e44ad" },
  },
});
// Wisteria Purple: #8e44ad || rgba(142,68,173)

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
  document.getElementById("root")
);
