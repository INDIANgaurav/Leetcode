const {getLanguageById , submitBatch} = require("../utils/ProblemUtils");

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
      const submission = visibleTestCases.map((input, output) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));
      const submitResult = await submitBatch(submission)
    }
  } catch (error) {}
};
