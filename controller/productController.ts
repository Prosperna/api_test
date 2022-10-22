import { Request, Response } from 'express';
import Product from '../model/product';
import { v4 } from 'uuid';


export let products: Product[] = [];


// GET product list
export const getAllProduct = async (req:Request,res: Response)=>{
    try {

        // return product list
        return res.status(200).send(products.filter(i => i.user_id === res.locals.id));

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

        // save product
        const savedProduct: Product = {
            product_name,
            product_description,
            product_price,
            product_tag,
            id: v4(),
            user_id: res.locals.id
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

        // get product
        const product = products.find(i => i.id === id && i.user_id === res.locals.id);

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


// DELETE specific user using id
export const deleteProduct = async (req:Request, res: Response)=>{
    try {

        const { id } = req.params;


        // get product to be delete
        const product = products.find(i => i.id === id && i.user_id == res.locals.id);

        if (product) {

            const productList = products.filter(i => i.id !== id);

            // update product list
            products = [...productList];

            // return deleted product
            return res.status(200).send({
                message: "Product deleted successfully",
                data: product
            });

        } else {

            return res.status(404).send({message: "Product not found"});

        }


    } catch (error) {
        return res.status(500).send({
            message: 'Failed to delete product',
            description: error
        });
    }
}

// UPDATE specific product
export const updateProduct = async (req:Request,res: Response)=>{
    try {

        const { id } = req.params;

        const { product_description, product_name, product_price, product_tag } = req.body;

        // get product to be updated
        const product = products.find(i => i.id === id && i.user_id === res.locals.id);

        if (product) {

            const productList = products.filter(i => i.id !== product.id);

            const updatedProduct = {
                ...product,
                product_name,
                product_description,
                product_price,
                product_tag
            }

            // update product list
            products = [ ...productList, updatedProduct ];

            // return updated product
            return res.status(200).send({
                message: "Product updated successfully",
                data: updatedProduct
            });

        } else {

            return res.status(404).send({message: products});

        }


    } catch (error) {
        return res.status(500).send({
            message: 'Failed to update product',
            description: error
        });
    }
}