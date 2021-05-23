const userController = require('../controllers/user-controller');
const location = require('../controllers/location');

module.exports = function (app) {
    app.post('/register', userController.register);
    app.post('/login', userController.login);
    app.delete('/user/delete/:id', userController.deleteUser);
    app.get('/user/:id', userController.getUserById);
    app.get('/allusers', userController.getAllUsers);
    app.put('/updateUser/:id', userController.editUserById);


    //// location here
    // app.post('/countries', location.postAllCountries);
    app.get('/Alllocation',location.getAllLocationDetails);
    
}