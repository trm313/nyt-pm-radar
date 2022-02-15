import React from "react";
import {
  Flex,
  Text,
  Heading,
  Link,
  LinkBox,
  LinkOverlay,
  Button,
  Image,
  Icon,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

import pmTypesImage from "../Assets/pm_types_charts.png";
import formToSheetsBtnImage from "../Assets/formToSheetsBtn.png";

const Section = ({ children, headingText }) => (
  <Flex direction='column' my='4'>
    <Heading>{headingText}</Heading>
    {children}
  </Flex>
);

const GetStartedContent = () => {
  return (
    <Flex direction='column' maxWidth='2xl'>
      <Section headingText='What is this?'>
        <Text fontSize='xs' my='4'>
          Inspired by:{" "}
          <Link
            href='https://www.ravi-mehta.com/product-manager-roles/'
            isExternal
            color='blue.500'
            mx='2'
          >
            What’s Your Shape? A Product Manager’s Guide to Growing Yourself and
            Your Team
          </Link>
        </Text>

        <Text>
          Use your colleagues to help you find your true shape. Make a copy of
          this survey template and send it to your colleagues, with anonymous
          responses, in a "360-review" style.
        </Text>
        <Flex py='8'>
          <Image src={pmTypesImage} />
        </Flex>

        <Text>
          This web app will let you connect to the results, average them, and
          visualize a radar chart with your shape.
        </Text>

        <LinkBox
          as='article'
          maxW='sm'
          p='3'
          borderWidth='2px'
          rounded='md'
          mt='8'
        >
          <Heading size='md'>
            <LinkOverlay
              href='https://docs.google.com/forms/d/1LLYHe1tjoGCZRefSM19ZW43HrQHAxH6HUXQqRjiGUjc/copy'
              isExternal
            >
              <Flex justify='center' alignItems='center'>
                <Icon as={FcGoogle} mr={4} w={10} h={10} /> Copy the template
              </Flex>
            </LinkOverlay>
          </Heading>
        </LinkBox>
      </Section>
      <Section headingText='How to see my results'>
        <Text mt='4' display='flex' alignItems='center'>
          In your Google Form, on the "Responses" tab, click{" "}
          <Image src={formToSheetsBtnImage} />
        </Text>
        <Text mt='4'>Connect your Google account</Text>
        <Text mt='4'>Paste the ID of the Google Sheet here</Text>
      </Section>
    </Flex>
  );
};

export default GetStartedContent;
