import React, { useState } from "react";
import { Flex, Heading, Text } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  elements: {
    line: {
      borderWidth: 10,
    },
  },
  scales: {
    r: {
      beginAtZero: true,
      angleLines: {
        display: true,
      },
      min: 0,
      max: 3,
      ticks: {
        stepSize: 1,
        // color: ["red", "blue"],
      },
      grid: {
        // color: ["red", "blue"],
      },
    },
  },
  plugins: {
    legend: {
      display: false,
      position: "top",
      align: "start",
    },
  },
};

let sizes = {
  sm: "xs",
  md: "4xl",
  lg: "6xl",
  auto: "full",
};

const segmentDatasets = [
  {
    label: "Product Strategy",
    data: [3, 3, 3],
    indexes: [0, 1, 2],
    backgroundColor: "rgba(0,0,255,.1)", // blue
    borderColor: "none",
    borderWidth: 0,
  },
  {
    label: "Product Execution",
    data: [0, 0, 0, 3, 3, 3, 3],
    indexes: [3, 4, 5],
    backgroundColor: "rgba(0,0,0,.1)", // gray
    borderColor: "none",
    borderWidth: 0,
  },
  {
    label: "Leadership",
    data: [0, 0, 0, 0, 0, 0, 0, 3, 3, 3],
    indexes: [6, 7, 8],
    backgroundColor: "rgba(0,255,0,.1)", // green
    borderColor: "none",
    borderWidth: 0,
  },
  {
    label: "Cross Functional",
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
    indexes: [9, 10],
    backgroundColor: "rgba(233,255,0,.1)", // yellow
    borderColor: "none",
    borderWidth: 0,
  },
  {
    label: "Technical & Insights",
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3],
    indexes: [11, 12, 13, 14],
    backgroundColor: "rgba(255,0,255,.1)", // pink
    borderColor: "none",
    borderWidth: 0,
  },
  {
    label: "People Management",
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3],
    indexes: [15, 16, 17],
    backgroundColor: "rgba(255,0,0,.1)", // red
    borderColor: "none",
    borderWidth: 0,
  },
];

const getSegmentTotals = (values, segment) => {
  let indexes = segment.indexes;
  let sum = 0;
  let total = indexes.length * 3;
  for (let i = 0; i < indexes.length; i++) {
    sum += values[indexes[i]];
  }
  return {
    sum,
    total,
    pct: Math.floor((sum / total) * 100),
  };
};

const SegmentOption = ({ segment, isActive, onSelect, proficiency }) => (
  <Flex
    mt='4'
    py='3'
    px='2'
    w='40'
    cursor='pointer'
    border='1px'
    borderColor='gray.200'
    rounded='lg'
    justify='space-between'
    backgroundColor={isActive ? segment.backgroundColor : ""}
    onClick={() => onSelect(segment)}
  >
    <Text fontSize='xs'>{segment.label}</Text>
    <Text
      fontSize='xs'
      px='1'
      backgroundColor='gray.100'
      opacity='1'
      rounded='md'
      fontWeight='bold'
    >
      {proficiency.pct}%
    </Text>
  </Flex>
);

const RadarChart = ({
  form,
  labels,
  values,
  minimal = false,
  size = sizes.auto,
}) => {
  const [segments, setSegments] = useState([segmentDatasets[0]]);

  const selectSegment = (selectedSegment) => {
    let index = segments.findIndex(
      (segment) => segment.label === selectedSegment.label
    );
    if (index > -1) {
      // Present - remove from array
      setSegments(
        segments.filter((segment) => segment.label !== selectedSegment.label)
      );
    } else {
      // Not present - add to array
      setSegments([...segments, selectedSegment]);
    }
  };

  let data = {
    labels,
    datasets: [
      {
        label: "Proficiencies",
        data: values,
        backgroundColor: "rgba(255, 99, 132, 0.8)", // pink
        // backgroundColor: "rgba(9, 40, 141, 0.8)", // blue
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 4,
      },
      ...segments,
    ],
  };
  return (
    <Flex
      direction='column'
      alignItems='center'
      width={sizes[size]}
      mt='12'
      position='relative'
    >
      <Heading fontSize='lg' fontWeight='bold'>
        {form.name}
      </Heading>
      <Flex w='full'>
        <Flex w='40' direction='column' justify='center'>
          {segmentDatasets.map((s) => (
            <SegmentOption
              key={`radar-legend-${s.label}`}
              segment={s}
              onSelect={selectSegment}
              isActive={
                segments.findIndex((segment) => segment.label === s.label) > -1
              }
              proficiency={getSegmentTotals(values, s)}
            />
          ))}
        </Flex>

        <Radar data={data} options={options} />
      </Flex>
    </Flex>
  );
};

export default RadarChart;
