// const StepbyStepGuide = require('../../models/StepbyStepGuide/StepbyStepGuide');
// const cloudinary = require('../../utils/Cloudinary');


// const addStepbyStepGuide = async (req, res) => {
//     try {
//         console.log("Request Body:", req.body);
//         console.log("Uploaded Files:", req.files);

//         const { title, description } = req.body;
        
//         let steps = [];
//         if (req.body.steps) {
//             try {
//                 steps = JSON.parse(req.body.steps);
//                 console.log("Parsed Steps:", steps);
//             } catch (error) {
//                 console.error("Invalid JSON in steps field:", error);
//                 return res.status(400).json({ message: "Invalid JSON format in steps field" });
//             }
//         }

//         const thumbnailImage = req.files['thumbnailImage'] ? req.files['thumbnailImage'][0].path : null;
//         const stepMediaFiles = req.files['stepMedia'] ? req.files['stepMedia'].map(file => file.path) : [];

//         console.log("Thumbnail Image:", thumbnailImage);
//         console.log("Step Media Files:", stepMediaFiles);

//         // **Attach Media Files to Steps**
//         steps.forEach((step, index) => {
//             step.stepMedia = stepMediaFiles[index] || null;
//         });

//         console.log("Final Steps Data:", steps);

        
//         const newGuide = new StepbyStepGuide({
//             title,
//             description,
//             thumbnailImage,
//             steps
//         });

//         await newGuide.save();

//         res.status(201).json({ message: 'Guide added successfully', guide: newGuide });
//     } catch (error) {
//         console.error("Server Error:", error);
//         res.status(500).json({ message: 'Internal Server Error', error: error.message });
//     }
// };

// module.exports = { addStepbyStepGuide };


const StepbyStepGuide = require('../../models/StepbyStepGuide/StepbyStepGuide');
const cloudinary = require('../../utils/Cloudinary');
const Tag = require("../../models/Tags/Tags.js");
const Post = require("../../models/Post/Post.js");
const Notification = require("../../models/Notification/Notification.js")
const { response } = require('express');
const sendStepByStepNotification = require("../../utils/stepbystepGuide.js")
const User = require("../../models/User/User.js")


const addStepbyStepGuide = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded Files:", req.files);

        const { title, description, tags, status, price } = req.body;


        if( !title || !description || !status || !price){
            return res.status(400).json({ message: "All fields are required" });
        }

        let steps = [];
        if (req.body.steps) {
            try {
                steps = JSON.parse(req.body.steps);
                console.log("Parsed Steps:", steps);
            } catch (error) {
                console.error("Invalid JSON in steps field:", error);
                return res.status(400).json({ message: "Invalid JSON format in steps field" });
            }
        }

        let thumbnailImageUrl = null;
        if (req.files['thumbnail']) {
            const uploadResult = await cloudinary.uploader.upload(req.files['thumbnail'][0].path, {
                folder: 'step_guides',
                resource_type: 'image'
            });
            thumbnailImageUrl = uploadResult.secure_url;
        }

        let stepMediaUrls = [];
        if (req.files['stepMedia']) {
            for (let file of req.files['stepMedia']) {
                const uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: 'step_guides',
                    resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
                });
                stepMediaUrls.push(uploadResult.secure_url);
            }
        }

        steps.forEach((step, index) => {
            step.stepMedia = stepMediaUrls[index] || null;
        });

        console.log("Final Steps Data:", steps);
        
        const newGuide = new StepbyStepGuide({
            title,
            description,
            thumbnail: thumbnailImageUrl, 
            steps,
            tags
        });

        const createPost=new Post({
            author: req.user,
            status,
            price,
            contentData: "StepbyStepGuide",  
            refId: newGuide._id
          })
      
          await newGuide.save();
        
        const tagArray = Array.isArray(tags) ? tags : JSON.parse(tags);
        for (const tagName of tagArray) {
            const tag = await Tag.findOneAndUpdate(
              { tagname: tagName },
              {
                $setOnInsert: { tagname: tagName, createdBy: req.user },
                $push: { allposts: newGuide._id },
              },
              { new: true, upsert: true }
            );
            
        }
        await createPost.save()
        const followers = await User.find({ following: req.user._id });
            for (const follower of followers) {
                await Notification.create({
                    userId: follower._id,
                    postId: createPost._id,
                    message: `New guide "${title}" added by ${req.user.username}.`,
                });
                sendStepByStepNotification(follower.email, createPost._id ,title);
            }
        

        res.status(201).json({ message: 'Guide added successfully', guide: newGuide , Tag : tagArray});
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const updateStepbyStepGuide = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Uploaded Files:", req.files);

        const { title, description, tags, status, steps } = req.body;
        const { id } = req.params;
        console.log("ID", id)
        const guide = await StepbyStepGuide.findById(id);
        console.log(guide)
        if (!guide) {
            return res.status(404).json({ message: "Guide not found" });
        }

        guide.title = title || guide.title;
        guide.description = description || guide.description;
        guide.tags = tags || guide.tags;

        let parsedSteps = guide.steps;
        if (steps) {
            try {
                parsedSteps = JSON.parse(steps);
            } catch (error) {
                return res.status(400).json({ message: "Invalid JSON format in steps field" });
            }
        }

        if (req.files['thumbnail']) {
            const uploadResult = await cloudinary.uploader.upload(req.files['thumbnail'][0].path, {
                folder: 'step_guides',
                resource_type: 'image'
            });
            guide.thumbnail = uploadResult.secure_url;
        }

        let stepMediaUrls = [];
        if (req.files['stepMedia']) {
            for (let file of req.files['stepMedia']) {
                const uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: 'step_guides',
                    resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
                });
                stepMediaUrls.push(uploadResult.secure_url);
            }
        }

        parsedSteps.forEach((step, index) => {
            step.stepMedia = stepMediaUrls[index] || step.stepMedia;
        });

        guide.steps = parsedSteps;

        
        const post = await Post.findOne({ refId: id, contentData: "StepbyStepGuide" });
        if (post) {
            post.status = status || post.status;
            await post.save();
        }

        
        await guide.save();

        
        const tagArray = Array.isArray(tags) ? tags : JSON.parse(tags);
        for (const tagName of tagArray) {
            await Tag.findOneAndUpdate(
                { tagname: tagName },
                {
                    $setOnInsert: { tagname: tagName, createdBy: req.user },
                    $push: { allposts: guide._id },
                },
                { new: true, upsert: true }
            );
        }
        sendStepByStepNotification(post.author.email, createPost._id ,title);
        res.status(200).json({ message: "Guide updated successfully", guide, post, tags: tagArray });
    } catch (error) {
        console.error("Error updating guide:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const getVideoGuide = async (req,res) =>{
    try {
        const video = await Post.find({contentData : "StepbyStepGuide"}).populate('refId');

        res.status(200).json({response : video})

    } catch (error) {
        res.status(500).json({message : error.message})
    }
};

const VideoGuideSingle = async(req, res) =>{
    try {
        const {guideId} = req.params;
        console.log(guideId)

        const findGuide = await Post.findById(guideId).populate("refId");

        res.status(200).json({response : findGuide});
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

module.exports =  {addStepbyStepGuide, getVideoGuide,VideoGuideSingle , updateStepbyStepGuide} ;
