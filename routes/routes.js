const express = require("express");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");

const User = require("../model/user.js")

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: storage
}).single("image");

router.get("/", (req, res) => {
    User.find().exec((err, user) => {
        if (err) {
            res.json({
                message: err.message,
                type: "danger"
            })
        } else {
            res.render("Home", {
                title: "Home",
                user: user
            });
        }
    })

});
router.get("/add", (req, res) => {
    res.render("add-student", {
        title: "Add-student"
    })
})

router.post("/add", upload, (req, res) => {
    const username = req.body.username;
    const user = new User({
        username: username.trim(),
        age: req.body.age,
        phone: req.body.phone,
        image: req.file.filename,
    });
    user.save((err) => {
        if (err) {
            res.json({
                message: err.message,
                type: "danger"
            })
        } else {
            req.session.message = {
                type: "success",
                message: "User add successfully"
            }
        }
        res.redirect("/");
    })
})


router.get("/edit/:id", (req, res) => {
    const id = req.params.id;
    User.findById(id, (err, user) => {
        if (err) {
            res.redirect("/")
        } else {
            if (user == null) {
                res.redirect("/")
            } else {
                res.render("edit-student", {
                    title: "edit-student",
                    user: user
                });
            }

        }
    });

});

router.post("/update/:id", upload, (req, res) => {
    const id = req.params.id;
    // console.log(id)
    let new_image = "";

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync("./uploads/" + req.body.old_image)
        } catch (err) {
            // res.send(err)
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }
    console.log(new_image);

    // you can use like that {_id:id} instead of id
    User.findByIdAndUpdate(id, {
        username: req.body.username,
        age: req.body.age,
        phone: req.body.phone,
        image: new_image,
    }, (err, user) => {
        if (err) {
            res.json({
                message: err.message,
                type: "danger"
            })
        } else {
            req.session.message = {
                type: "success",
                message: "User update successfully"
            }
        }
        res.redirect("/");
    })
});


router.get("/delete/:id", (req, res) => {
    const id = req.params.id;
    User.findByIdAndRemove(id, (err, result) => {
        if (result.image != "") {
            try {
                fs.unlinkSync("./uploads/" + result.image);

            } catch (err) {
                console.log(err)
            }
        }
        if (err) {
            res.json({
                message: err.message,
                type: "danger"
            })
        } else {
            req.session.message = {
                type: "success",
                message: "Delete successfully"
            }
        }
        res.redirect("/")
    })
})
module.exports = router;