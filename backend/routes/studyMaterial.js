const express= require("express")
const studyMaterial = express.Router();
const DB=require('../DB/dbConn.js')
const multer = require('multer');



// //Gets all the news in the DB
// studyMaterial.get('/', async (req,res, next)=>{
//    try{
//        var queryResult=await DB.allNovice();
//        res.json(queryResult)
//    }
//    catch(err){
//        console.log(err)
//        res.sendStatus(500)
//    }
// })


// //Gets one new based on the id
// studyMaterial.get('/:id', async (req,res, next)=>{
//    try{
//        var queryResult=await DB.oneNovica(req.params.id)
//        res.json(queryResult)
//    }
//    catch(err){
//        console.log(err)
//        res.sendStatus(500)
//    }
// })

// var bodyParser = require('body-parser')
// // create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
// const upload = multer({ dest: 'uploads/' }); // or configure storage options

// //Inserts one new item to the database
// studyMaterial.post('/', upload.single('file'), async (req, res) => {
   
//     let material_type = req.body.material_type;
//     let title = req.body.title;
//     let status = req.body.status;
//     let academic_year = req.body.academic_year;
//     let study_program = req.body.study_program;
//     let university = req.body.university;
//     let description = req.body.description;
//     let c_id = req.body.c_id;

//    var isCompleteMaterial = material_type && title && status && academic_year && study_program && university && description && c_id;
//    if (isCompleteMaterial)
//    {
//        try{
//            var queryResult=await DB.publishStudyMaterial(material_type, title, status, academic_year, study_program, university, description, c_id)
//            if (queryResult.affectedRows) {
//                console.log("New study material is added!!")
//              }
//        }
//        catch(err){
//            console.log(err)
//            res.status(500)
//        }   
//    } 
//    else
//    {
//     console.log("A field is empty!!")
//    }
//    res.end()


//  })
module.exports=studyMaterial
