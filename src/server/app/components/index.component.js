const request = require("request")
const mongodb = require("mongodb").MongoClient
const url_mongodb = "mongodb+srv://gfdwizardking:godframedark8654@fomula-bakara-bemxk.mongodb.net/test?retryWrites=true&w=majority"
const jwt = require("jsonwebtoken")
const path = require("path")

// generate password
const bcrypt = require("bcrypt")
const salt_rounds = 10

// socket.io

exports.home = (req, res) => {
    res.sendFile(path.join(__dirname + "../../../../../dist/bakara/index.html"))
}

exports.register_api = (req, res, next) => {
    username = req.body.username
    password = req.body.password
    email = req.body.email
    recaptcha = req.body.recaptcha

    member_already = 0

    if (username && password && email) {
        secret_key = "6LcN0rcUAAAAAJFVbvMg8HQxAbl9gm6o56y_k2j2"
        verify_url = `https://google.com/recaptcha/api/siteverify?secret=${secret_key}
        &response=${recaptcha}&remoteip=${req.connection.remoteAddress}`

        request(verify_url, (err, response, body) => {
            body = JSON.parse(body)
            if (body.success !== undefined && !body.success) {
                res.json({ status: "error", title: "กรุณายืนยัน reCaptcha", msg: "กรุณากดที่ยืนยัน ฉันไม่ใช่โปรแกรมอัตโนมัติ" })
            } else {
                mongodb.connect(url_mongodb, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
                    if (err) throw err

                    dbcon = db.db("fomula_bakara")

                    function checkUser() {
                        return new Promise(function (resolve, reject) {
                            dbcon.collection("member").find({}).toArray((err, result) => {
                                if (err) throw err
                                result.every(snap => {
                                    if (snap.username == username) {
                                        res.json({ status: "error", title: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว", msg: "มีชื่อผู้ใช้นี้แล้วในระบบ" })
                                        //resolve
                                        member_already = 1

                                        return false
                                    } else if (snap.email == email) {
                                        res.json({ status: "error", title: "อีเมลนี้ถูกใช้งานแล้ว", msg: "มีอีเมลนี้แล้วในระบบ" })
                                        member_already = 2
                                    } else return true
                                });
                                resolve(member_already)
                            })
                        })
                    }


                    checkUser().then(userHad => {
                        if (userHad == 0) {
                            bcrypt.hash(password, 10, (err, hash) => {
                                if (err) throw err
                                register_insert = {
                                    username: username,
                                    password: hash,
                                    email: email,
                                    credit: 0
                                }

                                dbcon.collection("member").insert(register_insert, (err, call) => {
                                    if (err) throw err
                                    res.json({ status: "success" })
                                })
                            })
                        }
                    })
                })
            }
        })
    } else {
        res.json({ status: "error", title: "ท่านกรอกข้อมูลให้ครบ", msg: "กรุณายืนยันกรอกข้อมูลให้ครบก่อนกดปุ่มสมัครสมาชิก" })
    }
}



exports.login_api = (req, res, next) => {
    username = req.body.username
    password = req.body.password

    if (username == "" || password == "") {
        res.json({ status: 'error', title: 'กรอกข้อมูลไม่ครบ', msg: "กรุณากรอกข้อมูลให้ครบ" })
    }

    mongodb.connect(url_mongodb, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
        if (err) throw err

        dbcon = db.db("fomula_bakara")
        dbcon.collection("member").find({}).toArray((err, result) => {
            if (err) throw err
            function login_check() {
                return new Promise(function (resolve, reject) {
                    result.every(function (snap) {
                        if(snap.username == username){
                            member_username = snap.username
                            hash = snap.password
                            result = {username: snap.username, password: snap.password,
                                     credit: snap.credit, email: snap.email}
                            
                            if(snap.admin){
                                result = {username: snap.username, password: snap.password, admin: true}
                            }

                            return false
                        } else{
                            result = "wrong"
                            return true
                        }
                    });
                    resolve(result) 
                })
            }

            login_check().then(result => {
                if(result == "wrong") {
                    res.json({status: "fail", msg: "ชื่อผู้ใช้ไม่ถูกต้อง"})
                    return next()
                }
                else if(result.username){
                    bcrypt.compare(password, result.password, (err, compare_status)=>{
                        if(compare_status){
                            let secret_token = "dc7fea607812548965gfdwizardkinggodframedark8654"
                            let token = jwt.sign({username: result.username,
                            email: result.email, credit: result.credit}, secret_token, { expiresIn: '7d' })

                            if(result.username == 'admin'){
                                res.json({status: "success", admin: true, token: token})
                                return next()
                            }
                            
                            res.json({status: "success", token: token})
                            return next()
                        } else {
                            res.json({status: "fail", msg: "รหัสผ่านไม่ถูกต้อง"})
                            return next()
                        }
                    })
                }
            })

        })
    })
}

exports.check_member = (req, res)=>{
    let token = req.query.token
    secret_token = "dc7fea607812548965gfdwizardkinggodframedark8654"
    jwt.verify(token, secret_token, (err, token_data)=>{
        if (err) res.json({status: "error", msg: "token request."})

        if(token_data){
            if(token_data.username == "admin"){
                res.json({username: "wrong"})
            } else {
                mongodb.connect(url_mongodb, {useNewUrlParser: true, useUnifiedTopology: true}, (err, db)=>{
                    if(err) throw err

                    dbcon = db.db("fomula_bakara")
                    dbcon.collection("member").find({username: token_data.username}).toArray((err, result)=>{
                        result.forEach(snap => {
                            res.json({username: token_data.username, email: token_data.email, credit: snap.credit})          
                        });
                    })
                })
            }
        }
    })
}

exports.formula = (req, res)=>{
    username = req.body.username
    credit = req.body.credit

    mongodb.connect(url_mongodb, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
        dbcon = db.db("fomula_bakara")
        if(credit >= 5){
            dbcon.collection("member").updateOne({username: username}, {$set:{
                credit: credit-5
            }}, (err, doc)=>{
                if (err) throw err

                res.json({status: "success"})
            })
        }
    })
}


exports.listmember = (req, res)=>{
    id = 0
    mongodb.connect(url_mongodb, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
        dbcon = db.db("fomula_bakara")
        let arr_list = []
        dbcon.collection("member").find({}).toArray((err, result)=>{
            result.forEach(snap=>{
                arr_list.push({
                    id: id,
                    username: snap.username,
                    credit: snap.credit
                })
                id++
            })
            res.json(arr_list)
        })
    })
}

exports.update_credit = (req, res)=>{
    username = req.body.username
    credit = req.body.credit

    mongodb.connect(url_mongodb, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
        dbcon = db.db("fomula_bakara")
        dbcon.collection("member").updateOne({username: username}, {$set: {
            credit: credit
        }}, (err, doc)=>{
            if (err) throw err

            res.json({status: "success"})
        })
    })
}