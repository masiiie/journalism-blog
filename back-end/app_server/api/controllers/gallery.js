var mongoose = require('mongoose')
var multer  = require('multer');
var gallerymodel = mongoose.model('Gallery')


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});

var upload = multer({storage: storage});

const create_one = (req, res) => {
    if(!req.file) {
        return res.status(500).send({ message: 'Upload fail'});
    } else {
        req.body.imageUrl = 'http://localhost:3000/images/' + req.file.filename;
        gallerymodel.create(req.body, function (err, gallery) {
            if (err) {
                console.log(err);
                res.status(400).json(err)
            }
            return res.status(201).json(gallery);
        });
    }
}

const get_one =  (req, res) => {
    if(mongoose.Types.ObjectId.isValid(req.params.id)){
        gallerymodel
        .findById(req.params.id)
        .exec((err, gallery) => {
            if(!gallery){
                return res
                .status(404)
                .json({'message':'Imagen no encontrada'})
            }
            else if(err){
                return res.status(404)
                .json(err)
            }
    
            res.status(200).json(gallery)
            })
    }
    else console.log(`Este id para foto no es correcto`)
}


const fs = require('fs')
//const { promisify } = require('util')
//const  deletefile = promisify(fs.unlink)
//await deletefile(req.file.path)


const deletefile = (path) => {
    split = path.split('/')
    foto_name = split[split.length -  1]
    new_path = `./public/images/${foto_name}`
    try { 
        fs.unlink(new_path, (err) => {
            console.log(`Ha ocurrido un error eliminando la foto ${err}`)
            console.log(`Dicho desde callback`)
        })
        console.log(`Foto eliminada! ${new_path}`)  
    } catch (error) {
        console.log(`Mira el error ${error}`)
        console.log(`Error eliminando la foto ${new_path}`)
    }
}


const delete_one = (req, res) => {
    const id = req.params.id;
    if(id){
        gallerymodel
        .findById(req.params.id)
        .exec((err, gallery) => {
            if(!gallery){
                return res
                .status(404)
                .json({'message':'galleria no encontrada'})
            }
            else if(err){
                return res.status(400)
                .json(err)
            }

            gallerymodel.deleteOne({'_id': new mongoose.Types.ObjectId(gallery._id)})
            .exec((err2, res2) => {
                if(err2) return res.status(400).json(err2)

                deletefile(gallery.imageUrl)

                console.log(`Se elimino bien la galleria!!`)
                return res.status(204).json(null)
            })
        })
    }
    else{
        res
        .status(404)
        .json({'message':'Falto id'})
    }
}



module.exports  = {
    upload,
    create_one,
    get_one,
    deletefile,
    delete_one
}