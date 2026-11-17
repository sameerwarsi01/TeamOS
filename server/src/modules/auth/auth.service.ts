
import bcrypt from "bcryptjs";
import User from "../users/user.model";
import type {
  RegisterInput,
  LoginInput,
} from "./auth.validation";

export const registerUser = async (data: RegisterInput) => {
  // 1. Check if email already exists
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // 3. Create user in MongoDB
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  // 4. Exclude password from returned user data
  const { password: _password, ...safeUser } = user.toObject();

  return safeUser;
};

export const loginUser = async (data: LoginInput) => {
  // 1. Find user by email
  const user = await User.findOne({
    email: data.email,
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Compare entered password with hashed password
  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // 3. Exclude password from returned user data
  const { password: _password, ...safeUser } = user.toObject();

  return safeUser;
};