const Problem = require("../models/Problems");

const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/ProblemUtils");

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    visibleTestCases,
    hiddenTestCases,
    startCode,
    refrenceSolution,
    problemCreator,
  } = req.body;
  try {
    for (const { language, completeCode } of refrenceSolution) {
      //source code
      // language id
      // stdin
      // expectedOutput
      const languageId = getLanguageById(language);
      const submissions = visibleTestCases.map((testCases) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testCases.input,
        expected_output: testCases.output,
      }));
      const submitResult = await submitBatch(submissions);
      console.log(submitResult)
      const resultToken = submitResult.map((value) => value.token);
      const testResult = await submitToken(resultToken);
      console.log(testResult)
      for (const test of testResult) {
        if (test.status_id != 3) {
          return res.status(400).send("Error occured");
        }
      }
    }

    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });

    res.status(200).send("Problem saved successfully");
  } catch (error) {
    res.status(400).send("error: " + error);
  }
};

module.exports = createProblem