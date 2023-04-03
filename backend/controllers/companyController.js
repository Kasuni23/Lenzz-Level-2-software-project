const Company = require("../models/companyModel");
const jwt = require("jsonwebtoken");
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" });
};
//create company
const createCompany = async (req, res) => {
  const {
    companyname,

    contactnumber,
    companyemail,
    companyaddress,
  } = req.body;
  const { id, selectedJob } = req;
  if (selectedJob != "SYSTEM ADMIN") {
    return res.status(401).json({ error: "User is not authorized" });
  }

  try {
    const companyKey = generateRandomString(8);
    const user_id = req.user._id;
    const company = await Company.createcompany(
      companyname,

      contactnumber,
      companyaddress,
      companyemail,
      user_id,
      companyKey
    );
    const token = createToken(company._id);
    res.status(200).json({ company, companyname, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkcompany = async (req, res) => {
  const { companyKey } = req.body;
  const { id, selectedJob } = req;
  if (selectedJob === "SYSTEM ADMIN") {
    return res.status(401).json({ error: "User is not authorized" });
  }
  try {
    const company = await Company.findOne({ companyKey });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    console.log(company.companyname);
    res.status(200).json({ company });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//generate company  random key
const generateRandomString = (myLength) => {
  try {
    const chars =
      "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
    const randomArray = Array.from(
      { length: myLength },
      (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );

    const randomString = randomArray.join("");
    return randomString;
  } catch (error) {
    throw new Error("Failed to generate random string.");
  }
};

const randomkey = async (req, res) => {
  try {
    const key = generateRandomString(8);
    res.send(key);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCompany,
  checkcompany,
  randomkey,
};
