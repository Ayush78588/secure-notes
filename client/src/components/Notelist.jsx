import React from "react";

function NoteList({ notes, removeNote }) {
  return (
    <ul>
      {notes.map((note) => (
        <li key={note._id} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
          <strong>{note.title}</strong>
          <p>{note.body}</p>
          <button onClick={() => removeNote(note._id)} style={{ marginLeft: "20px" }}>
            Delete
          </button>
        </li>

      ))}
    </ul>
  );
}

export default NoteList;
