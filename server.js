import express from 'express';
import fs from 'fs';
import cors from 'cors'; // Import the cors package

const app = express();
const port =  3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/submit-form', (req, res) => {
  const { fullName, email } = req.body;

  // Check if fullName and email are provided
  if (!fullName || !email) {
    return res.status(400).json({ message: 'Full name and email are required.' });
  }

  // Read the existing data from formData.json
  fs.readFile('../my-vue-app/src/assets/formData.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ message: 'Error reading formData.json' });
    }

    // Parse the existing data
    let formData;
    try {
      formData = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return res.status(500).json({ message: 'Error parsing formData.json' });
    }

    // Add the new submission to the data
    formData.push({ fullName, email });

    // Write the updated data back to formData.json
    fs.writeFile('../my-vue-app/src/assets/formData.json', JSON.stringify(formData, null,  2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ message: 'Error writing to formData.json' });
      }

      // Send a success response
      res.status(200).json({ message: 'Submission received.' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});