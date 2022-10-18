import { Request, Response } from 'express';
import Product from '../model/product';
import { v4 } from 'uuid';

import { getDecodedToken } from '../utils/jwt';

let products: Product[] = [];



// GET product list
export const getAllProduct = async (req:Request,res: Response)=>{
    try {

        // return product list
        return res.status(200).send(products);

    } catch (error) {
        return res.status(500).send({
            message: 'Failed to get product list',
            description: error
        });
    }
}


// CREATE product
export const addProduct = async (req:Request,res: Response)=>{
    try {
        
        // get post parameters
        const  {
            product_name,
            product_description,
            product_price,
            product_tag,
        } = req.body;

        const decoded = getDecodedToken(req.headers.authorization||'');
        const user = decoded?.data||{};

        // save user
        const savedProduct: Product = {
            product_name,
            product_description,
            product_price,
            product_tag,
            id: v4(),
            user_id: user.id
        };
        products = [...products, savedProduct];

        // return response
        return res.status(200).send({
            message: 'Product added successfully',
            data: savedProduct
        });

    } catch (error) {
        return res.status(500).send({
            message: 'Failed to add product',
            description: error
        });
    }
}

// GET specific product using id
export const getProduct = async (req:Request,res: Response)=>{
    try {

        const { id } = req.params;

        const decoded = getDecodedToken(req.headers.authorization||'');
        const user = decoded?.data||{};

        // get product
        const product = products.find(i => i.id === id && i.user_id === user.id);

        if (product) {

            // return specific product
            return res.status(200).send(product);

        } else {

            return res.status(404).send({message: "Product not found"});

        }


    } catch (error) {
        return res.status(500).send({
            message: 'Failed to get product list',
            description: error
        });
    }
}