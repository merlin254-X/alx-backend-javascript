const express = require('express');
const fs = require('fs');
const path = require('path');

// Create an Express application
const app = express();

// Function to read the database and process the CSV file
const readDatabase = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        return reject(new Error('Cannot load the database'));
      }

      const content = data.split('\n').filter((line) => line.trim() !== ''); // Remove empty lines
      const studentsByField = {};

      for (let i = 1; i < content.length; i++) {
        const [firstName, , , field] = content[i].split(',');
        if (firstName && field) {
          if (!studentsByField[field]) {
            studentsByField[field] = [];
          }
          studentsByField[field].push(firstName);
        }
      }
      resolve(studentsByField);
    });
  });
};

// Route for '/'
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('Hello Holberton School!');
});

// Route for '/students'
app.get('/students', (req, res) => {
  const databaseFile = process.argv[2]; // Get the database file from command-line arguments
  res.setHeader('Content-Type', 'text/plain');

  if (!databaseFile) {
    res.status(500).send('Cannot load the database');
    return;
  }

  readDatabase(databaseFile)
    .then((studentsByField) => {
      let output = 'This is the list of our students\n';
      const totalStudents = Object.values(studentsByField).reduce(
        (count, students) => count + students.length,
        0
      );
      output += `Number of students: ${totalStudents}\n`;

      for (const [field, students] of Object.entries(studentsByField).sort()) {
        output += `Number of students in ${field}: ${students.length}. List: ${students.join(', ')}\n`;
      }

      res.status(200).send(output.trim());
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

// Start the server
app.listen(1245, () => {
  console.log('Server is running on port 1245');
});

// Export the app for testing or further use
module.exports = app;
