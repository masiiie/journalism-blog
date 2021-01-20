const express = require('express');
const router = express.Router();

const post_controllers = require('./controllers/post')
const user_controllers = require('./controllers/user')
const tag_controllers = require('./controllers/tag')
const gallery_controllers = require('./controllers/gallery')


const jwt = require('express-jwt')

const getTokenFromHeaders = (req) => {    
    console.log("REQ: " + JSON.stringify(req.headers));
    const { headers: { authorization } } = req;
    if(authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];}
    return null;
};
const auth = jwt({
    secret: process.env.JWT_SECRET,
    //getToken: getTokenFromHeaders,
    userProperty: 'payload',
    algorithms: ['sha1', 'RS256', 'HS256']
})


router
    .route('/posts')
    .post(auth, post_controllers.create_one)  // solo lo puede crear el administrador
    .get(post_controllers.get_all)

router.get('/post_query', post_controllers.query)
router.get('/post/:tipo', post_controllers.get_type)
router
    .route('/posts/:postid')
    .put(auth, post_controllers.update_one)  // solo el admin
    .delete(auth, post_controllers.delete_one)
    .get(post_controllers.get_one)

router.put('/posts_visit/:postid', post_controllers.increment_visit)

router
    .route('/reactions/:postid')
    .get(post_controllers.get_reactions)
    .put(auth, post_controllers.update_reaction)

router
    .route('/posts_visitants/:postid')
    .put(auth, post_controllers.update_visitans) 


router
    .route('/posts_comment/:postid')
    .put(auth, post_controllers.add_comment)
router
    .route('/posts_comment_delete/:postid')
    .put(auth, post_controllers.delete_comment)  // un usuario solo puede eliminar los comentarios q el ha hecho


router.post('/register', user_controllers.register)
//router.post('/users', user_controllers.create_one)
router.post('/login', user_controllers.login)

router
    .route('/users')
    .get(user_controllers.get_all)  // no puede ser solo el admin

router.get('/user_query', user_controllers.query)

router
    .route('/users/:userid')
    .get(user_controllers.get_one) // no puede ser solo el admin
    .put(auth, user_controllers.update_one) // no solo el admin
    .delete(auth, user_controllers.delete_one) // solo el admin

router.post('/gallery', gallery_controllers.upload.single('file'), gallery_controllers.create_one)
router.delete('/gallery/:id', gallery_controllers.delete_one)
router.get('/gallery/:id', gallery_controllers.get_one)


/*
router.get('/tags', tag_controllers.get_all)
router.post('/tags', tag_controllers.create_one)

router.get('/tags/:id', tag_controllers.get_one)
router.put('/tags/:id', tag_controllers.update_one)
router.delete('/tags/:id', tag_controllers.delete_one)
*/

module.exports = router;