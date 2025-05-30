const Problem = require("../models/Problems");
const Submission = require("../models/Submission");
const {
  getLanguageById,
  submitBatch,
  submitToken,
} = require("../utils/ProblemUtils");
const submitCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;
    if (!userId || !code || !problemId || !language) {
      return res.status(400).send("field are missing");
    }
    // databse se problem fetch kro
    const problem = Problem.findById(problemId);
    // iske baad submission ko store kara du sbse pehle kuki judge0 ki koi confirmation nahi hai wo har baar response dega usse bachne k liye

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length,
    });

    const languageId = getLanguageById(language);
    const submissions = problem.map((testCases) => ({
      source_code: code,
      language_id: languageId,
      stdin: testCases.input,
      expected_output: testCases.output,
    }));
    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((value) => value.token);
    const testResult = await submitToken(resultToken);
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let errorMessage = null;
    let status = "accepted";
    // submitresult ko update karna padega
    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime = runtime + parseFloat(test.time);
        memory = Math.max(memory, test.memory);
      } else {
        if (test.status_id == 4) {
          status = "error";
          errorMessage = test.stderr;
        } else {
          status = "wrong";
          errorMessage = test.stderr;
        }
      }
    }

    // store kara do ab db me in submission
    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errorMessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;
    await submittedResult.save();

    return res.status(201).send(submittedResult)
  } catch (error) {
    return res.status(500).send(error)
  }
};

module.exports = submitCode;
