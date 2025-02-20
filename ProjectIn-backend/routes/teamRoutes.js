const express = require('express');
const router = express.Router();
const { createTeam, sendInvite, updateInvitation , removeRejected,getTeam} = require('../controllers/teamController');

// Routes
router.post('/create', createTeam);
router.post('/send-invite', sendInvite);
router.post('/update-invitation', updateInvitation);
router.post('/remove-rejected', removeRejected);
router.get('/:teamId', getTeam);

module.exports = router;



