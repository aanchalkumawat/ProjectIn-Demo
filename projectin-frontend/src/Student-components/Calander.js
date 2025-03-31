import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './Calander.css';

function Calander() {
  const currentYear = new Date().getFullYear();
  const initialDate = new Date(currentYear, 0, 1);
  const [calendarDate, setCalendarDate] = useState(initialDate);
  const [notes, setNotes] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [noteText, setNoteText] = useState('');

  const handleTileClick = (date) => {
    setSelectedDate(date);
    setNoteText(notes[date.toISOString().split('T')[0]] || '');
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
      delete updatedNotes[dateKey];
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
    <div className="student-calendar-container">
      <h3>{currentYear} Calendar</h3>

      <Calendar
        onChange={setCalendarDate}
        value={calendarDate}
        view="month"
        minDate={new Date(currentYear, 0, 1)}
        maxDate={new Date(currentYear, 11, 31)}
        tileClassName={({ date }) => {
          const dateKey = date.toISOString().split('T')[0];
          if (notes[dateKey]) return 'student-yellow-event';
          return null;
        }}
        onClickDay={handleTileClick}
      />

      {selectedDate && (
        <div className="student-calendar-modal">
          <div className="student-calendar-modal-content">
            <h4>Add/Edit Note for {selectedDate.toDateString()}</h4>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your note here..."
              rows={4}
            />
            <div className="student-calendar-modal-buttons">
              <button onClick={handleNoteSave}>Save Note</button>
              <button onClick={handleNoteDelete} className="student-calendar-delete-button">Delete Note</button>
              <button onClick={handleNoteCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calander;