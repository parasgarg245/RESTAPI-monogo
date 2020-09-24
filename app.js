const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const ejs=require('ejs');


const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDb", { useNewUrlParser: true, useUnifiedTopology: true })

const articleSchema=mongoose.Schema({
    title: String,
    content: String
});

const Article=mongoose.model("Article", articleSchema );



app.route("/articles")
    .get(function (req, res) {
    Article.find(function (err, foundarticles) {
        if (err)
            console.log(err);
        else
            res.send(foundarticles);
    })
    })
    .post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save(function (err) {
            if (err) {
                res.send(err);
            }
            else {
                res.send("Successfully added a new article")
            }
        });

    })
    .delete(function (req, res) {
        Article.deleteMany({}, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("successfully deleted all elements");
            }
        })
    });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.route("/articles/:articleTitle")
    .get(function(req,res){
        Article.findOne({ title: req.params.articleTitle},function(err,founditem){
            if(err){
                res.send(err);
            }
            else{
                res.send(founditem);
            }
        })
    })
    .put(function(req,res){
        Article.update({title:req.params.articleTitle},{title:req.body.title, content: req.body.content},
            {overwrite:true}, function(err,result){
                if(err)
                    res.send(err);
                else{
                    res.send("sucesfully updated")
                }
            })
    })
    .patch(function(req,res){
        Article.update({title:req.params.articleTitle},
                        {$set: req.body},
                        function(err){
                            if(!err){
                                res.send("Successfullly updated article")
                            }
                            else    
                                res.send(err);
                        }
             )
    })
    .delete(function(req,res){
        Article.deleteOne({title:req.params.articleTitle},
                            function(err){
                                if(err){
                                    res.send(err);
                                }
                                else{
                                    res.send("successfully deleted the article");
                                }
                            }
                    )
    })


app.listen(5000,function(req,res){
    console.log('Server is started on port 3000');
})
