const axios = require("axios");

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default async (req, res) => {
  if (req.method === "POST") {
    try {
      const response = await axios.post(
        `${apiUrl}/create-collection`,
        req.body
      );
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(error.response.status).json(error.response.data);
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
