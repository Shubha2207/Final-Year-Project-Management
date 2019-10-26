var express = require("express");
var app = express();
var ip = "127.0.0.1";
var port = 3000;



var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Final_project",{useNewUrlParser:true});


var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://localhost/Final_project", {useNewUrlParser:true},{ useUnifiedTopology: true });

app.set("view engine","ejs");
app.use( express.static("public"));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


//SCHEMA SETUP
var projectSchema = new mongoose.Schema({
    studentName : String,
    password : String,
    guideName : String,
    domainName : String
});
var ProjectGroup = mongoose.model("ProjectGroup", projectSchema);

var guideSchema = new mongoose.Schema({
    guideName : String,
    password : String,
    domainName : String
});
var GuideSchema = mongoose.model("GuideSchema", guideSchema);

var domainSchema = new mongoose.Schema({
    domainName : String,
    studentName : String,
    guideName : String,
    description : String
});
var DomainSchema = mongoose.model("DomainSchema",domainSchema);

var feedbackSchema = new mongoose.Schema({
    domainName : String,
    studentName : String,
    guideName : String,
    feedback : String
});
var FeedbackSchema = mongoose.model("FeedbackSchema",feedbackSchema);

var imageSchema = new mongoose.Schema({
    studentName : String,
    image : String
});
var ImageSchema = mongoose.model("ImageSchema",imageSchema);

var linkSchema = new mongoose.Schema({
    studentName : String,
    link : String
});
var LinkSchema = mongoose.model("LinkSchema",linkSchema);

app.get("/",function(req,res){
    res.render("base");
});

app.get("/index_student/:studentName",function(req,res){
    var studentName = req.params.studentName;
    res.render("index_student",{studentName:studentName});
});



app.get("/upload_image/:studentName",function(req,res){
    var studentName = req.params.studentName;
    //res.render("index_student",{studentName:studentName});
    ImageSchema.find({studentName:studentName},function(err,foundGroup){
        if(err){
            console.log(err);
        }else{
            res.render("upload_image",{ProjectGroup : foundGroup});
        }
    });
});

app.post("/store_image/:studentName",function(req,res){
    var studentName = req.params.studentName;
    var image = req.body.image;
    var newRecord = {studentName:studentName,image:image};
    //res.render("index_student",{studentName:studentName});
    ImageSchema.create(newRecord,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/upload_image/"+studentName);
        }
    });
});

app.get("/upload_link/:studentName",function(req,res){
    var studentName = req.params.studentName;
    //res.render("index");
    LinkSchema.find({studentName:studentName},function(err,foundGroup){
        if(err){
            console.log(err);
        }else{
            res.render("upload_link",{ProjectGroup : foundGroup});
        }
    });
});

app.post("/store_link/:studentName",function(req,res){
    var studentName = req.params.studentName;
    var link = req.body.link;
    var newRecord = {studentName:studentName,link:link};
    //res.render("index_student",{studentName:studentName});
    LinkSchema.create(newRecord,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/upload_link/"+studentName);
        }
    });
});

app.get("/index_guide/:studentName",function(req,res){
    var studentName = req.params.studentName;
    res.render("index_guide",{studentName:studentName});
});

app.get("/watch_image/:studentName",function(req,res){
    var studentName = req.params.studentName;
    //res.render("index");
    ImageSchema.find({studentName:studentName},function(err,foundGroup){
        if(err){
            console.log(err);
        }else{
            res.render("watch_image",{ProjectGroup : foundGroup});
        }
    });
});

app.get("/watch_link/:studentName",function(req,res){
    var studentName = req.params.studentName;
    //res.render("index");
    LinkSchema.find({studentName:studentName},function(err,foundGroup){
        if(err){
            console.log(err);
        }else{
            res.render("watch_link",{ProjectGroup : foundGroup});
        }
    });
});

app.get("/decide",function(req,res){
    res.render("decide");
});


app.get("/registration_student",function(req,res){
    res.render("registration_student");
});

app.get("/registration_guide",function(req,res){
    res.render("registration_guide");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/domains",function(req,res){
    res.render("domains");
});

app.get("/student/:studentName",function(req,res){
    var studentName = req.params.studentName;
    //res.render("student");
    DomainSchema.find({studentName:studentName},function(err,foundGroup){
        if(err){
            console.log(err);
        }else{
            
            //console.log(foundGroup);
            res.render("show_description",{Projectgroups:foundGroup});
        }
    });
});


app.get("/description",function(req,res){

});

app.post("/description/:studentName",function(req,res){
    var description = req.body.description;
    var studentName = req.params.studentName;
    DomainSchema.updateOne({studentName : studentName},{$set : {description : description}},function(err,foundGroup){
        if(err){
            console.log(err);
        }else{
            //foundGroup.description = description ;
            //console.log(foundGroup);
            res.redirect("/student/"+studentName);
        }
    });
});

app.get("/guide",function(req,res){
    res.redirect("/groupList");
});

