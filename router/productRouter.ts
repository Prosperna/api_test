import { Router } from 'express';
import { addProduct, deleteProduct, getAllProduct, getProduct } from '../controller/productController';
import authenticated from '../middleware/authenticated';
import validateAddedProduct from '../middleware/validateAddedProduct';

const productRouter: Router = Router();

// register GET request for get product list
productRouter.get('/', authenticated ,getAllProduct);
// register POST request for add product
productRouter.post('/', authenticated, validateAddedProduct, addProduct);
// register GET request for get specific product
productRouter.get('/:id', authenticated, getProduct);
// register DELETE request for specific product
productRouter.delete('/:id', authenticated, deleteProduct);


export default productRouter;