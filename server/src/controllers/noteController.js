const Note = require("../models/Note");

// list notes for logged-in user
async function listNotes(req, res) {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ updatedAt: -1 });
    return res.json({ notes });
  } catch (err) {
    console.error("listNotes error", err);
    return res.status(500).json({ message: "server error" });
  }
}

// create note
async function createNote(req, res) {
  try {
    const { title, body } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "title is required" });
    }
    const note = await Note.create({
      userId: req.userId,
      title: title.trim(),
      body: body || ""
    });
    return res.status(201).json({ note });
  } catch (err) {
    console.error("createNote error", err);
    return res.status(500).json({ message: "server error" });
  }
}

// delete note
async function deleteNote(req, res) {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ _id: id, userId: req.userId });
    if (!note) return res.status(404).json({ message: "note not found" });

    await note.deleteOne();
    return res.json({ message: "deleted" });
  } catch (err) {
    console.error("deleteNote error", err);
    return res.status(500).json({ message: "server error" });
  }
}

module.exports = { listNotes, createNote, deleteNote };
