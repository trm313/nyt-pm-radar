import axios from "axios";
/**
 * GOOGLE FORMS
 */

/*
Input: input -> validate -> addForm() -> localStorage && state: forms[]
Retrieval: localStorage -> state: forms[]
[{ id: '123', title: 'My Form' }]


fn(id) -> state: formData{}
{
  id,
  labels,
  responses: []
}

*/

export const fetchAndCompileResponsesForForm = async (id) => {
  // GET forms/:id && GET form/:id/responses
  let form = await getForm(id);
  let responses = await getFormResponses(id);

  // Parse questions to a uniform data structure that accounts for specific app logic requirements
  let questions = await compileFormQuestions(form);
  let competencyQuestions = questions.filter((q) => q.type === "choice");
  competencyQuestions.shift();

  // From the question titles, compile the labels that will be used in the radar chart
  // Format: ['label1', 'lable2', ... n]
  let labels = await compileDataLabels(questions);

  // Parse survey responses into uniform data structure based on questions
  let responsesParsed = await compileFormResponses(questions, responses);

  return {
    labels,
    questions: competencyQuestions,
    responses: responsesParsed,
  };
};

export const getForm = (id) => {
  const tetheredGetForm = (resolve, reject) => {
    axios
      .get(`https://forms.googleapis.com/v1beta/forms/${id}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  };
  return new Promise(tetheredGetForm);
};

const getFormResponses = (id) => {
  const tetheredGetFormResponses = (resolve, reject) => {
    axios
      .get(`https://forms.googleapis.com/v1beta/forms/${id}/responses`)
      .then((res) => {
        resolve(res.data.responses);
      })
      .catch((err) => {
        reject(err);
      });
  };
  return new Promise(tetheredGetFormResponses);
};

const compileFormQuestions = (form) => {
  const tetheredCompileFormQuestions = (resolve, reject) => {
    let questions = form.items.map((item) => {
      let questionObj = new Object();
      questionObj.itemId = item.itemId;
      questionObj.title = item.title;

      // If question item (as opposed to eg. pageBreakItem)
      if (item.questionItem) {
        let q = item.questionItem;

        questionObj.questionId = q.question.questionId;

        // Determine question type
        if (q.question.choiceQuestion) {
          questionObj.type = "choice";
        } else if (q.question.textQuestion) {
          questionObj.type = "comment";
        }
      } else {
        questionObj.type = "other";
      }
      return questionObj;
    });

    resolve(questions);
  };
  return new Promise(tetheredCompileFormQuestions);
};

const compileFormResponses = (questions, responses) => {
  const tetheredCompileFormResponses = (resolve, reject) => {
    let parsedResponses = responses.map((r) => {
      let response = new Object();
      response.responseId = r.responseId;
      response.createTime = r.createTime;
      response.answers = {};

      let questionsFiltered = questions.filter((q) => q.type !== "other");

      questionsFiltered.map((q) => {
        if (r.answers[q.questionId]?.textAnswers?.answers[0].value) {
          let strAnswer = r.answers[q.questionId].textAnswers.answers[0].value;
          response.answers[q.questionId] = {};
          response.answers[q.questionId].string = strAnswer;

          if (isNaN(parseInt(strAnswer[0]))) {
            response.answers[q.questionId].value = 0;
          } else {
            response.answers[q.questionId].value = parseInt(strAnswer[0]);
          }
        } else {
          response.answers[q.questionId] = { string: "", value: 0 };
        }
      });

      return response;
    });
    resolve(parsedResponses);
  };
  return new Promise(tetheredCompileFormResponses);
};

const compileDataLabels = (questions) => {
  const tetheredCompileDataLabels = (resolve, reject) => {
    let questionsFiltered = questions.filter((q) => q.type === "choice");
    let submitterQuestion = questionsFiltered.shift();

    let labels = questionsFiltered.map((q) => q.title.split("-")[0].trim());
    resolve(labels);
  };
  return new Promise(tetheredCompileDataLabels);
};

export const compileRadarDataSeries = (questions, responses) => {
  let series = questions.map((q) => {
    let sum = 0;
    let avg = 0;

    let nonZeroResponses = responses.filter(
      (r) => r.answers[q.questionId].value > 0
    );
    nonZeroResponses.map((r) => (sum += r.answers[q.questionId].value));

    if (nonZeroResponses.length > 0) {
      avg = sum / nonZeroResponses.length;
    }
    return avg;
  });

  return series;
};

/**
 * PARSING SURVEY RESPONSES FROM GOOGLE SHEETS
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
