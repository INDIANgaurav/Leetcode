const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblems,
  solvedAllProblemByUser,
  submittedProblem
} = require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");
const problemRouter = express.Router();

problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

problemRouter.get("/problemById/:id", userMiddleware, getProblemById);
problemRouter.get("/getAllProblem", userMiddleware, getAllProblems);
problemRouter.get(
  "/problemSolvedByUser",
  userMiddleware,
  solvedAllProblemByUser
);
problemRouter.get("/submittedProblem/:id" , userMiddleware , submittedProblem)

module.exports = problemRouter;
