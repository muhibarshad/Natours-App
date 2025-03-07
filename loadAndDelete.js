const fs = require('fs')
const mongoose = require('mongoose')
exports.loadData = (DB_name, model_name, file_name)=>{
    // mongoose.connect(`mongodb://localhost:27017/Natours-Local-DB`).then(()=>{
    mongoose.connect(`mongodb://localhost:27017/${DB_name}`).then(()=>{
        console.log("Local Database connected Successfully")
    }).catch((err)=>{
        console.log("Error")
    })
    fs.readFile(file_name,'utf-8',(err,data)=>{
        if(err){
            console.log(`Error during reading data\n Error : ${err} `)
        }
    const d = JSON.parse(data)
       model_name.create(d,{validateBeforeSave:false}).then(()=>{
        console.log(d)
       }).catch((err)=>{
        console.log(`Error during writing data\n Error : ${err} `)
       })
    });
}
exports.deleteData = async (DB_name, model_name)=>{
   await mongoose.connect(`mongodb://localhost:27017/${DB_name}`).then(()=>{
        console.log("Local Database connected Successfully")
    }).catch((err)=>{
        console.log("Error")
    })
    const result = await model_name.deleteMany({});
    if(result.deletedCount > 0){
        console.log("Data Deleted Successfully")
    }
    else{
        console.log("Failed")
        console.log(result)
    }
}

