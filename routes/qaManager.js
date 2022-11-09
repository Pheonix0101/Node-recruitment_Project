var express = require("express");
var router = express.Router();
var details = require("../db");
// var sql = require("mssql");
var sql = require("msnodesqlv8");
var bodyParser = require('body-parser');
const { json } = require("body-parser");
var app = express();
//const { Connection, Request } = require("tedious");
var jsonParser = bodyParser.json()


function authUser(req, res, next) {
  if (req.user == null) {
    res.status(403);
    return res.send("You need to sign in");
  }
  next();
}

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401);
      return res.send("Not Allowed");
    }
    next();
  };
}

function isAuthenticated(req, res, next) {
  if (!req.session.isAuthenticated) {
      return res.redirect('/auth/signin'); // redirect to sign-in route
  }

  next();
};

// router.get("/", (req, res) => {
//  // res.send("Home Page of qaManager");
//  function getData() {
//   // Create connection instance
//   var conn = new sql.ConnectionPool(details.config);
 
//   conn.connect()
//   // Successfull connection
//   .then(function () {
 
//     // Create request instance, passing in connection instance
//     var req = new sql.Request(conn);
 
//     // Call mssql's query method passing in params
//     req.query("SELECT TOP 10 * FROM QueandAns")
//     .then(function (recordset) {
//       console.log(recordset);
//       res.send(recordset);
//       conn.close();
//     })
//     // Handle sql statement execution errors
//     .catch(function (err) {
//       console.log(err);
//       conn.close();
//     })
 
//   })
//   // Handle connection errors
//   .catch(function (err) {
//     console.log(err);
//     conn.close();
//   });
//  }
 
//  getData();
// });


router.post("/", jsonParser, (req, res) => {

  if(req.body != undefined){
      const id = req.body.id;
      const compId = req.body.compId;
      const skillId = req.body.skillId;

      function getData() {
          // Create connection instance
          var conn = new sql.ConnectionPool(details.config);
      
          conn
            .connect()
            // Successfull connection
            .then(function () {
              // Create request instance, passing in connection instance
              var req = new sql.Request(conn);
      
              // Call mssql's query method passing in params
              req
                .query(
                  `SELECT Question, Answer, queansId FROM QueandAns WHERE compId=${compId} AND skillId =${skillId}`
                )
                .then(function (recordset) {
                  console.log(recordset);
                  const{recordset: data} = recordset;
                   res.send(( data[id]));
                  conn.close();
                })
                // Handle sql statement execution errors
                .catch(function (err) {
                  console.log(err);
                  res.send(err);
                  conn.close();
                });
            })
            // Handle connection errors
            .catch(function (err) {
              console.log(err);
              res.send(err);
              conn.close();
            });
        }
      
        getData();


  }else{
      res.send("Error");
  }
});


// router.post("/allQA", jsonParser, (req, res) => {

//   if(req.body != undefined){
//       const compId = req.body.compId;
//       const skillId = req.body.skillId;

//       function getData() {
//           // Create connection instance
//           var conn = new sql.ConnectionPool(details.config);
      
//           conn
//             .connect()
//             // Successfull connection
//             .then(function () {
//               // Create request instance, passing in connection instance
//               var req = new sql.Request(conn);
      
//               // Call mssql's query method passing in params
//               req
//                 .query(
//                   `SELECT Question, Answer, queansId FROM QueandAns WHERE compId=${compId} AND skillId =${skillId}`
//                 )
//                 .then(function (recordset) {
//                   console.log(recordset);
//                   const{recordset: data} = recordset;
//                   const jData = {data};
//                    res.send(jData);
//                   conn.close();
//                 })
//                 // Handle sql statement execution errors
//                 .catch(function (err) {
//                   console.log(err);
//                   res.send(err);
//                   conn.close();
//                 });
//             })
//             // Handle connection errors
//             .catch(function (err) {
//               console.log(err);
//               res.send(err);
//               conn.close();
//             });
//         }
      
//         getData();


//   }else{
//       res.send("Error");
//   }
// });

router.post("/allQA", jsonParser, (req, res)=>{
  if(req.body != undefined){
    const cmpId = req.body.compId;
    const skillId = req.body.skillId;

    async function getData()
    {
      await sql.open(details.connectionString, async (err, conn)=>{
      await  conn.query( `SELECT Question, Answer FROM QandA WHERE cmpId=${cmpId} AND skillId =${skillId}`,(err, data)=>{
          if(data){
            console.log(data);
            const result = { data };
            res.status(200).json(result);
          }
          if(err){
            console.log(err);
            res.send(err);
          }
        })
        if(err){
          console.log(err);
          res.send(err);
        }
      })
    }
   
    getData();
  }
})

module.exports = router;
