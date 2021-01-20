var mongoose = require('mongoose')
var postmodel = mongoose.model('Post')
var usermodel = mongoose.model('User')
var gallerymodel = mongoose.model('Gallery')
var gallerycontrollers = require('./gallery')


const getAuthor = (callback) => {
    return (req, res) => {
        if(req.payload && req.payload.correo){
            usermodel.findOne({correo: req.payload.correo})
            .exec((err, user) => {
                if(!user) return res.status(404).json({'message':'User not found. --getAuthor'})
                else if(err){
                    console.log(err)
                    return res.status(404).json(err)
                }
                callback(req, res, user._id, user.tipo)
            })
        }
        else return res.status(404).json({'message':'User not found'})
    }
}

const basic_one = (callback) => {
    return (req, res) => {
        if(!req.params.postid){
            return res
            .status(404)
            .json({
                'message': 'Post requerido para actualizar'
            })
        }
    
        postmodel
        .findById(req.params.postid)
        .exec((err, post) => {
            if(!post){
                return res
                .status(404)
                .json({'message': 'Post no encontrado'})
            }
            else if(err){
                return res
                 .status(400)
                .json(err)
            }
    
            callback(req, res, post)
        })
    }
}

var get_reactions = (req, res, post) => {
    return res.status(200).json(post.reacciones)
}
get_reactions = basic_one(get_reactions)

var update_reaction = (req_, res_, userid, _) => {
    if(!req_.body.reaction && !req_.body.delete){
        return res_
        .status(404)
        .json({
            'message': 'Debe dar el valor de la reaccion'
        })
    }

    const callback = (req, res, post) => {
        if(req.body.delete) post.reacciones = post.reacciones.filter((val,index,arr) => val.user != user)
        else{
            const index = post.reacciones.findIndex((value, i, arr) => value.user == userid)

            if(index > -1) post.reacciones[index].valor = req.body.reaction
            else post.reacciones.push({
                user: userid,
                valor: req.body.reaction
            })
        }
    

        post.save((err, postt) => {
            if (err){
                res.status(400)
                .json(err)
            }
            else{
                res.status(200)
                .json(postt)
            }
        })
    }
    basic_one(callback)(req_, res_)
}
update_reaction = getAuthor(update_reaction)

const get_all =  (req, res) => {
    postmodel.find().exec((err, posts) =>{
        res.status(200).json(posts)
    })
}

const query = (req, res) => {
    data = {
        titulo: req.query.titulo,
        tipo: req.query.tipo,
        autor: req.query.autor
    }

    postmodel.find(data).exec((err, posts) => {
        res.status(200).json(posts)
    })
}



var update_visitans = (req_, res_, userid, tipo) => {
    const callback = (req, res, post) => {
        post.visitantes = !post.visitantes.includes(userid) ?
        post.visitantes.concat([userid]) : post.visitantes

        console.log(`Nuevo visitante: ${userid}!`)

        post.save((err, postt) => {
            if (err){
                res.status(400)
                .json(err)
            }
            else{
                res.status(200)
                .json(postt)
            }
        })
    }
    if(tipo != 'Admin') basic_one(callback)(req_, res_)
}
update_visitans = getAuthor(update_visitans)

var add_comment = (req_, res_, userid, _) => {
    const callback = (req, res, post) => {
        comment = {
            body: req.body.body,
            user: userid,
            date: req.body.date
        }
        
        post.comments.push(comment)
    
        post.save((err, postt) => {
            if (err){
                console.log(`Error!!!! ${err}`)
                res.status(400)
                .json(err)
            }
            else{
                res.status(200)
                .json(postt)
            }
        })
    }

    basic_one(callback)(req_, res_)
}
add_comment = getAuthor(add_comment)

var delete_comment = (req_, res_, userid, _) => {
    const callback = (req, res, post) => {
        index = -1
        
        selected = post.comments.filter((value, i, arr) => {
            index = i
            return value.user == userid && value.date == req.body.date
        })
        

        post.comments.splice(index,1)

        post.save((err, postt) => {
            if (err){
                res.status(400)
                .json(err)
            }
            else{
                res.status(200)
                .json(postt)
            }
        })
    }

    basic_one(callback)(req_, res_)
}
delete_comment = getAuthor(delete_comment)

var get_one =  (req, res, post) => {
    return res.status(200).json(post)
}
get_one = basic_one(get_one)

