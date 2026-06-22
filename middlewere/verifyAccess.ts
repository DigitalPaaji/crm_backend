import type { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken"
import Emp from "../model/employModel";

 export const verifyAccess= async(req: Request,res: Response,next: NextFunction)=>{
try {
    const authHeader = req.headers.authorization;
   const {role} = req.query

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
        const user = await Emp.findById(decoded.id);
    
        if (user && user.role =="admin") {
              (req as any).user = user;

return next();
        }
      if(role=="agency"  && user && user.access.includes("create agency") )
{
      (req as any).user = user;

    return next();
}


      if(role=="emp"  && user && user.access.includes("create employee") )
{
      (req as any).user = user;

return next();
}



         return res.status(404).json({
            success: false,
            message: "You are not Authorized",
          });


} catch (error) {
      return res.status(401).json({
      success: false,
      message: "Unauthorized or token expired",
    });
}
}





 export const verifyAccesstoDelete= async(req: Request,res: Response,next: NextFunction)=>{
try {
    const authHeader = req.headers.authorization;
   const {role} = req.query

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
        const user = await Emp.findById(decoded.id);
    
        if (user && user.role =="admin") {
              (req as any).user = user;

return next();
        }
      if(role=="agency"  && user && user.access.includes("create agency") )
{
      (req as any).user = user;

    return next();
}


      if(role=="emp"  && user && user.access.includes("create employee") )
{
      (req as any).user = user;

return next();
}



         return res.status(404).json({
            success: false,
            message: "You are not Authorized",
          });


} catch (error) {
      return res.status(401).json({
      success: false,
      message: "Unauthorized or token expired",
    });
}
}


