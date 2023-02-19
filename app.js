const express = require("express");
const mongoose = require("mongoose");
const body = require("body-parser");
const date = require(__dirname + "/date.js")
const port = 3000

const app = express();

app.use(body.urlencoded({extended:true}));

app.use(express.static('public'));

app.set('view engine', 'ejs');

mongoose.set('strictQuery', false);
// mongoose.connect("mongodb://127.0.0.1/todolistDB");
mongoose.connect("mongodb+srv://todolist:7USJImFCrPO5KgRd@cluster0.gvhxzxf.mongodb.net/?retryWrites=true&w=majority");


const itemSchema = new mongoose.Schema({
    name : {
        type:String,
    }
})

const Item = mongoose.model("Item", itemSchema);

const addedTask1 = new Item ({
    name : "buy food"
})
const addedTask2 = new Item ({
    name : "cook food"
})
const addedTask3 = new Item ({
    name : "eat food"
})

const defaultTasks = [addedTask1, addedTask2, addedTask3];


const listSchema = new mongoose.Schema({
    name : String,
    items : [itemSchema]
})

const List = mongoose.model("List", listSchema);


// let workTasks = [];
let currentDay = date();

app.get("/", (req, res) => {
    

    Item.find((err, alltasks) => {
        if(alltasks.length === 0){
            Item.insertMany(defaultTasks, (err)=>{
                if(err){
                    console.log(err)
                } else{
                    console.log("success in adding the tasks")
                }
            })
            res.redirect('/');
        }else{
            res.render("lists", {header: currentDay, addedTasks: alltasks});
        }
    })

})

app.get("/:customlist", (req, res) => {
    const customList = req.params.customlist;

    if(customList== "favicon.ico"){
        return;
    }
   
    List.findOne({name : customList}, (err, foundlist) => {
        if (!err){
            if(!foundlist){
                const list = new List ({
                    name : customList,
                    items : []
                })
                
                list.save();
                res.redirect("/" + customList);

            }else{
                res.render("lists", {header: foundlist.name, addedTasks: foundlist.items});
            }
        }
    })

})


app.post("/", (req, res) => {

    const newTask = new Item({
        name:req.body.task
    })

    if (req.body.btn == currentDay){
        newTask.save();
        res.redirect("/")
    } else{
        List.findOne({name : req.body.btn}, (err, foundlist) => {
            if(!err){
                foundlist.items.push(newTask)
                foundlist.save()
                res.redirect("/" + req.body.btn)
            }else{
                console.log(err);
            }
        })
    }

    
})

app.post("/delete", (req, res) => {

    if(req.body.otherDelete === currentDay){
        Item.deleteOne({_id:req.body.delete}, (err) => {
                if(err){
                    console.log(err)
                }else{
                    console.log("succes in deleting");
                }
            })
            res.redirect("/");
    } else{
        List.findOneAndUpdate({name:req.body.otherDelete}, {$pull:{items:{_id:req.body.delete}}}, (err, result) => {
            if(err){
                console.log(err)
            } else{
                res.redirect("/" + req.body.otherDelete)
            }
        })
        
    }

})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})








// 7USJImFCrPO5KgRd