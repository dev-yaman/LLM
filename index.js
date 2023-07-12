const {CONFIGS} = require('./configs.js');

const express = require('express');
const axios = require('axios');
const https = require('https');
const path = require('path');


const app = express();
const port = 3000;

const agent = new https.Agent({
  rejectUnauthorized: false,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/query', (req, res) => {

  const query = req.body.query
  const lambda = req.body.lambda || 0;
  const metadataFilter = req.body.metadataFilter || "";

  console.log({lambda,query, metadataFilter})

  if(!query) throw new Error('Query is required')

  const requestBody = bodyObject(query,lambda, metadataFilter)

  axios.post('https://api.vectara.io:443/v1/query', requestBody, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIGS.TOKEN}`,
      'customer-id': 3886461347,
      "x-api-key": CONFIGS.API_KEY,
    },
    httpsAgent: agent,
  })
  .then((response) => {
    const responseData = response.data;
    res.json(responseData);
  })
  .catch((error) => {
    res.status(500).json({ error: error.message || "Server Error" });
  });
});

function bodyObject(query,lambda, metadataFilter) {
    return {
        query: [
          {
            query: query,
            queryContext: "",
            numResults: 10,
            corpusKey: [
              {
                customerId: 3886461347,
                corpusId: 4,
                semantics: 0, // RESPONSE
                metadataFilter: metadataFilter,
                lexicalInterpolationConfig: {
                  lambda: lambda,
                },
                dim: [],
              },
            ],
            summary: [
              {
                summarizerPromptName: "",
                maxSummarizedResults: 5,
                responseLang: "eng",
                summarizerPromptId: 1,
                promptText: "",
                debug: false,
                responseChars: 0,
              },
            ],
          },
        ],
      };


}

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
