const express = require('express');
const fs = require('fs');

const app = express();

/**
 * Reads the database file and computes statistics about students.
 * @param {string} filePath - Path to the database file (CSV format).
 * @returns {Promise<string>} - A promise resolving to the student statistics.
 */
function countStudents(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
        return;
      }

      const lines = data
        .trim()
        .split('\n')
        .filter((line) => line); // Removes empty lines

      const students = lines.slice(1).map((line) => line.split(','));
      const totalStudents = students.length;
      const fields = {};

      students.forEach((student) => {
        const field = student[3];
        const name = student[0];
        if (!fields[field]) {
          fields[field] = [];
        }
        fields[field].push(name);
      });

      let response = `Number of students: ${totalStudents}\n`;

      Object.keys(fields).forEach((field) => {
        response += `Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}\n`;
      });

      resolve(response.trim());
    });
  });
}

// Root route
app.get('/', (req, res) => {
  res.send('Hello Holberton School!');
});

// Students route
app.get('/students', (req, res) => {
  const dbPath = process.argv[2];
  if (!dbPath) {
    res.status(500).send('Database file is required');
    return;
  }

  countStudents(dbPath)
    .then((stats) => {
      res.type('text/plain');
      res.send(`This is the list of our students\n${stats}`);
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

// Listen on port 1245
app.listen(1245, () => {
  console.log('Server is listening on port 1245');
});

module.exports = app;
