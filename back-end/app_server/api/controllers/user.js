var passport = require('passport')

var mongoose = require('mongoose')
var usermodel = mongoose.model('User')
var gallerymodel = mongoose.model('Gallery')
var gallerycontrollers = require('./gallery')
var postmodel = mongoose.model('Post')
var postcontrollers = require('./post')

const register =  (req, res) => {
    if(!req.body.name1 || !req.body.apellido1 || !req.body.apellido2 || !req.body.correo || !req.body.password){
        return res.status(400).json({'message':'All fields required'})
    }
    

    usermodel.find({correo: req.body.correo}).exec((err, users) => {
        //if(!users){
        if(users.length == 0){

            const user = new usermodel()
            user.name1 = req.body.name1
            user.name2 = req.body.name2
            user.apellido1 = req.body.apellido1, 
            user.apellido2 = req.body.apellido2
            user.foto = req.body.foto
            user.correo = req.body.correo
            user.tipo = req.body.tipo
            user.setPassword(req.body.password)

            user.save((err) => {
              if(err) res.status(404).json(err)
              else{
                  const token = user.generateJWT();
                  res.status(200).json({token: token})
              }  
            })
        }
        else res.status(400).json({error:'Ya existe un usuario con ese mismo nombre.', usuarios:users[0]})
    })
}


const login = (req, res) => {
    if(!req.body.correo || !req.body.password){
        return res.status(400)
        .json({'message':'All fields required'})
    }

    passport.authenticate('local', (err, user, info) => {
        let token;
        if(err){
            return res.status(404)
            .json(err)
        }
        if(user){
            token = user.generateJWT();
            res.status(200).json({token: token})
        }
        else res.status(401).json(info)
    })(req, res)
}

const get_all =  (req, res) => {
    /*
    data = {
        name1: req.query.name1 ? req.query.name1 : null,
        name2: req.query.name2 ? req.query.name2 : null,
        apellido1: req.query.apellido1 ? req.query.apellido1 : null,
        apellido2: req.query.apellido2 ? req.query.apellido2 : null 
    }
    */
    
    usermodel.find().exec((err, users) => {
        res.status(200).json(users)
    })
}


const query =  (req, res) => {
    data = {
        name1: req.query.name1,
        name2: req.query.name2,
        apellido1: req.query.apellido1,
        apellido2: req.query.apellido2 
    }
    
    usermodel.find(data).exec((err, users) => {
        res.status(200).json(users)
    })
}

const get_one =  (req, res) => {
    usermodel
    .findById(req.params.userid)
    .exec((err, user) => {
        if(!user){
            return res
            .status(404)
            .json({'message':'user no encontrado'})
        }
        else if(err){
            return res.status(400)
            .json(err)
        }

        res.status(200).json(user)
        })}



const update_one = (req, res) => {
    if(!req.params.userid){
        return res
        .status(404)
        .json({
            'message': 'user requerido para actualizar'
        })
    }

    usermodel
    .findById(req.params.userid)
    .exec((err, user) => {
        if(!user){
            return res
            .status(404)
            .json({'message': 'user no encontrado'})
        }
        else if(err){
            return res
            .status(400)
            .json(err)
        }

        if(req.body.name1) user.name1 = req.body.name1
        if(req.body.name2) user.name2 = req.body.name2
        if(req.body.apellido1) user.apellido1 = req.body.apellido1
        if(req.body.apellido2) user.apellido2 = req.body.apellido2
        if(req.body.tipo) user.tipo = req.body.tipo
        if(req.body.foto) user.foto = req.body.foto
        if(req.body.correo) user.correo = req.body.correo

        user.save((err, user) => {
            if(err){
                res.status(400)
                .json(err)
            }
            else{
                res.status(200)
                .json(user)
            }
        })
    })
}

const delete_foto = (foto, res) => {
    if(mongoose.Types.ObjectId.isValid(foto)){
        console.log(`El usuario tiene foto`)

        gallerymodel.findById(foto)
        .exec((err7, foto7) => {
            console.log(`Eliminando foto del disco`)
            if(foto7){
                gallerycontrollers.deletefile(foto7.imageUrl)
                
                gallerymodel.deleteOne({'_id': new mongoose.Types.ObjectId(foto)})
                .exec((err4, res4) => {
                    if(err4) return res.status(400).json(err4)
                    console.log(`Se elimino la foto de perfil ${foto}`)
                })
            }
            else console.log(`Esta foto no existe!`)
        })
    }
}

const delete_one = (req, res) => {
    const userid = req.params.userid;
    if(userid){
        usermodel
        .findById(req.params.userid)
        .exec((err, user) => {
            if(!user){
                return res
                .status(404)
                .json({'message':'user no encontrado'})
            }
            else if(err){
                return res.status(400)
                .json(err)
            }

            postmodel.findOne({'autor': user._id})
            .exec((err77, post77) => {
                if(err77) return res.status(400).json(err77)
                if(!post77){
                    postmodel.findOne({'entrevistado': user._id})
                    .exec((err44, post44) => {
                        if(err44) return res.status(400).json(err44)
                        if(!post44){
                            postcontrollers.delete_comments_reaccion_user(req, res, user._id)
                            
                            delete_foto(user.foto, res)
                            
                            usermodel.deleteOne({'_id': new mongoose.Types.ObjectId(user._id)})
                            .exec((err2, res2) => {
                                if(err2) return res.status(400).json(err2)
                                console.log(`Se elimino bien el usuario!!`)
                                return res.status(204).json(null)
                            })
                        }
                        else {
                            text = `Este usuario no puede eliminarse porque es el entrevistado del artículo "${post44.titulo}".`
                            console.log(text)
                            return res.status(400).json({message:text})
                        }
                    })
                }

                else {
                    text = `Este usuario no puede eliminarse porque es autor del artículo "${post77.titulo}" (${post77.tipo}).`
                    console.log(text)
                    return res.status(400).json({message:text})
                }
            })

        })
    }
    else{
        res
        .status(404)
        .json({'message':'Falto userid'})
    }
}


module.exports  = {
    get_all,
    get_one,
    delete_one,
    update_one,
    query, 
    login,
    register
}