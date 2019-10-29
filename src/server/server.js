const app = require("./app/route/index.route")()
const port = process.env.PORT || 5000

app.listen(port, ()=>{
    console.log(`App on port ${port}`)
})