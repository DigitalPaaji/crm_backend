import type { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken"
import Client from "../model/ClientSchema";
import ClientSubUser from "../model/SubClientModel";


export const SubClientMiddlewere= async(req: Request,res: Response,next: NextFunction)=>{
  try {
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }
      const token = authHeader.split(" ")[1];

    
     const decoded = JWT.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;


       if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
         }

         console.log(decoded.id)
        const Subuser = await ClientSubUser.findById(decoded.id);
    console.log(Subuser)
        if (!Subuser) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
        const user = await Client.findById(Subuser.client)
          if (!user ) {
          return res.status(404).json({
            success: false,
            message: "Client not found",
          });
        }
      
 const todayDate = Date.now();
const validityDate = new Date(user.validity).getTime();

if (validityDate < todayDate || !user.active) {
  return res.status(403).json({
    success: false,
    message: "Client account validity expired",
  });
}


           (req as any).user = Subuser;

    next();


} catch (error) {
console.log(error)

      return res.status(401).json({
      success: false,
      message: "Unauthorized or token expired",
    });
}
}



