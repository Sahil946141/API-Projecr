const express = require('express');
const authRoutes = require('./routes/auth');
const professorRoutes = require('./routes/professor');
const appointmentRoutes = require('./routes/appointment');
const studentRoutes = require('./routes/student');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/professors', professorRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/students', studentRoutes);

app.use(errorHandler);

module.exports = app;
