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
        firstName,
        lastName,
        email,
        phone,
    };



    const response = await axios.post(
      process.env.TARGET_ENDPOINT,
      payload,
      {
        headers: {
          'x-api-key': process.env.API_KEY,
          linked_account_id: process.env.LINKED_ACCOUNT_ID,
          slug: process.env.SLUG,
          sync_execution: true
        },
      }
    );

    // console.log(response.data)
    console.log("---------------------------")
    const obj=JSON.parse(response.data.return_value)
    console.log(obj)
    const resObj={isSuccess:obj.isSuccess}
    if(!obj.isSuccess) resObj["error"]=JSON.parse(obj.error.message).message

    res.status(obj.isSuccess ? response.status :400 ).json(resObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
