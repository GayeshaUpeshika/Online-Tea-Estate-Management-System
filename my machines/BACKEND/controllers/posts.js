import express from 'express';
import mongoose from 'mongoose';

import PostMachine from '../models/postMachine.js';

const router = express.Router();

export const getPosts = async (req, res) => { 
    try {
        const postMachines = await PostMachine.find();
                
        res.status(200).json(postMachines);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMachine.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;

    const newPostMachine = new PostMachine({ ...post, creator:req.userId, createdAt: new Date().toISOString() })

    try {
        await newPostMachine.save();

        res.status(201).json(newPostMachine );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id:_id } = req.params;
    const post = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const updatedPost = await PostMachine.findByIdAndUpdate(_id, post, { new: true });

    

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    await PostMachine.findByIdAndRemove(id);

    console.log('DELETE!');

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });
      

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with that id`);
    
    const post = await PostMachine.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id != String(req.userId));
    }

    const updatedPost = await PostMachine.findByIdAndUpdate(id, post , { new: true });
    
    res.json(updatedPost);
}
 
export default router; 