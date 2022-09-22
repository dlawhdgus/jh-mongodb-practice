const express = require('express')
const app = express()
const config = require('./config')
const port = 3000
const mongodb = require('mongodb')
const MongoClient = require('mongodb').MongoClient

app.listen(port, ()=> {
  console.log('server on!!')
})

MongoClient.connect(config.MONGODB_CONNECTION_STRING, {
  useUnifiedTopology: 1
} , (err,database) => {
  if(err) console.log('db disconnected',err)
  console.log('db connected!!')
  const db = database.db('db')
  const db_collection = db.collection("VM_STUDENT_LIST")

  app.get('/',(req,res) => {
    res.send('sucess loading')
  })

  app.post('/createuser', (req,res) => {
    const { name, age, school, startDate, address, gender, endDate } = req.query
    const filter_bool = {}
    const filter = {}
    filter_bool.name = name ? filter.name = name : 0
    filter_bool.age = age ? filter.age = Number(age) : 0
    filter_bool.school = school ? filter.school = school : 0
    filter_bool.startDate = startDate ? filter.startDate = Date(startDate) : 0
    filter_bool.address = address ? filter.address = address : 0
    filter_bool.gender = gender ? filter.gender = Number(gender) : 0
    filter_bool.endDate = endDate ? filter.endDate = Date(endDate) : 0
    console.log(filter.gender)
    if(filter_bool.gender) {
      if(!(filter.gender === 1 || filter.gender === 0)){
        res.send('0(남자) 또는 1(여자)을 선택해주세요')
      }

    } else {
      db_collection.insertOne(filter,(err,result) => {
        if(err) throw err
        if(result.acknowledged === true){
          filter.comment = `성공적으로 만들어 졌습니다.`
          res.send(filter)
        } else {
          res.send('만들지 못하였습니다.')
        }
      })
    }
  })

  app.get('/getuser', (req,res) => {
    const { name, age, school, startDate, address, gender, endDate } = req.query
    const filter_bool = {}
    const filter = {}
    filter_bool.name = name ? filter.name = name : 0
    filter_bool.age = age ? filter.age = Number(age) : 0
    filter_bool.school = school ? filter.school = school : 0
    filter_bool.startDate = startDate ? filter.startDate = Date(startDate) : 0
    filter_bool.address = address ? filter.address = address : 0
    filter_bool.gender = gender ? filter.gender = Number(gender) : 0
    filter_bool.endDate = endDate ? filter.endDate = Date(endDate) : 0
    /*
    const projection_bool = {}
    if(filter_bool.name){
      projection_bool.name = 1
    }
    if(filter_bool.age){
      projection_bool.age = 1
    }
    if(filter_bool.school){
      projection_bool.school = 1
    }
    if(filter_bool.startDate){
      projection_bool.startDate = 1
    }
    if(filter_bool.address){
      projection_bool.address = 1
    }
    if(filter_bool.gender){
      projection_bool.gender = 1
    }
    if(filter_bool.endDate){
      projection_bool.endDate = 1
    }
    */
    db_collection.find(filter,{projection : /*projection_bool*/{}}).toArray((err,result) => {
      if(err) throw err
      if(isEmptyArr(result) === true){
        res.send('일치하는 값이 없습니다.')
      } else {
        res.send(result)
      }
    })
  })

  
  app.post('/updateuser', (req,res) => {
    const { name, age, school, startDate, address, gender, endDate } = req.query
    const { ch_name, ch_age, ch_school, ch_startDate, ch_address, ch_gender, ch_endDate } = req.query
    const filter_bool = {}
    const condition = {}
    if(name){
      filter_bool.name = name
    }
    if(age){
      filter_bool.age = Number(age)
    }
    if(school){
      filter_bool.school = school
    }
    if(startDate){
      filter_bool.startDate = Date(startDate)
    }
    if(address){
      filter_bool.address = address
    }
    if(gender){
      filter_bool.gender = Number(gender)
    }
    if(endDate){
      filter_bool.endDate = Date(endDate)
    }
    if(ch_name){
      condition.name = ch_name
    }
    if(ch_age){
      condition.age = Number(ch_age)
    }
    if(ch_school){
      condition.school = ch_school
    }
    if(ch_startDate){
      condition.startDate = Date(ch_startDate)
    }
    if(ch_address){
      condition.address = ch_address
    }
    if(ch_gender){
      condition.gender = Number(ch_gender)
    }
    if(ch_endDate){
      condition.endDate = Date(ch_endDate)
    }
    console.log(filter_bool,condition)
    db_collection.updateOne(filter_bool,{$set : condition},(err,result) => {
      if(err) throw err
      if(result.matchedCount === 0){
        res.send('업데이트할 값이 없습니다.')
      } else {
        res.send('성공적으로 업데이트 하였습니다.')
      }
    })
    
  })
  
  app.post('/deleteOne_user', (req,res) => {
    const { name, age, school, startDate, address, gender, endDate } = req.query
    const filter_bool = {}
    const filter = {}
    filter_bool.name = name ? filter.name = name : 0
    filter_bool.age = age ? filter.age = Number(age) : 0
    filter_bool.school = school ? filter.school = school : 0
    filter_bool.startDate = startDate ? filter.startDate = Date(startDate) : 0
    filter_bool.address = address ? filter.address = address : 0
    filter_bool.gender = gender ? filter.gender = Number(gender) : 0
    filter_bool.endDate = endDate ? filter.endDate = Date(endDate) : 0
    console.log(filter)
    db_collection.deleteOne(filter,(err,result) => {
      if(err) throw err
      if(result.deletedCount === 0){
        res.send('지울 대상이 없습니다.')
      } else{
        res.send('성공적으로 지웠습니다.')
      }
    })
    
  })

  app.post('/deleteMany_user', (req,res) => {
    const { name, age, school, startDate, address, gender, endDate } = req.query
    const filter_bool = {}
    const filter = {}
    filter_bool.name = name ? filter.name = name : 0
    filter_bool.age = age ? filter.age = Number(age) : 0
    filter_bool.school = school ? filter.school = school : 0
    filter_bool.startDate = startDate ? filter.startDate = Date(startDate) : 0
    filter_bool.address = address ? filter.address = address : 0
    filter_bool.gender = gender ? filter.gender = Number(gender) : 0
    filter_bool.endDate = endDate ? filter.endDate = Date(endDate) : 0
    console.log(filter)
    db_collection.deleteMany(filter,(err,result) => {
      if(err) throw err
      if(result.deletedCount === 0){
        res.send('지울 대상이 없습니다.')
      } else{
        res.send('성공적으로 지웠습니다.')
      }
    })
    
  })
})

function isEmptyArr(arr)  {
  if(Array.isArray(arr) && arr.length === 0) return true;
  else return false;
}