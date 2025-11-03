// import jwt from "jsonwebtoken";
// import { Response } from "express";

// const generateToken = (userId: string, res: Response) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
//     expiresIn: "7d",
//   });

//   res.cookie("jwt", token, {
//     maxAge: 7 * 24 * 60 * 60 * 1000, //ms
//     httpOnly: true, // prevent XSS Attacks : cross-site scripting
//     sameSite: "strict", //CSRF attacks
//     secure: process.env.NODE_ENV ===  "development" ? false : true, 
//   });


//   return token;
// };

// export default generateToken;
import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (userId: string, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: "lax", // 'lax' is a good default for same-domain apps
    secure: process.env.NODE_ENV === "production",
  });

  return token;
};

export default generateToken;