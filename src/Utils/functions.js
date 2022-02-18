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
