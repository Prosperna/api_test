import { Router } from 'express';
import { addProduct, getAllProduct, getProduct } from '../controller/productController';
import validateAddedProduct from '../middleware/validateAddedProduct';

const productRouter: Router = Router();

// register GET request for get product list
productRouter.get('/', getAllProduct);
// register POST request for add product
productRouter.post('/', validateAddedProduct, addProduct);
// register GET request for get specific product
productRouter.get('/:id', getProduct);


export default productRouter;