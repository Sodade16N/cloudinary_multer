const userModel = require('../models/user');
const cloudinary = require('../config/cloudinary')
const bcrypt = require('bcrypt')
const fs = require('fs')


exports.register =async (req, res) => {
    try{
       const { fullName, email, password,} =req.body;
        const result = await cloudinary.uploader.upload(req.file.path);

        fs.unlinkSync(req.file.path);

        const emailExists = await userModel.findOne({email: email.toLowerCase() });

        if (emailExists) {
            await cloudinary.uploader.destroy(result.public_id)
            return res.status(400).json({
                message: `User with email: ${email} already exists`
            })
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(password, salt);

        const user = new userModel({
            fullName, 
            email, 
            password: hashedPassword,
            profilePic: {
                imageUrl: result.secure_url,
                publicId: result.public_id
            }
        })

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            data: user
        })

    }catch (error) {
        res.status(500).json({
           message: 'Internal Server Error: ' + error.message
        })
    }
}

exports.getAllUser = async (req, res) => {
    try {
        const user = await userModel.find();
        res.status(200).json({
            message: 'Users found',
            totalUser: user.length,
            data: user
        })
    }
    catch (e) {
      res.status(500).json({
        message: 'Error creating user: ' + e.message
      })
    }
};

exports.getOneUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json ({
                message: 'user not found',
            })
        }

        res.status(200).json({
            message: 'User found',
            data: user
        })
    }
    catch (e) {
      res.status(500).json({
        message: 'Error creating user: ' + e.message
      })
    }
};


exports.update = async (req, res) => {
    try {
        const { id } = req.params
        const { password } = req.body;
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({
                message: 'user not found',
            })
        }

        const data = {
            password,
            profilePic: user.profilePic
        };
       

        if (req.file && req.file.path) {
            await cloudinary.uploader.destroy(user.profilePic.publicId);
        };
        
        const result = await cloudinary.uploader.upload(req.file.path);
         fs.unlinkSync(req.file.path);

        data.profilePic ={
            imageUrl: result.secure_url,
            publicId: result.public_id
        }
              
        const updatedUser = await userModel.findByIdAndUpdate(id, data, { new: true });

        res.status(201).json({
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating user: ' + error.message
        })
    }
}


exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        };

        const deletedUser = await userModel.findByIdAndDelete(id);

        if (deletedUser) {
        await cloudinary.uploader.destroy(user.profilePic.publicId)

        }
        res.status(200).json({
            message: 'User deleted successfully'
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}