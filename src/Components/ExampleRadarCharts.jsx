import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import RadarChart from './RadarChart';

const PM_TYPES = [
  {
    name: 'The Project Manager',
    name_short: 'Project Manager',
    data: [1.6, 1, 1, 1, 1, 1, 2.5, 1.5, 1.5, 3, 3, 3],
  },
  {
    name: 'The People Manager',
    name_short: 'People Manager',
    data: [1, 1, 1, 1.75, 1, 2, 3, 3, 3, 1.6, 2.5, 1.5],
  },
  {
    name: 'The Growth Hacker',
    name_short: 'Growth Hacker',
    data: [3, 1, 1, 3, 1, 2, 2, 1, 3, 2, 3, 1.75],
  },
  {
    name: 'The Product Innovator',
    name_short: 'Product Innovator',
    data: [1, 3, 3, 1, 3, 1, 1.75, 1, 1, 2.5, 1.5, 1.5],
  },
];

const PM_LEVELS = {};

const ExampleRadarCharts = () => {
  return (
    <Flex wrap="wrap">
      {PM_TYPES.map((type) => (
        <Flex direction="column" key={`example-chart-${type.name}`}>
          <RadarChart minimal={true} values={type.data} size="lg" />
        </Flex>
      ))}
    </Flex>
  );
};

export default ExampleRadarCharts;
