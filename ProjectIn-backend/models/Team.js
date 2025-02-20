const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  leader: {
    name: String,
    rollno: String,
    email: String,
    course: String
  },
  invitations: [
    {
      email: String,
      status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
      }
    }
  ]
});

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;

