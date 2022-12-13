import Product from "../models/Product.js"
import User from "../models/User.js";

export const getProducts = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Product.findAll({
                //ambil relasi dengan user
                include:[{
                    model: User
                }]
            });
        }else{
            response = await Product.findAll({
                where:{
                    userId: req.userId
                },
                include:[{
                    model: User
                }]
            })
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProductById = (req, res) => {

}

export const createProduct = async (req, res) => {
    const {name, price} = req.body;
    try {
        await Product.create({
            name: name,
            price: price,
            userId: req.userId
        });
        res.status(201).json({msg: "Product create"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateProduct = (req, res) => {

}

export const deleteProduct = (req, res) => {

}