const { MongoClient, uri } = require('./config.js')

MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    const dbo = db.db("db");
    const mysort = { age : 1}
    const query = { school : "평촌경영고"}
    dbo.collection("VM_STUDENT_LIST").find({}, {projection: {_id : 0, name : 1, age : 1, school : 1}}).sort(mysort).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
    });
    dbo.collection("VM_STUDENT_LIST").find(query, {projection : {_id:0}}).toArray((err,result) => {
        if(err) throw err
        console.log(result)
        db.close()
    })
  });