const create_one =  (req, res) => {   
    body = {
        titulo: req.body.titulo,
        fotos: req.body.fotos,
        comments: [],
        fecha: req.body.fecha,      
        tipo: req.body.tipo,
        contenido: req.body.contenido,
        entrevistado: req.body.entrevistado,
        autor: req.body.autor,
        frase: req.body.frase ? req.body.frase : ''
    }

    querylla = {
        titulo: req.body.titulo,
        tipo: req.body.tipo,
        autor: req.body.autor
    }
    
    postmodel.find(querylla).exec((err, posts) =>{
        if(posts.length == 0){
            postmodel.create(body, (err, post) => {
                if(err){
                    res
                    .status(400)
                    .json(err)
                }
                else{
                    res
                    .status(201)
                    .json(post)
                }
            })
        }
        else res.status(400).json({error:'Ya ese articulo existe (titulo, tipo, autor).'})
    })
}

var update_one = (req, res, post) => {
    if(req.body.titulo) post.titulo = req.body.titulo
    if(req.body.fotos) post.fotos = req.body.fotos
    if(req.body.autor) post.autor = req.body.autor
    if(req.body.comments) post.comments = req.body.comments
    if(req.body.fecha) post.fecha = req.body.fecha
    if(req.body.tipo) post.tipo = req.body.tipo
    if(req.body.contenido) post.contenido = req.body.contenido
    if(req.body.entrevistado) post.entrevistado = req.body.entrevistado
    if(req.body.frase && req.body.frase.length > 0) post.frase = req.body.frase
    
    post.save((err, postt) => {
        if (err){
            res.status(400)
            .json(err)
        }
        else{
            res.status(200)
            .json(postt)
        }
    })
}
update_one = basic_one(update_one)

var increment_visit = (req, res, post) => {
    post.visitas = post.visitas + 1 
    console.log(`Se incrementa la cantidad de visitas a ${post.visitas}!! \n\n`)
    
    post.save((err, postt) => {
        if (err){
            res.status(400)
            .json(err)
        }
        else{
            res.status(200)
            .json(postt)
        }
    })
}
increment_visit = basic_one(increment_visit)

const delete_fotos = (fotos, res) => {
    fotos.forEach((value, index, arr) => {
        if(mongoose.Types.ObjectId.isValid(value)){
            gallerymodel.findById(value)
            .exec((err4, foto4) => {
                if(err4) return res.status(400).json(err4)
                if(foto4){
                    gallerycontrollers.deletefile(foto4.imageUrl)
    
                    gallerymodel.deleteOne({'_id': new mongoose.Types.ObjectId(value)})
                    .exec((err3, res3) => {
                        if(err3) return res.status(400).json(err3)
                        console.log(`Foto eliminada del post!`)
                    })
                }
                else console.log(`Esta foto no existe! Post controllers.`)
            })
        }
    })
}

var delete_one = (req, res, post) => {
    delete_fotos(post.fotos, res)
    
    postmodel.deleteOne({'_id': new mongoose.Types.ObjectId(post._id)})
    .exec((err2, res2) => {
        if(err2) return res.status(400).json(err2)   
        console.log(`Se elimino bien el post!!!`)
        return res.status(204).json(null)
    })
}
delete_one = basic_one(delete_one)


const get_type =  (req, res) => {
    //_tipo = req.query.tipo
    _tipo = req.params.tipo
    if(_tipo == 'Historia%20b%C3%ADblica') _tipo = 'Historia bíblica'
    else if (_tipo == 'Juventud%20cristiana') _tipo = 'Juventud cristiana'
    postmodel.find({tipo:_tipo}).exec((err, posts) => {
        if(!posts){
            res.status(404).json(err)
        }
        else{
            res.status(200).json(posts)
        }
    })
}

const delete_comments_reaccion_user = (req, res, user) => {
    postmodel.find()
    .exec((err, posts) => {
        if(err) return res.status(400).json(err)
        posts.forEach((v,i,arr) => {
            v.comments = v.comments.filter((val,index,arr) => val.user != user)
            v.reacciones = v.reacciones.filter((val,index,arr) => val.user != user)

            v.save((err, postt) => {
                if (err){
                    res.status(400)
                    .json(err)
                }
                console.log(`Salvado! post = ${v._id} tras eliminar comentarios y reacciones de
                ese usuario`)
            })
        })
    })
}

module.exports  = {
    get_all,
    query,
    get_one,
    get_type,
    create_one,
    delete_one, 
    update_one,
    add_comment,
    delete_comment, 
    increment_visit,
    update_visitans,
    delete_comments_reaccion_user,
    get_reactions,
    update_reaction
}