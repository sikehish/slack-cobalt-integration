const express = require('express');
const axios = require('axios');
const morgan=require("morgan")
const dotenv=require('dotenv')
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(morgan('dev'));

app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const payload = {
      event: 'Hubspot slack trigger',
      payload: {
        firstName,
        lastName,
        email,
        phone,
      },
    };



    const response = await axios.post(
      process.env.TARGET_ENDPOINT,
      payload,
      {
        headers: {
          'x-api-key': process.env.API_KEY,
          linked_account_id: process.env.LINKED_ACCOUNT_ID,
          slug: process.env.SLUG,
        },
      }
    );

    console.log(response.data)

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
