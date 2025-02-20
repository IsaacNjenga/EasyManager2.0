import moment from "moment";
import LoginModel from "../models/LoginModel.js";
import LogoutModel from "../models/LogoutModel.js";

const getLogins = async (req, res) => {
  try {
    const logins = await LoginModel.find({});
    res.status(201).json({ success: true, logins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

const getLogouts = async (req, res) => {
  try {
    const logouts = await LogoutModel.find({});
    res.status(201).json({ success: true, logouts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

const logout = async (req, res) => {
  const { name, number, role } = req.body;
  try {
    const logoutTime = moment().format("DD-MM-YYYY, HH:mm:ss");
    const logoutInfo = new LogoutModel({ number, name, role, logoutTime });
    await logoutInfo.save();
    console.log("Logout captured");
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error!" });
  }
};

export { getLogouts, getLogins, logout };
