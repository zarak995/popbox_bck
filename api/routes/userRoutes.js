'use strict';
module.exports = function (app, data) {
    var user = require('../controllers/userController');
    console.log();
    console.log("All Users GET /users")
    console.log("View user GET /users/:userId")
    console.log("Update User PUT /users/:userId")
    console.log("Delete User DELETE /users/:userId")
    console.log("Change username PUT /users/:userId")
    
    
    app.route('/users')
        .get(user.list_all_users)

    app.route('/users/:userId')
        .get(user.view_a_user)
        .put(user.update_a_user)
        .delete(user.delete_a_user);
    
        app.route('/users/change_pass/:userId')
        .put(user.change_user_password)
}