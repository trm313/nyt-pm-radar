/**
 *
 */

let commentIndexes = [5, 10, 14, 17, 22, 26];
let valueIndexes = [
  2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 15, 16, 18, 19, 20, 21, 23, 24, 25,
];

export const compileSurveyResponses = (data) => {
  let range = data.range;
  let rawResponses = data.values;

  // Compile labels, removing descriptions if present
  let labels = [];

  // Compile Labels
  let headerRow = data.values[0];
  for (let i = 0; i < valueIndexes.length; i++) {
    if (headerRow[valueIndexes[i]]) {
      labels.push(headerRow[valueIndexes[i]].split(" - ")[0].trim());
    }
  }
  rawResponses.splice(0, 1);

  let responses = rawResponses.map((answers, index) => {
    // Grab Comments
    let comments = [];
    for (let i = 0; i < commentIndexes.length; i++) {
      if (answers[commentIndexes[i]]) {
        comments.push(answers[commentIndexes[i]]);
      }
    }

    // Parse Values
    let values = [];
    for (let i = 0; i < valueIndexes.length; i++) {
      if (answers[valueIndexes[i]] === "Have not Observed / Unable to Rate") {
        values.push(0);
      } else {
        values.push(parseInt(answers[valueIndexes[i]].split(" - ")[0]));
      }
    }

    return {
      timestamp: answers[0],
      submitter: answers[1],
      values,
      comments,
    };
  });

  return {
    labels,
    responses,
  };
};

export const compileAveragesFromAllResponses = (responses) => {
  if (responses.length === 0) {
    return [];
  }

  let nonZeroResponseCounts = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  let dataSeries = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  responses.map((response, responseIndex) => {
    response.values.map((answer, questionIndex) => {
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
