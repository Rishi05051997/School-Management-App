const  express = require('express');
const http = require('http');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 1997;

app.use(express.urlencoded({
    extended: true,
}));

app.use(express.json());

//// registering routing middleware
require('./router/routes')(app);

http.createServer(app).listen(port, (err)=> {
    if(err){
        console.log(err)
    } else {
        console.log(`server is up at ${port}`)
    }
})

