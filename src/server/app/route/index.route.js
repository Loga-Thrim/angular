const express = require("express")
const app = express()
const http = require("http").Server(app)
const body = require("body-parser")
const cors = require("cors")
const path = require("path")

module.exports = ()=>{
    const component = require("../components/index.component")

    app.use(body.urlencoded())
    app.use(body.json())
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
    app.use(cors({
        origin: 'http://localhost:4200'
    }))

    app.use('/js', express.static(path.join(__dirname + "../../../../../dist/bakara")))
    app.use('/css', express.static(path.join(__dirname + "../../../../../dist/bakara")))
    app.use(express.static(path.join(__dirname + "../../../../../dist/bakara")))

    app.get("/", component.home)
    app.post("/register", component.register_api)
    app.post("/login", component.login_api)
    app.get("/memberpage")
    app.get("/member", component.check_member)
    app.post("/formula", component.formula)
    app.post("/listmember", component.listmember)
    app.post("/updatecredit", component.update_credit)

    app.get("/admin", component.home)
    app.get("/dashboard", component.home)
    app.get("/member", component.home)
    app.get("/register", component.home)
    app.get("/formula", component.home)

    return http
}