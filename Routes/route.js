const express = require("express");
const router = express.Router();
const users = require('../model/userSchema');
const multer = require("multer");
const cloudinary = require("../helper/cloudinaryconfig");


const imgconfig = multer.diskStorage({
    destination: (req, image, callback) => {
        callback(null, "uploads");
    },
    filename: (req, image, callback) => {
        callback(null, `image-${Date.now()}.${image.originalname}`);
    }
});
//`image-${Date.now()}.${file.originalname}`
// const isImage = (req, file, callback) => {
//     if (file.mimetype.startsWith("image")) {
//         callback(null,true)
//     } else {
//         callback(new Error("only images are allowed"))
//     }
// }

const upload = multer({
    storage: imgconfig,
    // fileFilter:isImage
})


router.post("/upload", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
    
    
    try {
        const imageFile = req.files.image[0];
        const videoFile = req.files.video[0];

        const imageResult = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image'
        });
        const videoResult = await cloudinary.uploader.upload(videoFile.path, {
            resource_type: 'video'
        });
        const { title, desc } = req.body;
        console.log(imageResult.secure_url);
        console.log(videoResult.secure_url);
        const userdata = new users({
            title: title,
            desc: desc,
            image: imageResult.secure_url,
            video: videoResult.secure_url
        })
        await userdata.save();
        res.status(200).json({ userdata });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    
});

router.get("/getdata", async (req, res) => {
    try {
        const getUser = await users.find();
        res.status(200).json(getUser);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const getUser = await users.find();
        res.status(200).json(getUser);
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    
});

module.exports = router;
