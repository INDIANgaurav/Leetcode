const axios = require("axios");

const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    java: 62,
    javascript: 63,
  };
  return language[lang.toLowerCase()];
};

const submitBatch = async (submission) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "true",
    },
    headers: {
      "x-rapidapi-key": "d4cdf96d8dmsh63321960b5596e3p16948fjsn2bf3bb9be9d2",
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submission,
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
      //to yaha ye return me hume kya dega ? to judge0 hume ek token dega array ke form me har question ke alag alag wo token hume firse judg0 ko dene hai or wo fir jaake uska answer hume batayega usme kuch status_id hogi jese agar 3 hai to accepted , 1 -> queued , 2->processing , 4 -> wrong ans , 5 -> tle and so on....
    } catch (error) {
      console.error(error);
    }
  }

  return await fetchData();
};
module.exports = { getLanguageById, submitBatch };
