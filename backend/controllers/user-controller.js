const mongoDb = require('mongodb');
const jwt = require('jsonwebtoken');
url = 'mongodb://localhost:27017/School-Auth';
var tokenkey ='jdjdjdjdjdjd'
/// declearing variable for database connection
var database;

//// creating object for readding ID for getelementByID, for delete
var objectID = mongoDb.ObjectID;

//// creating collection for users
var USERS_COLLECTION = "ALL-USERS"

mongoDb.MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, user)=> {
    if(err){
        console.log('Error in connecting DB')
    } else {
        database = user.db();
        console.log('User Db connected successfully');
    }
})


////// registering new user 
exports.register = ((req, res, next)=> 
    {
        try {
            userData ={ 
                _id : req.params.id,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phoneNo: req.body.phoneNo,
                adminAccess: false
            }
            if(!(userData.email || userData.password)){
                res.status(400).json({
                    success:false,
                    message: 'Email or Password is not defined'
                })
            }
            try{
                 //// here checking wheather user already exist in db or not 
            database.collection(USERS_COLLECTION).findOne({email: req.body.email}, (err, user)=>{
                if(err){
                    res.status(400).json({
                        success:false,
                        message: 'Error in processing request'+ err
                    })
                } else if(user) {
                    let payload = {
                        subject: userData.id
                    }
                    let _token = jwt.sign(payload, tokenkey)
                    res.status(201).json({
                        success:true,
                        message: 'User already Exist',
                        details: {
                            id: userData._id,
                            name: userData.name,
                            email:userData.email,
                            phoneNo: userData.phoneNo,
                            adminAccess: userData.adminAccess
                        },
                        token: _token
                    })
                }
                else if(!user){
                    
                    database.collection(USERS_COLLECTION).insertOne(userData, (err, newUser)=> {
                        if(err){
                            res.status(400).json({
                                success:false,
                                message: 'Error in processing request'+ err
                            })
                        } else {
                            let payload = {
                                subject: userData.id
                            }
                            let _token = jwt.sign(payload, tokenkey)
                            res.status(200).json({
                                success:true,
                                message: 'New User Created Successfully',
                                details: {
                                    id: userData._id,
                                    name: userData.name,
                                    email:userData.email,
                                    phoneNo: userData.phoneNo
                                },
                                token: _token
                            })
                        }
                    })
                }
            })
            } 

            catch {
                /// if not then register new user
                // database.collection(USERS_COLLECTION).insertOne(userData, (err, newUser)=> {
                //     if(err){
                //         res.status(400).json({
                //             success:false,
                //             message: 'Error in processing request'+ err
                //         })
                //     } else {
                //         res.status(200).json({
                //             success:true,
                //             message: 'New User Created Successfully',
                //             details: {
                //                 name: newUser.name,
                //                 email:newUser.email,
                //                 phoneNo: newUser.phoneNo
                //             }
                //         })
                //     }
                // })
            }
           
        } catch {
            res.status(400).json({
                success: false,
                message: 'Insuffcient Data'
            })
        }
    }
)

//// user login
exports.login = ((req, res, next)=> {
    try {
        loginUserData = {
            email: req.body.email,
            password: req.body.password,

        }
        database.collection(USERS_COLLECTION).findOne({email: req.body.email}, (err, user)=> {
            if(err){
                res.status(400).json({
                    success:false,
                    message: 'Error in Processing Request'
                })
            } else if(loginUserData.password === user.password) {
                console.log(user);
                let payload = {
                    subject: user.id
                }
                let _token = jwt.sign(payload, tokenkey);
                res.status(201).json({
                    success:true,
                    message: 'User Logged In Successfull',
                    details: {
                        _id: user._id,
                        name : user.name,
                        email: user.email,
                        phoneNo: user.phoneNo,
                        adminAccess: user.adminAccess
                    },
                    token: _token
                })
            } else {
                res.status(400).json({
                    success:false,
                    message: 'Either Email or Password wrong'
                })
            }
        })

    } catch {
        res.status(500).json({
            success: false,
            message: 'Invalid Credentials'
        })
    }
})


//// deleteing user
exports.deleteUser = ((req, res, next)=> {
    database.collection(USERS_COLLECTION).removeOne({_id:objectID(req.params.id)}, (err, user)=> {
        if(err){
            res.status(400).json({
                success: false,
                message: 'Error In Processing Request'
            })
        } else {
            // console.log(user);
            res.status(201).json({
                success: true,
                message:'User Deleted Successfully',
                details: user._id
            })
        }
    })
})


///// for viewing user 
exports.getUserById = ((req, res, next)=> {
    database.collection(USERS_COLLECTION).findOne({_id:objectID(req.params.id)}, (err, userById)=> {
        if(err){
            res.status(400).json({
                success: false,
                message: 'Error in Processing Request'
            })
        } else {
            res.status(201).json({
                success: true,
                message: 'User Data fetch Successfully',
                details: {
                    _id: userById._id,
                    name: userById.name,
                    email: userById.email,
                    phoneNo: userById.phoneNo,
                    adminAccess: userById.adminAccess
                }
            })
        }
    })
})

///// Getting all users
exports.getAllUsers = ((req, res, next)=> {
    database.collection(USERS_COLLECTION).find({}).toArray( (err, users)=> {
        if(err){
            res.status(400).json({
                success: false,
                message: 'Error In Processing Request'
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Users Details Fetch Succussfully',
                details: users
            })
        }
    })
})


//// editing users by id
exports.editUserById = ((req, res, next)=> {
    
    database.collection(USERS_COLLECTION).updateOne({_id:objectID(req.params.id)},{
        $set: req.body
    }, (err, updatedUser)=> {
        if(err){
            res.status(400).json({
                success: false,
                message: 'Error In Processing Request'
            })
        } else {
            res.status(201).json({
                success: true,
                message: 'User Updated Succesffuly',
                details: updatedUser
                
            })
        }
    })
})