// const fs = require("fs");
// const path = require("path");

//Obtiene extencion
// let file= './README.md';
// let extFile = path.extname(file);
// console.log(extFile);
//lee un archivo
// fs.readFile('./README.md',function(err,data){
// if(err){
//     console.log(err);
//   }
//   console.log(data.toString());
// })
//
// fs.readdir("./test",(error,files)=>{
//   if(error){
//     console.log(error)
//   }else{
//     console.log(files)
//   }
// })
//Listar archivos
var data=[];

console.log("Buscando...")
function scanDirs(directoryPath){
   try{
      var ls=fs.readdirSync(directoryPath);

      for (let index = 0; index < ls.length; index++) {
         const file = path.join(directoryPath, ls[index]);
         var dataFile =null;
         try{
            dataFile =fs.lstatSync(file);
         }catch(e){}

         if(dataFile){
            data.push(
               {
                  path: file,
                  isDirectory: dataFile.isDirectory(),
                  length: dataFile.size
               });

            if(dataFile.isDirectory()){
               scanDirs(file)
            }
         }
      }
   }catch(e){}
}

scanDirs(dirPath);


