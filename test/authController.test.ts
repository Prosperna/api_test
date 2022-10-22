import http from 'http';
import axios from 'axios';
import app from '../app';
import exp from 'constants';

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


    test('It test POST /auth/login', async ()=> {

        const { data: auth } = await axios.post('http://localhost:8081/api/v1/auth/login',{
            email: user.email,
            password: user.password
        });

        expect(auth.message).toBe("Login successfully");

    });


    test('It test POST /auth/login using invalid credentials', async ()=> {

        axios.post('http://localhost:8081/api/v1/auth/login',{
            email: user.email,
            password: 'invalid'
        })
        .catch(err => {
            expect(err.response.data.message).toStrictEqual("Invalid username or password");
        });

    });


    test('It test POST /auth/login using invalid email', async ()=> {

        axios.post('http://localhost:8081/api/v1/auth/login',{
            email: 'test',
            password: user.password
        })
        .catch(err => {
            expect(err.response.data.error.details[0].message).toStrictEqual(`"email" must be a valid email`);
        });

    });


    test('It test POST /auth/login using blank password', async ()=> {

        axios.post('http://localhost:8081/api/v1/auth/login',{
            email: user.email,
            password: ''
        })
        .catch(err => {
            expect(err.response.data.error.details[0].message).toStrictEqual(`"password" is not allowed to be empty`);
        });

    });


    test('It test GET /auth/user', async ()=> {     

        const res = await axios.post('http://localhost:8081/api/v1/auth/login',{
            email: user.email,
            password: user.password
        });

        const { data: authUser } = await axios.get('http://localhost:8081/api/v1/auth/user',{
            headers: {
                Authorization: `Bearer ${res.data.data}`
            }
        })

        expect(authUser.data.email).toBe(user.email);

    });

});