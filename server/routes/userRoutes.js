import express from 'express';
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  checkSession,
} from '../controllers/userController.js';


// } from "../middlewares/joiValidation.js";
// import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/', getAllUsers);
router.get('/check-session', checkSession);
// TODO: will be: router.get("/",auth, getAllUsers);

// session routers:
router.post('/register', createUser);
// TODO: will be: router.post(`/register`, validateSignUp, createUser);
// TODO: router.post(`/login`, validateLogin, loginUser);
// TODO: router.post(`/logout`, logoutUser);
// TODO: router.get("/check-session",auth, checkSession);

//
router.get('/:id', getUserById);
// TODO: will be: router.get("/:id",auth, getUserById);
router.put('/:id', updateUser);
// TODO: will be router.put("/:id",auth, validateUpdateUser, updateUser);
router.delete("/:id", deleteUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

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
