import type { NextFunction, Request, Response } from "express";
import Emp from "../model/employModel";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken"
import { sendWelcomeEmail } from "../helper/sendMail";


export const CreateAdmin = async(req:Request,res:Response,next:NextFunction)=>{
try {
    const {email,password,name} = req.body


     if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

      const existingAdmin = await Emp.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

      const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = await Emp.create({
     email,password:hashedPassword,name,role:"admin"   
    });



   return res.status(201).json({
      success: true,
      message: "Admin created successfully"
    })



} catch (error) {
    next(error)
}
}

export const LoginAdmin =  async(req:Request,res:Response,next:NextFunction)=>{
    try {
   const {email,password}= req.body;
  
   if(!email || !password ){  return res.status(400).json({
        success: false,
        message: "Email and password are required",
      }); }

 const admin = await Emp.findOne({
    email,role:"admin"
 })

if(!admin){
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
}

const compairPassword = await bcrypt.compare(password,admin.password);
if(!compairPassword){
    return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
}

const token = await JWT.sign({id:admin._id,role: admin.role,},  process.env.JWT_SECRET as string,{
    expiresIn:"60d"
})


 return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });





        
    } catch (error) {
        next(error)
    }
}

export const LoginEmp =  async(req:Request,res:Response,next:NextFunction)=>{
    try {
   const {email,password}= req.body;
   
  
   if(!email || !password ){  return res.status(400).json({
        success: false,
        message: "Email and password are required",
      }); }

 const admin = await Emp.findOne({
    email,role:"emp"
 })

if(!admin){
      return res.status(404).json({
        success: false,
        message: "Emp. not found",
      });
}

const compairPassword = await bcrypt.compare(password,admin.password);
if(!compairPassword){
    return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
}

const token = await JWT.sign({id:admin._id,role: admin.role,},  process.env.JWT_SECRET as string,{
    expiresIn:"60d"
})


 return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });





        
    } catch (error) {
        next(error)
    }
}

export const LoginAgency =  async(req:Request,res:Response,next:NextFunction)=>{
    try {
   const {email,password}= req.body;
   
  
   if(!email || !password ){  return res.status(400).json({
        success: false,
        message: "Email and password are required",
      }); }

 const admin = await Emp.findOne({
    email,role:"agency"
 })

if(!admin){
      return res.status(404).json({
        success: false,
        message: "Emp. not found",
      });
}

const compairPassword = await bcrypt.compare(password,admin.password);
if(!compairPassword){
    return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
}

const token = await JWT.sign({id:admin._id,role: admin.role,},  process.env.JWT_SECRET as string,{
    expiresIn:"60d"
})


 return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });





        
    } catch (error) {
        next(error)
    }
}




export const createEmp = async(req:Request,res:Response,next:NextFunction)=>{
try {
  const {email,password,name} = req.body
 const {role} = req.query

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if(password.length < 5 || password.length > 25)
{
       return res.status(400).json({
        success: false,
        message: `Your password is too ${password.length < 5 ? "Short" :"Long"}  ,
        Enter Password between 5-25 chr`,
      }); 
}
 const existingAdmin = await Emp.findOne({ email });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }


const hashedPassword = await bcrypt.hash(password, 10);
    
await Emp.create({
     email,password:hashedPassword,name,role: role as "emp" | "agency"
    });

 await sendWelcomeEmail(email,password)

   return res.status(201).json({
      success: true,
      message: "Employee created successfully"
    })

    


} catch (error) {
    next(error)
}
}

export const getAllEMp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 16;
    const role= req.query.role as "emp" |"agency"



    const skip = (page - 1) * limit;

    const emp = await Emp.find({role:role})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalEmp = await Emp.countDocuments({role:role});

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalEmp / limit),
      totalEmp,
      emp,
    });
  } catch (error) {
    next(error);
  }
};

export const emplStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const employee = await Emp.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    employee.active = !employee?.active  ;

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee status updated",
    });
  } catch (error) {
    next(error);
  }
};


export const emplRemove = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const employee = await Emp.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }



    await employee.deleteOne();

    res.status(200).json({
      success: true,
      message: "Employee Delete ",
    });
  } catch (error) {
    next(error);
  }
};

interface Auth extends Request{
  user : any
}

export const getUser = async(req:Auth,res:Response,next:NextFunction)=>{
  try {
const user = req.user;
return res.json({success:true,user})
    
  } catch (error) {
    next(error)
  }
}


export const EditProfile = async (
  req: Auth,
  res: Response,
  next: NextFunction
) => {
  try {
    const { profile } = req.body;
    const user = req.user;

    const findUser = await Emp.findById(user._id);

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    findUser.profile =Number(profile);

    await findUser.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};



export const changePassword = async(req:Auth,res:Response,next:NextFunction)=>{
try {
  const {currentPassword,newPassword}= req.body;
  const user = req.user;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }
    
 const findUser = await Emp.findById(user._id).select("+password");

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const compairPassword = await bcrypt.compare(currentPassword,findUser.password)


  if(!compairPassword){
    return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
  }

   

      const hashedPassword = await bcrypt.hash(newPassword, 10);
findUser.password= hashedPassword;

await findUser.save()
   return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
} catch (error) {
  next(error)
}
} 




