import path from "path";
import Product from "../models/Product.js"
import User from "../models/User.js";

export const getProducts = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Product.findAll({
                // attributes:[
                //     'name', 'price'
                // ],
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
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const name = req.body.name
    const file = req.files.file
    const price = req.body.price
    const userId = req.userId
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`
    const allowedType = ['.png','.jpg','.jpeg']
 
    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});
 
    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Product.create({name: name, image: fileName, url: url, price: price, userId: userId});
            res.status(201).json({msg: "Product Created Successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    })
}
 
export const updateProduct = async (req, res) => {
    const product = await Product.findOne({where:{
        uuid: req.params.id
    }});
    if(!product) res.status(404).json({msg: "Product tidak ada"});

    const {name, price} = req.body;
    if(req.userId !== product.userId) return res.status(403).json({msg: "Akses terbatas"});
    try {
        await Product.update({name, price},{
            where:{
                uuid  :req.params.id
            }
        });
        res.status(200).json({msg: "product berhasil diupdate"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }

}

export const deleteProduct = async  (req, res) => {
    const product = await Product.findOne({
        where: {
            uuid: req.params.id
        }
    });
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
