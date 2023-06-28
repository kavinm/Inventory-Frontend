const axios = require("axios");

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
module.exports = async (req, res) => {
  try {
    const response = await axios.get(`${apiUrl}/collections`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response.status).json(error.response.data);
  }
};
