const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblems,
  solvedAllProblemByUser
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

module.exports = problemRouter;
