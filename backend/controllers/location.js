const mongoDb = require('mongodb');

url  ="mongodb://localhost:27017/School-Auth";

var database;

var location_Collection = 'location';

var countries = {};

mongoDb.MongoClient.connect(url , {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, location)=> {
    if(err){
        console.log('Error in connecting Location Db');
    } else {
        database = location.db();
        console.log('Location is Connected Successfully')
    }
})




exports.getAllLocationDetails = ((req, res, next)=> {
    let locationOb = [
        {
            id: 1,
            name: 'India',
            state : 
            [
                {
                    id:1,
                    name:'Maharashtra'
                },
                {
                    id:2,
                    name:'MP'
                },
                {
                    id:3,
                    name:'UP'
                },
            ]
        },
        {
            id: 2,
            name: 'UK',
            state: [
    
            ]
        },
        
        
    ]
    database.collection(location_Collection).find({}).toArray((err)=>{
        if(err){
            res.status(400).json({
                success:false,
                message: 'Error in Processing Request'
            })
        } else {
            
            res.status(200).json({
                success: true,
                message:'Location Fetch Successfully',
                details: locationOb
            })
        }
    })
})