'use strict'
module.exports = function(app, data){
    var post = require('../controllers/postController');
    console.log();
    console.log("All Posts GET /posts")
    console.log("New Post POST /posts")
    console.log("View Post GET /posts/:postId")
    console.log("Update Post PUT /posts/:postId")
    console.log("Delete Post DELETE /posts/:chatId/:postId")
    
    
    app.route('/posts')
        .get(post.list_all_posts)
        .post(post.create_new_post);

    app.route('/posts/:chatId/:postId')
        .get(post.view_a_post)
        .put(post.update_a_post)

    app.route('/posts/:chatId/:postId') 
       .delete(post.delete_a_post);
}