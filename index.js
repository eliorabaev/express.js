import express from "express"
import bodyParser from "body-parser"
import methodOverride from 'method-override';

const app = express()
const port = 3000
var _lists = []
var _flag = false
var _blog = []
function saveBlog(req,res,next) {
    if(req.body["list-post"]) {
        if(req.body["list-post"].length > 500) {
            _flag = true;
        }
         else {
            _flag = false;
            _lists.push(req.body["list-post"])
         }
    } 
    next()
}

function updateBlog(req,res,next) {
    const blogIndex = parseInt(req.body.blogIndex, 10);
    if (!isNaN(blogIndex) && blogIndex >= 0 && blogIndex < _lists.length) {
        if(req.body["list-post"]) {
            if(req.body["list-post"].length > 500) {
                _flag = true;
            }
             else {
                _flag = false;
                _lists[blogIndex] = req.body["list-post"];
             }
        } 
    } else {
        console.error('Invalid blog index:', blogIndex);
    }
    next();
}

function deleteBlog(req,res,next) {
    const blogIndex = parseInt(req.body.buttonDeleteId, 10);
    if (!isNaN(blogIndex) && blogIndex >= 0 && blogIndex < _lists.length) {
        _lists.splice(blogIndex, 1)
    }
    next();
}

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'));


app.get("/", (req,res) => {
    res.render("index.ejs", {
        lists: _lists
    })
})

app.get("/edit", (req,res) => {
    const buttonId = req.query.buttonId;
    const listToUpdate = _lists[buttonId].slice(0);
    res.render("editBlog.ejs", {
        id: buttonId,
        lists: _lists,
        blog: _blog,
        listToUpdate: listToUpdate
    })
})

app.post("/submit", saveBlog ,(req,res) => {
    res.render("index.ejs", {
        lists: _lists,
        flag: _flag
    })
})

app.post("/update", updateBlog, (req, res) => {
    res.render("index.ejs", {
        lists: _lists,
        flag: _flag,
        blog: _blog
    });
});

app.post("/delete",deleteBlog ,(req, res) => {
    res.render("index.ejs", {
        lists: _lists,
        flag: _flag,
        blog: _blog
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})