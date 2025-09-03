import React, { useState } from "react";

function NoteForm({ addNote }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    addNote({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px", 
        maxWidth: "500px"
      }}
    >
      <input
        type="text"
        placeholder="Enter note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "10px", fontSize: "16px" }}
      />

      <textarea
        placeholder="Enter note body (optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          minHeight: "120px",
          resize: "vertical"
        }}
      />

      <button
        type="submit"
        style={{
          padding: "10px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        Add Note
      </button>
    </form>
  );
}

export default NoteForm;
