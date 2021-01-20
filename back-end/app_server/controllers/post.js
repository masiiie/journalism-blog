// GET 'home' page
const homelist =  (req, res) =>{
    res.render('index', {title:'Home'})
}

// GET 'post info' page
const postinfo =  (req, res) =>{
    res.render('index', {title:'Post info'})
}

// GET 'add review' page
const addreview =  (req, res) =>{
    res.render('index', {title:'Add review'})
}


module.exports  = {
    homelist,
    postinfo,
    addreview
}