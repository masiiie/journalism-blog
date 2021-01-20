var mongoose = require('mongoose')
var tagmodel = mongoose.model('Tag')

const get_all =  (req, res) => {
    tagmodel.find().exec((err, tags) =>{
        res.status(200).json(tags)
    })
}

const get_one =  (req, res) => {
    tagmodel
    .findById(req.params.tagid)
    .exec((err, tag) => {
        if(!tag){
            return res
            .status(404)
            .json({'message':'tag no encontrado'})
        }
        else if(err){
            return res.status(404)
            .json(err)
        }

        res.status(200).json(tag)
        })}


const create_one =  (req, res) => {
    tagmodel
    .create({
        name: req.body.name

    }, (err, tag) => {
        if(err){
            res
            .status(400)
            .json(err)
        }
        else{
            res
            .status(201)
            .json(tag)
        }
    })
    }

const update_one = (req, res) => {
    if(!req.params.tagid){
        return res
        .status(404)
        .json({
            'message': 'tag requerido para actualizar'
        })
    }

    tagmodel
    .findById(req.params.tagid)
    .exec((err, tag) => {
        if(!tag){
            return res
            .status(404)
            .json({'message': 'tag no encontrado'})
        }
        else if(err){
            return res
            .status(400)
            .json(err)
        }

        tag.name = req.body.name,

        tag.save((err, tagt) => {
            if (err){
                res.status(400)
                .json(err)
            }
            else{
                res.status(200)
                .json(tagt)
            }
        })
    })
}
const delete_one = (req, res) => {
    const tagid = req.params;
    if(tagid){
        tagmodel
        .findById(req.params.tagid)
        .exec((err, tag) => {
            if(!tag){
                return res
                .status(404)
                .json({'message':'tag no encontrado'})
            }
            else if(err){
                return res.status(404)
                .json(err)
            }

            /*
            tagmodel.deleteOne(tag, (err) => {
                if(err){
                    return res.status(404).json(err)
                }

                res.status(204).json(null)
            })
            */

            tagmodel.deleteOne({'_id': new mongoose.Types.ObjectId(tag._id)})
            .exec((err2, res2) => {
                if(err2) return res.status(400).json(err2)
                console.log(`Se elimino bien el tag!!`)
                return res.status(204).json(null)
            })
        })
    }
    else{
        res
        .status(404)
        .json({'message':'Falto tagid'})
    }
}


module.exports  = {
    get_all,
    get_one,
    create_one,
    delete_one,
    update_one
}