const mongoose = require('mongoose');

const remarksSchema = new mongoose.Schema({
  teamId: { type: String, required: true },
  remarksHistory: [
    {
      date: { type: Date, required: true },
      remarks: { type: String, required: true },
      description: { type: String } // Optional
    }
  ]
});

const Remarks = mongoose.model('Remarks', remarksSchema);
module.exports = Remarks;
