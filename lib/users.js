import UserModel from "@/models/user";
import dbConnect from "./db";
import bcrypt from 'bcrypt';

function isInvalidText(text) {
  return typeof text !== "string" || text.trim() === "";
}

export async function registeredUser(email, password) {
  try {
    await dbConnect();

    if (isInvalidText(email) || isInvalidText(password)) {
      return {
        message: "Invalid Input",
      };
    }

    if(!email.includes('@') ||
    !email.includes(".")){
       return {
        message: "Please enter a valid email address...",
      }; 
    }

    if(password.trim().length<8){
        return {
       message:'Password must be at least 8 characters long...'
      };      
    }

     const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password,saltRounds);

    const newUser = new UserModel({
      email,
      password:hashedPassword,
    });

    await newUser.save();

    return {
      message: "User registered successfully!",
    };
  } catch (error) {
    console.error("Failed to registered User", error);
    return {
      message: "Failed to register. Please try again.",
    };
  }
}

export async function verifyUser(email, password) {
  try {
    await dbConnect();

    if (isInvalidText(email) || isInvalidText(password)) {
      return {
        message: "Invalid Input",
      };
    }

    const findUser = await UserModel.findOne({ email }).lean();
    if (!findUser) {
      return { message: "Invalid Password or Email" };
    } else {
      const checkPassword =await bcrypt.compare(password, findUser.password);
      if (!checkPassword) {
        return {
          message: "Invalid Password or Email",
        };
      }
    }
    return {
      _id: findUser._id.toString(),
    };
  } catch (error) {
    console.error("Verification failed", error);

    return {
      message: "Verification Failed",
    };
  }
}
