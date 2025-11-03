// import jwt from "jsonwebtoken";
// import { Response } from "express";

// const generateToken = (userId: string, res: Response) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
//     expiresIn: "7d",
//   });

//   res.cookie("jwt", token, {
//     maxAge: 7 * 24 * 60 * 60 * 1000, //ms
//     httpOnly: true, // prevent XSS Attacks : cross-site scripting
//     // sameSite: "strict", //CSRF attacks
//     // secure: process.env.NODE_ENV ===  "development" ? false : true, 
//      sameSite: "none",
//      secure: true 
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

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //ms
    httpOnly: true, // prevent XSS Attacks
    sameSite: isProduction ? "none" : "lax", 
    secure: isProduction, 
  });

  return token;
};

export default generateToken;