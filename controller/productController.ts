import { Request, Response } from 'express';
import Product from '../model/product';

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
