import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Import react-calendar component
import './Calander.css'; // Import Calendar-specific styles

function Calander() {
  const currentYear = new Date().getFullYear();
  const initialDate = new Date(currentYear, 0, 1); // Start at Jan 1 of the current year
  const [calendarDate, setCalendarDate] = useState(initialDate);
  const [notes, setNotes] = useState({}); // Store notes as { "YYYY-MM-DD": "Note text" }

  const [selectedDate, setSelectedDate] = useState(null); // For handling note addition
  const [noteText, setNoteText] = useState(''); // Note text entered by the user

  const handleTileClick = (date) => {
    setSelectedDate(date);
    setNoteText(notes[date.toISOString().split('T')[0]] || ''); // Prefill if note exists
  };

  const handleNoteSave = () => {
    if (selectedDate) {
      const dateKey = selectedDate.toISOString().split('T')[0];
      setNotes({ ...notes, [dateKey]: noteText });
      setSelectedDate(null);
      setNoteText('');
    }
  };

  const handleNoteDelete = () => {
    if (selectedDate) {
      const dateKey = selectedDate.toISOString().split('T')[0];
      const updatedNotes = { ...notes };
      delete updatedNotes[dateKey]; // Delete the note for the selected date
      setNotes(updatedNotes);
      setSelectedDate(null);
      setNoteText('');
    }
  };

  const handleNoteCancel = () => {
    setSelectedDate(null);
    setNoteText('');
  };

  return (
    <div className="calendar-container">
      <h3>{currentYear} Calendar</h3>

      {/* Full Calendar from react-calendar */}
      <Calendar
        onChange={setCalendarDate}
        value={calendarDate}
        view="month" // Show month view
        minDate={new Date(currentYear, 0, 1)} // Restrict to Jan 1 of the current year
        maxDate={new Date(currentYear, 11, 31)} // Restrict to Dec 31 of the current year
        tileClassName={({ date }) => {
          const dateKey = date.toISOString().split('T')[0];
          if (notes[dateKey]) return 'yellow-event'; // Mark yellow if a note exists
          return null;
        }}
        onClickDay={handleTileClick} // Handle date clicks
      />

      {/* Modal for Adding/Editing Notes */}
      {selectedDate && (
        <div className="calendar-modal">
          <div className="calendar-modal-content">
            <h4>Add/Edit Note for {selectedDate.toDateString()}</h4>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your note here..."
              rows={4}
            />
            <div className="calendar-modal-buttons">
              <button onClick={handleNoteSave}>Save Note</button>
              <button onClick={handleNoteDelete} className="calendar-delete-button">Delete Note</button>
              <button onClick={handleNoteCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calander; 