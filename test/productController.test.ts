import http from 'http';
import axios from 'axios';
import app from '../app';

describe("Product controller api testing",()=>{
    
    const port = 8081;
    const server = http.createServer(app);


    const user = {
        email: 'mardie@gmail.com',
        password: 'testing',
        password_confirmation: 'testing'
    };
    beforeAll(async ()=>{
        server.listen(port,() => {
            console.log("server listening");
        });

        await axios.post(`http://localhost:8081/api/v1/user`,user);
    });

    afterAll(()=>{
        server.close()
    });


    it("It test POST /product", async ()=> {        

        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        const prod = {
            product_name: 'cocacola',
            product_description: 'softdrinks',
            product_price: '12',
            product_tag: ['drinks', 'soda']
        };

        const product = await axios.post(`http://localhost:8081/api/v1/product`,prod,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        });

        expect(product.data.data).toStrictEqual({ ...product.data.data, user_id: product.data.data.user_id, id: product.data.data.id });

    });


    it("It test POST /product with blank product_name", async ()=> {
        
        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        const prod = {
            product_name: '',
            product_description: 'softdrinks',
            product_price: '12',
            product_tag: ['drinks', 'soda']
        };

        axios.post(`http://localhost:8081/api/v1/product`,prod,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        }).catch(err => {
            expect(err.response.data.error.details[0].message).toBe(`"product_name" is not allowed to be empty`);
        });

    });


    it("It test POST /product with blank product_description", async ()=> {
        
        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        const prod = {
            product_name: 'cocacola',
            product_description: '',
            product_price: '12',
            product_tag: ['drinks', 'soda']
        };

        axios.post(`http://localhost:8081/api/v1/product`,prod,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        }).catch(err => {
            expect(err.response.data.error.details[0].message).toBe(`"product_description" is not allowed to be empty`)
        });

    });


    it("It test POST /product with null product_price", async ()=> {

        try {
            const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
                email: user.email,
                password: user.password
            });
    
            const prod = {
                product_name: 'cocacola',
                product_description: 'softdrinks',
                product_price: null,
                product_tag: ['drinks', 'soda']
            };
    
    
            await axios.post(`http://localhost:8081/api/v1/product`,prod,{
                headers: {
                    Authorization: `Bearer ${authResponse.data.data}`
                }
            })
                
        } catch (err: any) {
            expect(err.response.data.error.details[0].message).toBe(`"product_price" must be a number`)
        }
        

    });

    
    it("It test POST /product with blank product tag", async ()=> {

        
        axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        }).then( authResponse => {

            const prod = {
                product_name: 'cocacola',
                product_description: 'softdrinks',
                product_price: '12',
                product_tag: ''
            };
    
            axios.post(`http://localhost:8081/api/v1/product`,prod,{
                headers: {
                    Authorization: `Bearer ${authResponse.data.data}`
                }
            }).catch(err => {
                expect(err.response.data.error.details[0].message).toBe(`"product_tag" must be an array`)
            });

        });
        


    });


    it("It test GET /product", async ()=> {

        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        const authUser = await axios.get(`http://localhost:8081/api/v1/auth/user`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        })

        const product = await axios.get(`http://localhost:8081/api/v1/product`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        });

        
        expect(product.data[0].user_id).toBe(authUser.data.data.id);    

    });

    it("It test GET /product using different user", async ()=> {

        const otherOne = {
            ...user,
            email: 'otherone@gmail.com'
        };

        await axios.post(`http://localhost:8081/api/v1/user`,otherOne);

        const { data: otherAuth } = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: otherOne.email,
            password: otherOne.password
        });

        const product = await axios.get(`http://localhost:8081/api/v1/product`,{
            headers: {
                Authorization: `Bearer ${otherAuth.data}`
            }
        });
        
        expect(product.data.length).toBe(0);    

    });


    it("It test GET /product using not authenticated user", async ()=> {

        await axios.get(`http://localhost:8081/api/v1/product`)
        .catch(err => {
            expect(err.response.data.message).toStrictEqual("Not authenticated");
        });

    });


    it("It test GET /product/:id", async ()=> {

        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        const authUser = await axios.get(`http://localhost:8081/api/v1/auth/user`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        })

        const product = await axios.get(`http://localhost:8081/api/v1/product`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        });

        const prod = await axios.get(`http://localhost:8081/api/v1/product/${product.data[0].id}`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        });

        expect(prod.data).toStrictEqual(product.data[0]);

    });


    it("It test GET /product/:id using different user", async ()=> {

        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        const differentUser = {
            ...user,
            email: 'differentuser@gmail.com'
        };

        await axios.post('http://localhost:8081/api/v1/user', differentUser);

        const { data: differentAuth } = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: differentUser.email,
            password: differentUser.password
        });

        const product = await axios.get(`http://localhost:8081/api/v1/product`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        });

        
        axios.get(`http://localhost:8081/api/v1/product/${product.data[0].id}`,{
            headers: {
                Authorization: `Bearer ${differentAuth.data}`
            }
        })
        .catch(err => {
            expect(err.response.data.message).toBe("Product not found");
        });

    });


    it("It test GET /product/:id with not authenticated user", async ()=> {

        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        const product = await axios.get(`http://localhost:8081/api/v1/product`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        });

        axios.get(`http://localhost:8081/api/v1/product/${product.data[0].id}`)
        .catch(err => {
            expect(err.response.data.message).toStrictEqual("Not authenticated");
        })

    });


    it("It test GET /product/:id with non existing id", async ()=> {

        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        const prod = await axios.get(`http://localhost:8081/api/v1/product/non_existing`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        }).catch(err => {
            expect(err.response.data.message).toStrictEqual("Product not found");
        });

    });


    it("It test PUT /product/:id", async ()=> {

        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        const product = await axios.get(`http://localhost:8081/api/v1/product`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        });


        const prod = await axios.put(`http://localhost:8081/api/v1/product/${product.data[0].id}`,{
            ...product.data[0],
            product_name: 'pepsi',
        },{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        })

        expect(prod.data.data.product_name).toBe('pepsi');

    });


    it("It test PUT /product/:id by not authenticated user", async ()=> {

        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        const product = await axios.get(`http://localhost:8081/api/v1/product`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        });


        axios.put(`http://localhost:8081/api/v1/product/${product.data[0].id}`,{
            ...product.data[0],
            product_name: 'pepsi',
        }).catch(err => {
            expect(err.response.data.message).toBe('Not authenticated');
        })        

    });

    it("It test DELETE /product/:id not owned by user", async ()=> {

        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        const newUser = {
            ...user,
            email: 'newuser@gmail.com'
        }

        await axios.post(`http://localhost:8081/api/v1/user`,newUser);

        const newUserAuthResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: newUser.email,
            password: newUser.password
        });


        const {data: product} = await axios.get(`http://localhost:8081/api/v1/product`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        });


        axios.delete(`http://localhost:8081/api/v1/product/${product[0].id}`,{
            headers: {
                Authorization: `Bearer ${newUserAuthResponse.data.data}`
            }
        }).catch(err => {
            expect(err.response.data.message).toBe("Product not found")
        });

    });


    it("It test DELETE /product/:id by using not authenticated user", async ()=> {

        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        const {data: product} = await axios.get(`http://localhost:8081/api/v1/product`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        });

        axios.delete(`http://localhost:8081/api/v1/product/${product[0].id}`).catch(err => {
            expect(err.response.data.message).toBe("Not authenticated")
        });

    });


    it("It test DELETE /product/:id by using not existing id", async ()=> {

        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        axios.delete(`http://localhost:8081/api/v1/product/not_existing`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        }).catch(err => {
            expect(err.response.data.message).toBe("Product not found")
        });

    });



    it("It test DELETE /product/:id", async ()=> {

        const authResponse = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: user.email,
            password: user.password
        });

        const { data: authUser } = await axios.get(`http://localhost:8081/api/v1/auth/user`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        })


        const {data: product} = await axios.get(`http://localhost:8081/api/v1/product`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        });


        const { data: deleted } = await axios.delete(`http://localhost:8081/api/v1/product/${product[0].id}`,{
            headers: {
                Authorization: `Bearer ${authResponse.data.data}`
            }
        });
        expect(deleted.data.id).toBe(product[0].id);
        expect(deleted.data.user_id).toBe(authUser.data.id);

    });


});