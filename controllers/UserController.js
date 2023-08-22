const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const register=(req,res,next)=>{
    bcrypt.hash(req.body.password,10,function(err,hashedPass){
        if (err){
            res.json({
                error:err
            })  
        }
        let user=new User({
            name:req.body.name,
            email:req.body.email,
            username:req.body.username,
            password:hashedPass,
            bio_data:req.body.bio_data,
            image_link:req.body.image_link,
        });
        user.save()
        .then(()=>{
            res.json({
                message:'User is added successfully.'
            })
        }) 
        .catch(error=>{
            res.json({
                message:'An error is occured.'
            })
        })
    })
}

const update=(req,res,next)=>{
    if (req.body.password!==undefined){
        bcrypt.hash(req.body.password,10,function(err,hashedPass){
            if (err){
                res.json({
                    error:err
                })  
            }
            User
            .findOneAndUpdate({username:req.body.username},{$set:{
                name:req.body.name,
                email:req.body.email,
                username:req.body.username,
                bio_data:req.body.bio_data,
                password:hashedPass,
                image_link:req.body.image_link,
            }})
            .then(()=>{
                res.json({
                    message:'User data is updated successfully.'
                })
            })
            .catch(error=>{
                res.json({
                    message:'An error is occured.'
                })
            })
        })
    }
    else{
        User.findOneAndUpdate({username:req.body.username},{$set:{
            name:req.body.name,
            email:req.body.email,
            username:req.body.username,
            bio_data:req.body.bio_data,
            image_link:req.body.image_link,
        }}).then(()=>{  
            res.json({
                message:'User data is updated successfully.'
            })
        }) 
        .catch(error=>{
            res.json({
                message:'An error is occured.'
            })
        }
        )
    }
}

const login=(req,res,next)=>{
    let username=req.body.username;
    let password=req.body.password;
    let email = req.body.email;

    User.findOne({$or:[{email:email},{username:username}]})
    .then(user=>{
        if (user){
            bcrypt.compare(password,user.password,function(err,result){
                if (err){
                    res.json({
                        error:err
                    })
                }
                if (result){
                    let token=jwt.sign({name:user.name},"verySecretValue",{expiresIn:'1h'})
                    res.json({
                        message:'Login successful.',
                        token
                    })
                }
                else{
                    res.json({
                        message:'Password does not matched.'
                    })
                }
            })
        }
        else{
            res.json({
                message:'No user found.'
            })
        }
    })
}

const getUser=(req,res,next)=>{
    User.find({ username: req.body.username })
    .then(user=>{
        res.json({
            message:'User data is fetched successfully.',
            user
        })
    })
    .catch(error=>{
        res.json({
            message:'An error is occured.'
        })
    })
}

const deleteUser=(req,res,next)=>{
    User.findOneAndDelete({username:req.body.username})
    .then(()=>{
        res.json({
            message:'User is deleted successfully.'
        })
    }
    )
    .catch(error=>{
        res.json({
            message:'An error is occured.'
        })
    }
    )
}

module
.exports={
    register,login,update,getUser,deleteUser
}