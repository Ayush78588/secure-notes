const express = require("express");
const { authRequired } = require("../middleware/authMiddleware");
const { listNotes, createNote, deleteNote } = require("../controllers/noteController");

const router = express.Router();

router.get("/", authRequired, listNotes);
router.post("/", authRequired, createNote);
router.delete("/:id", authRequired, deleteNote);

module.exports = router;
