import React from "react";
import { Flex, Text } from "@chakra-ui/react";

const SegmentOption = ({ segment, isActive, onSelect, proficiency }) => (
  <Flex
    mt='2'
    mr='2'
    py='2'
    px='2'
    w={{ base: "40%", md: "30%" }}
    cursor='pointer'
    // border='1px'
    // borderColor='gray.200'
    shadow={isActive ? "md" : "sm"}
    // rounded='lg'
    justify='space-between'
    alignItems='center'
    backgroundColor={isActive ? segment.backgroundColor : ""}
    borderLeft='8px'
    borderLeftColor={isActive ? segment.backgroundColor : "gray.200"}
    onClick={() => onSelect(segment)}
  >
    <Text fontSize='xs'>{segment.label}</Text>
    <Text
      fontSize='xs'
      py='2'
      px='2'
      backgroundColor='gray.100'
      opacity='1'
      rounded='md'
      fontWeight='bold'
      border='1px'
      borderColor='gray.300'
    >
      {proficiency.pct}%
    </Text>
  </Flex>
);

export default SegmentOption;
