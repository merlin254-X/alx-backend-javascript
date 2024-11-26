// 2-read_file.js
const fs = require('fs');

function countStudents(path) {
  try {
    // Read the file synchronously
    const data = fs.readFileSync(path, 'utf8');

    // Split file content into lines and filter out empty lines
    const lines = data.trim().split('\n').filter((line) => line !== '');
    if (lines.length === 0) {
      throw new Error('Cannot load the database');
    }

    // Extract the header and rows
    const header = lines[0].split(',');
    const rows = lines.slice(1).map((line) => line.split(','));

    // Process student data
    const fieldIndex = header.indexOf('field');
    const firstNameIndex = header.indexOf('firstname');
    if (fieldIndex === -1 || firstNameIndex === -1) {
      throw new Error('Invalid database format');
    }

    const studentCount = rows.length;
    console.log(`Number of students: ${studentCount}`);

    // Group students by field
    const fieldGroups = {};
    rows.forEach((row) => {
      const field = row[fieldIndex];
      const firstName = row[firstNameIndex];
      if (field && firstName) {
        if (!fieldGroups[field]) {
          fieldGroups[field] = [];
        }
        fieldGroups[field].push(firstName);
      }
    });

    // Log results by field
    for (const [field, students] of Object.entries(fieldGroups)) {
      console.log(
        `Number of students in ${field}: ${students.length}. List: ${students.join(', ')}`
      );
    }
  } catch (error) {
    throw new Error('Cannot load the database');
  }
}

module.exports = countStudents;
