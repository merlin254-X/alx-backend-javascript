import readDatabase from '../utils.js';

class StudentsController {
  static async getAllStudents(req, res) {
    const dbPath = process.argv[2];
    try {
      const data = await readDatabase(dbPath);
      const sortedFields = Object.keys(data).sort((a, b) => a.localeCompare(b));
      const response = ['This is the list of our students'];

      sortedFields.forEach((field) => {
        response.push(
          `Number of students in ${field}: ${data[field].length}. List: ${data[field].join(', ')}`
        );
      });

      res.status(200).send(response.join('\n'));
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async getAllStudentsByMajor(req, res) {
    const { major } = req.params;
    const dbPath = process.argv[2];

    if (!['CS', 'SWE'].includes(major)) {
      res.status(500).send('Major parameter must be CS or SWE');
      return;
    }

    try {
      const data = await readDatabase(dbPath);
      res.status(200).send(`List: ${data[major].join(', ')}`);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

export default StudentsController;
