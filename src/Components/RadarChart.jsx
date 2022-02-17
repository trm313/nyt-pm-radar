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

import SegmentOption from "./SegmentOption";

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
    backgroundColor: "rgba(22,160,133,.2)", // Green Sea
    borderColor: "none",
    borderWidth: 0,
  },
  {
    label: "Product Execution",
    data: [0, 0, 0, 3, 3, 3, 3],
    indexes: [3, 4, 5],
    backgroundColor: "rgba(46,204,113,.2)", // Emerald
    borderColor: "none",
    borderWidth: 0,
  },
  {
    label: "Leadership",
    data: [0, 0, 0, 0, 0, 0, 0, 3, 3, 3],
    indexes: [6, 7, 8],
    backgroundColor: "rgba(52,152,219,.2)", // Blue
    borderColor: "none",
    borderWidth: 0,
  },
  {
    label: "Cross Functional",
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3],
    indexes: [9, 10],
    backgroundColor: "rgba(155,89,182,.2)", // Amethyst
    borderColor: "none",
    borderWidth: 0,
  },
  {
    label: "Technical & Insights",
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3],
    indexes: [11, 12, 13, 14],
    backgroundColor: "rgba(52,73,94,.2)", // Wet Asphalt
    borderColor: "none",
    borderWidth: 0,
  },
  {
    label: "People Mgmt",
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3],
    indexes: [15, 16, 17],
    backgroundColor: "rgba(243,156,18,.2)", // Orange
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

const RadarChart = ({
  form,
  labels,
  values,
  minimal = false,
  size = sizes.auto,
}) => {
  const [segments, setSegments] = useState([segmentDatasets[0]]);

  // TODO: To retain the chart animations for the segments, instead of removing it from the data array, could simply toggle the values for that segment between 0 and 3
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
        // backgroundColor: "rgba(255, 99, 132, 0.8)", // pink
        backgroundColor: "rgba(142,68,173, 0.8)", // blue
        borderColor: "rgba(142,68,173, 1)",
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
      <Heading fontSize='lg' fontWeight='bold' mb='8'>
        {form.name}
      </Heading>
      <Flex w='full' direction='column' justify='center' alignItems='center'>
        <Flex justify='center' wrap='wrap'>
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
        <Flex w='full' maxW='2xl'>
          <Radar data={data} options={options} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default RadarChart;
