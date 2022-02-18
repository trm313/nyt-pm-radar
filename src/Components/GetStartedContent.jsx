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
  Box,
} from "@chakra-ui/react";
import { FcGoogle, FcCheckmark } from "react-icons/fc";

import AddFormControl from "./AddFormControl";
import GoogleLoginBtn from "./GoogleLoginBtn";
import LogoutBtn from "./LogoutBtn";
import pmTypesImage from "../Assets/pm_types_charts.png";
import formToSheetsBtnImage from "../Assets/formToSheetsBtn.png";

const Section = ({ children, headingText }) => (
  <Flex direction='column' my='4'>
    <Heading>{headingText}</Heading>
    {children}
  </Flex>
);

const GetStartedContent = ({ user, onLogin, onLogout, onAddForm }) => {
  return (
    <Flex direction='column' w='full'>
      <Heading>Find Your Product Shape</Heading>
      <Heading size='sm'>Strategist? Innovator?</Heading>
      <Flex direction='column'>
        <Text fontSize='xs' mt='4' mb='2'>
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
        <Text fontSize='xs' mb='4'>
          Adapted for:{" "}
          <Link
            href='https://sites.google.com/nytimes.com/theproductportal/hiring-career'
            isExternal
            color='blue.500'
            mx='2'
          >
            The New York Times Product Management Career Development Path
          </Link>{" "}
          (Internal Link)
        </Text>
      </Flex>
      <Flex
        maxW='2xl'
        w={{ base: "full", lg: "2xl" }}
        direction='column'
        shadow='lg'
        p='8'
        borderLeft='8px'
        borderLeftColor='#8e44ad'
      >
        <Flex direction='column' mb='6'>
          <Heading size='sm' py='2'>
            1. Create your survey form
          </Heading>
          <Text mb='2'>
            For this web app to work, it needs to be built from our template
          </Text>
          <LinkBox w='xs' p='3' borderWidth='2px' rounded='md'>
            <Heading size='sm'>
              <LinkOverlay
                href='https://docs.google.com/forms/d/1LLYHe1tjoGCZRefSM19ZW43HrQHAxH6HUXQqRjiGUjc/copy'
                isExternal
              >
                <Flex justify='center' alignItems='center'>
                  <Icon as={FcGoogle} mr={4} w={6} h={6} /> Copy the template
                </Flex>
              </LinkOverlay>
            </Heading>
          </LinkBox>
        </Flex>

        <Flex direction='column' mb='6'>
          {user ? (
            <Heading size='sm' py='2' mb='2'>
              2. Connected to Google <Icon as={FcCheckmark} />
            </Heading>
          ) : (
            <Heading size='sm' py='2' mb='2'>
              2. Connect your Google Account
            </Heading>
          )}
          {!user && <GoogleLoginBtn onLogin={onLogin} />}
          {user && <LogoutBtn onLogout={onLogout} />}
        </Flex>

        <Flex direction='column' mb='6'>
          <Heading size='sm' py='2'>
            3. Add Google Form by ID
          </Heading>
          <Text mb='2'>Paste the ID of the Google Form here</Text>
          <AddFormControl user={user} handleAddForm={onAddForm} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default GetStartedContent;
