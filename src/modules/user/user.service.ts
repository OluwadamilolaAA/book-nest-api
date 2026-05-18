import User, { Role } from "./user.model";
import BadRequestError from "../../common/errors/bad-request";
import UnauthorizedError from "../../common/errors/unauthorized-error";
import { createTokenUser } from "../../common/utils/jwt";
import bcrypt from "bcrypt";

type updateUserData = {
  name: string;
  email: string;
};

type updateUserPasswordData = {
  newPassword: string;
  oldPassword: string;
};

const getAllUsers = async () => {
  const users = await User.find({ role: Role.USER }).select("-password");
  return users;
};

const getUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new BadRequestError(`No user with Id: ${userId}`);
  }
  return user;
};

const showCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new BadRequestError("User not found");
  }
  return user;
};

const updateUser = async (userId: string, data: updateUserData) => {
  const { name, email } = data;
  if (!name && !email) {
    throw new BadRequestError("Please provide name or email");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new BadRequestError("User not found");
  }

  if (email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== userId) {
      throw new BadRequestError("Email already exists");
    }

    user.email = email;
  }

  if (name) {
    user.name = name;
  }
  await user.save();
  return { user: createTokenUser };
};

const updateUserPassword = async (
  userId: string,
  data: updateUserPasswordData,
) => {
  const { newPassword, oldPassword } = data;

  if (!newPassword || !oldPassword) {
    throw new BadRequestError("Please provide old password and new password");
  }

  if (newPassword.length < 6) {
    throw new BadRequestError("Password must be at least 6 characters long");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new BadRequestError("User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Old password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();
  return user;
};

export { getAllUsers, getUser, showCurrentUser, updateUser, updateUserPassword };
