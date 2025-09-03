import React, { useEffect, useState } from "react";
import { getNotes, createNote, deleteNote } from "../api";
import NoteForm from "../components/Noteform";
import NoteList from "../components/Notelist";

function Dashboard({ user }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await getNotes();
        console.log(data);
        
        setNotes(data.notes);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };
    fetchNotes();
  }, []);

const addNote = async (noteData) => {
  try {
    const { data } = await createNote(noteData);
    setNotes([...notes, data.note]);
  } catch (err) {
    console.error("Error creating note:", err);
  }
};


  const removeNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {user?.name || user?.email}</h2>
      <NoteForm addNote={addNote} />
      <NoteList notes={notes} removeNote={removeNote} />
    </div>
  );
}

export default Dashboard;
