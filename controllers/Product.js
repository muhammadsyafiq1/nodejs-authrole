import Product from "../models/Product.js"
import User from "../models/User.js";

export const getProducts = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Product.findAll({
                attributes:[
                    'name', 'price'
                ],
                //ambil relasi dengan user
                include:[{
                    model: User,
                    attributes:[
                        'name', 'email'
                    ]
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

export const getProductById = async (req, res) => {
    try {
        const response = await Product.findOne({
            include:[{
                model: User
            }],
            where:{
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
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

export const updateProduct = async (req, res) => {
    
}

export const deleteProduct = async  (req, res) => {
    const product = await Product.findOne({
        where: {
            uuid: req.params.id
        }
    });
    console.log(product);
    if(!product) return res.status(404).json({msg: "Product tidak ada"});

    try {
        await Product.destroy({
            where:{
                uuid: product.uuid
            }
        });
        res.status(200).json({msg: "Product deleted"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}