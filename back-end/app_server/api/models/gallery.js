var mongoose = require('mongoose');

var GallerySchema = new mongoose.Schema({
  //id: String,
  imageUrl: {type:String, required:true},
  imageDesc: {type:String, default:''},
  uploaded: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gallery', GallerySchema);