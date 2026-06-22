import fs from "fs";
import path from "path";



export const DeleteFile = async(filepath : string)=>{
    const fullpath = path.join(process.cwd(),filepath)
    if(fs.existsSync(fullpath)){
        fs.promises.unlink(fullpath)
    }
}


