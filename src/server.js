const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const rjwt = require('restify-jwt-community');
const server = restify.createServer();

//Middleware
server.use(restify.plugins.bodyParser())

//Protected Routes 
/* 
the line below helps protect all routes from unauthorized access 
i.e You need a token to perform actions on all routes except those in the unless({{path:[]}) array
*/
server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ['/api/auth', '/api/debtors/','/api/debtors:id'] }));
server.listen(config.PORT, () => {
    mongoose.set('useFindAndModify', false)
    mongoose.connect(
        config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,   
    }
    );
});

const database = mongoose.connection;
database.on('error', (err) => {
    console.log(err)
})

database.once('open', () => {
    require('./routes/debtors')(server)
    require('./routes/users')(server)
    console.log(`Server running on Port: ${config.PORT}`);
})