app.get("/guide/:studentName",function(req,res){
    var studentName = req.params.studentName;

    // ProjectGroup.findById(id,function(err,foundGroup){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         //render show template
    //         res.render("show",{group:foundGroup});
    //     }
    // });
    //console.log(typeof(studentName));
    FeedbackSchema.find({studentName:studentName},function(err,foundGroup){
        if(err){
            console.log(err);
        }else{
            
            //console.log(foundGroup);
            res.render("show_feedback",{Projectgroups:foundGroup});
        }
    });
});

app.get("/feedback",function(req,res){

});

app.post("/feedback/:studentName",function(req,res){
    var feedback = req.body.feedback;
    var studentName = req.params.studentName;
    FeedbackSchema.updateOne({studentName : studentName},{ $set : { feedback:feedback } },function(err,foundGroup){
        if(err){
            console.log(err);
        }else{
            //foundGroup.description = description ;
            console.log(foundGroup);
            res.redirect("/guide/"+studentName);
        }
    });
});

app.get("/description_per_project/:studentName",function(req,res){
    var studentName = req.params.studentName;
    DomainSchema.find({studentName:studentName},function(err,foundGroup){
        if(err){
            console.log();
        }else{
            res.render("description_per_project",{ProjectGroup:foundGroup});
        }
    });    
});

app.get("/feedback_per_project/:studentName",function(req,res){
    var studentName = req.params.studentName;
    FeedbackSchema.find({studentName:studentName},function(err,foundGroup){
        if(err){
            console.log();
        }else{
            res.render("feedback_per_project",{ProjectGroup:foundGroup});
        }
    });    

});

app.get("/check",function(req,res){
    console.log("inside the check");
});

app.get("/invalid",function(req,res){
    res.render("invalid");
});





app.post("/check",function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var applicant = req.body.applicant;
    var user = {username : username , password:password , applicant:applicant};
    if(applicant != "PROJECT GUIDE"){
        ProjectGroup.find({},function(err,allProjectGroups){
            if(err){
                console.log(err);
            }else{
                var flag = false ;
                allProjectGroups.forEach(function(group){
                    if(group.studentName == user.username && group.password == user.password){
                        flag = true;
                        //break;
                    }
                })
                if(flag==false){
                    res.redirect("invalid");
                }else{
                    res.redirect("/student/"+username);
                }
            }
        });
    }
    else{
        GuideSchema.find({},function(err,allGuides){
            if(err){
                console.log(err);
            }else{
                var flag = false ;
                allGuides.forEach(function(guide){
                    if(guide.guideName == user.username && guide.password == user.password){
                        flag = true;
                        //break;
                    }
                })
                if(flag==false){
                    res.redirect("invalid");
                }else{
                    res.redirect("/guide");
                }
            }
        });
    }
    
});


app.post("/decide",function(req,res){
    if(req.body.applicant == "PROJECT GUIDE"){
        res.redirect("guide");
    }
    else{
        res.redirect("student");
    }
});


app.get("/groupList",function(req,res){

    ProjectGroup.find({},function(err,allProjectGroups){
        if(err){
            console.log(err);
        }else{
            res.render("groupList",{ProjectGroup:allProjectGroups});
        }
    });
});

 

app.post("/groupList_student",function(req,res){
    // take data from form and add to campgrounds array
    //res.send("you hit the post route") ;

    var studentName = req.body.studentName;
    var password = req.body.password;
    var domainName = req.body.domainName;
    var guideName = req.body.guideName ;

    var newGroup = {studentName : studentName , password : password , domainName:domainName, guideName : guideName};

    var newInfo_1 = {domainName : domainName, studentName : studentName, guideName : guideName, description: ""}; //for domain schema
    var newInfo_2 = {domainName : domainName, studentName : studentName, guideName : guideName, feedback: ""}; //for feedback domain
    var newInfo_3 = {studentName : studentName, image: "http://thailawonline.com/images/Start-Business-Thailand.jpg"}; //for image schema
    var newInfo_4 = {studentName : studentName, link: "https://www.google.com/drive/"}; //for link schema
    
    //create new campground and save it to database
    DomainSchema.create(newInfo_1,function(err,newlyCreated){
        if(err){
            console.log(err);

        }
    });

    FeedbackSchema.create(newInfo_2,function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            //console.log(newlyCreated);
        }
    });

    ImageSchema.create(newInfo_3,function(err,newlyCreated){
        if(err){
            console.log(err);

        }
    });

    LinkSchema.create(newInfo_4,function(err,newlyCreated){
        if(err){
            console.log(err);

        }
    });

    ProjectGroup.create(newGroup,function(err,newlyCreated){
        if(err){
            console.log(err);

        }else{
            res.redirect("/login"); 
        }
    });

  //by default redirect to campground page with get request
});

app.post("/groupList_guide",function(req,res){
    // take data from form and add to campgrounds array
    //res.send("you hit the post route") ;

    var guideName = req.body.guideName ;
    var password = req.body.password;
    var domainName = req.body.domainName;
    
    
    var newGuide = {guideName : guideName , password : password , domainName:domainName};

    GuideSchema.create(newGuide,function(err,newlyCreated){
        if(err){
            console.log(err);

        }else{
            res.redirect("/login"); 
        }
    });

  //by default redirect to campground page with get request
});

app.listen(port,ip,function(){
    console.log("Server has started");
});