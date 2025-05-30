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

      const resultToken = submitResult.map((value) => value.token);
      const testResult = await submitToken(resultToken);

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
const updateProblem = async (req, res) => {
  const { id } = req.params;
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
    if (!id) {
      return res.status(400).send("Missing Id");
    }
    const dsaProblem = Problem.findById(id);
    if (!dsaProblem) {
      return res.status(400).send("Id is not present in server");
    }
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

      const resultToken = submitResult.map((value) => value.token);
      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id != 3) {
          return res.status(400).send("Error occured");
        }
      }
    }

    const newProblem = await Problem.findByIdAndUpdate(
      id,
      { ...req.body },
      { runValidators: true, new: true }
    );

    return res.status(200).send(newProblem);
  } catch (error) {
    return res.status(500).send("error: ", error);
  }
};
const deleteProblem = async(req,res) => {
  const {id} = req.params ;
  try {
    if(!id){
      return res.status(400).send("id is missing")
      }

    const deletedProblem = await Problem.findByIdAndDelete(id)
      if(!deletedProblem) {
          return res.status(404).send("problem is missing")
      }
      return res.status(200).send("successfully deleted")
  } catch (error) {
    return res.status(500).send("error: " , error)
  }
}
const getProblemById = async(req,res) => {
   const {id} = req.params ;
  try {
    if(!id){
      return res.status(400).send("id is missing")
      }
      const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode  ');
 
      if(!getProblem) {
          return res.status(404).send("problem is missing")
      }
      return res.status(200).send(getProblem)
  } catch (error) {
    return res.status(500).send("error: " , error)
  }
}
const getAllProblems = async(req ,res) => {
  
  try {
    
      const getProblem = await Problem.find({}).select('_id title  difficulty tags ');
 
      if(getProblem.length == 0) {
          return res.status(404).send("problem is missing")
      }
      return res.status(200).send(getProblem)
  } catch (error) {
    return res.status(500).send("error: " , error)
  }
}

module.exports = { createProblem, updateProblem , deleteProblem ,getProblemById ,getAllProblems    };
