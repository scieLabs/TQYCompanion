import express from 'express';
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  // TODO: authentication part
  // loginUser,
  // logoutUser,
  // checkSession,
} from '../controllers/userController.js';

// TODO: authentication part
// import {
//   validateLogin,
//   validateSignUp,
//   validateUpdateUser,
// } from "../middlewares/joiValidation.js";
// import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/', getAllUsers);
// TODO: will be: router.get("/",auth, getAllUsers);

// session routers:
router.post('/', createUser);
// TODO: will be: router.post(`/register`, validateSignUp, createUser);
// TODO: router.post(`/login`, validateLogin, loginUser);
// TODO: router.post(`/logout`, logoutUser);
// TODO: router.get("/check-session",auth, checkSession);

//
router.get('/:id', getUserById);
// TODO: will be: router.get("/:id",auth, getUserById);
router.put('/:id', updateUser);
// TODO: will be router.put("/:id",auth, validateUpdateUser, updateUser);
router.delete('/:id', deleteUser);
// TODO: will be: router.delete("/:id",auth, deleteUser);
// TODO:router.post('/login', loginUser);
// TODO:router.post('/logout', logoutUser);

/*The Machine Spirit suggests this to  validate the JWT token and return the user's data:

export const checkSession = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ authenticated: true, user: decoded });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
};
*/

export default router;
