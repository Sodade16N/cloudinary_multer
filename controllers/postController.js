const postModel = require('../models/post');
const userModel = require('../models/user');
const cloudinary = require('../config/cloudinary')
const fs = require('fs')

exports.createPost =async (req, res)=> {
    try{
       const {id: userId } = req.params;

       const { content } = req.body;

       const user = await userModel.findById(userId);

       if (user === null) {
        return res.status(404).json({
            message: 'user not found'
        })
       }; 

       const picturesUrl = [];
       const files = req.files;

       for (const image of files) {
          const result = await cloudinary.uploader.upload(image.path);
          fs.unlinkSync(image.path);

          const photo = {
            imageUrl: result.secure_url,
            imagePublicId: result.public_id,
          }
          picturesUrl.push(photo)
       }

       const post = new postModel({
        content,
        user: user.fullName,
        userId: user._id,
        images: picturesUrl
       });
       user.postId.push(post._id);

       await post.save();
       await user.save();

       res.status(201).json({
        message: 'Post created successfully',
        data: post
     })

    }catch (error) {
        res.status(500).json({
            message: 'Internal Server Error: ' + error.message
        })
    }
}