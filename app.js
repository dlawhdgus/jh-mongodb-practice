const express = require('express')
const app = express()
const config = require('./config')
const port = 3000
const mongodb = require('mongodb')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.json())
app.use(express.urlencoded({extended : false}));

MongoClient.connect(config.MONGODB_CONNECTION_STRING, {
  useUnifiedTopology: 1
} , (err,database) => {
  if(err) console.log('db disconnected',err)
  console.log('db connected!!')
  const db = database.db('db')
  const db_collection = db.collection("VM_STUDENT_LIST")

  app.post('/createuser', (req,res) => {
    const { name, age, school, startDate, address, gender, endDate } = req.body
    const filter = {}

    if(name){filter.name = name}
    else{res.send('name 값을 입력해주세요')}
    if(age){filter.age = Number(age)}
    else{res.send('age 값을 입력해주세요')}
    if(school){filter.school = school}
    if(startDate){filter.startDate = Date(startDate)}
    if(address){filter.address = address}
    else{res.send('address 값을 입력해주세요')}
    if(gender){filter.gender = Number(gender)}
    if(endDate){filter.endDate = Date(endDate)}
    if(gender >=3 ){res.send('0(남자) 또는 1(여자)을 선택해주세요')}
    
    db_collection.insertOne(filter,(err,result) => {
      if(err) throw err
      if(result.acknowledged === true){
        filter.comment = `성공적으로 만들어 졌습니다.`
        res.send(filter)
      } else {
        res.send('만들지 못하였습니다.')
      }
    })
  })

  app.get('/getuser', (req,res) => {
    const { name, age, school, startDate, address, gender, endDate } = req.query
    const filter = {}
    if(name){filter.name = name}
    if(age){filter.age = Number(age)}
    if(school){filter.school = school}
    if(startDate){filter.startDate = Date(startDate)}
    if(address){filter.address = address}
    if(gender){filter.gender = Number(gender)}
    if(endDate){filter.endDate = Date(endDate)}
    
    db_collection.find(filter,{projection : {}}).toArray((err,result) => {
      if(err) throw err
      if(isEmptyArr(result) === true){
        res.send('일치하는 값이 없습니다.')
      } else {
        res.send(result)
      }
    })
  })

  app.get('/finduser/:_id',(req,res) => {
    const { _id } = req.params
    db_collection.find({_id : mongodb.ObjectId(_id)},{projection : {}}).toArray((err,result) => {
      if(err) throw err
      if(isEmptyArr(result) === true){
        res.send('일치하는 값이 없습니다.')
      } else {
        res.send(result)
      }
    })
  })

  /**
   * @todo update시에는 _id값으로 검색해야 함 (자동으로 인덱싱이 되어 있어 검색속도가 가장 빠름)
   */
  app.post('/updateuser/:_id', (req,res) => {
    const { _id } = req.params
    
    const { name, age, school, startDate, address, gender, endDate } = req.body
    const filter = {}
    if(name){filter.name = name}
    if(age){filter.age = Number(age)}
    if(name){filter.name = name}
    if(age){filter.age = Number(age)}
    if(school){filter.school = school}
    if(startDate){filter.startDate = Date(startDate)}
    if(address){filter.address = address}
    if(gender){filter.gender = Number(gender)}
    if(endDate){filter.endDate = Date(endDate)}
    
    db_collection.updateOne({_id : mongodb.ObjectId(_id)},{$set : filter},(err,result) => {
      if(err) throw err
      if(result.matchedCount === 0){
        res.send('업데이트할 값이 없습니다.')
      } else {
        res.send('성공적으로 업데이트 하였습니다.')
      }
    })
    
  })
  
  app.post('/deleteOne_user/:_id', (req,res) => {
    const { _id } = req.params
    db_collection.deleteOne({_id : mongodb.ObjectId(_id)},(err,result) => {
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

app.listen(port, ()=> {
  console.log('server on!!')
})