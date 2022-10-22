import http from 'http';
import axios from 'axios';
import app from '../app';

describe("User controller api testing",()=>{
    
    const port = 8081;
    const server = http.createServer(app);
    beforeAll(()=>{
        server.listen(port,() => {
            console.log("server listening");
        });
    });

    afterAll(()=>{
        server.close()
    })

    

    test("It test POST /user api with correct parameters", async ()=>{
        const params = {
            email: "gonzales.mardie@gmail.com",
            password: "testing",
            password_confirmation: "testing"
        }
        const res = await axios.post("http://localhost:8081/api/v1/user",params)
          
        expect(res.data.message).toBe("User added successfully");
        expect(res.data.data.email).toBe(params.email);
            
    });

    test("It test POST /user api with mismatch password", async ()=>{
        const params = {
            email: "gonzales.mardie@gmail.com",
            password: "testing",
            password_confirmation: "hello"
        }
        
            axios.post("http://localhost:8081/api/v1/user",params).catch(err =>{
                expect(err.response.data.message).toBe("Internal server error");
                expect(err.response.data.error.details[0].message).toBe(`"password_confirmation" must be [ref:password]`)
            })
                
    });


    test("It test POST /user api with invalid email", async ()=>{
        const params = {
            email: "gonzales.mardie",
            password: "testing",
            password_confirmation: "testing"
        };
        axios.post("http://localhost:8081/api/v1/user",params).catch(err =>{
            expect(err.response.data.message).toBe("Internal server error");
            expect(err.response.data.error.details[0].message).toBe(`"email" must be a valid email`)
        });
                
    });


    test("It test POST /user api with blank password", async ()=>{
        const params = {
            email: "gonzales.mardie@gmail.com",
            password: "",
            password_confirmation: "testing"
        };
        axios.post("http://localhost:8081/api/v1/user",params).catch(err =>{
            expect(err.response.data.message).toBe("Internal server error");
            expect(err.response.data.error.details[0].message).toBe(`"password" is not allowed to be empty`)
        });
                
    });

    test("It test POST /user api with blank password_confirmation", async ()=>{
        const params = {
            email: "gonzales.mardie@gmail.com",
            password: "testing",
            password_confirmation: ""
        };
        axios.post("http://localhost:8081/api/v1/user",params).catch(err =>{
            expect(err.response.data.message).toBe("Internal server error");
            expect(err.response.data.error.details[0].message).toBe(`"password_confirmation" must be [ref:password]`)
        });
                
    });


    test("It test GET /user", async ()=> {

        const params = {
            email: "noreply@gmail.com",
            password: "testing",
            password_confirmation: "testing"
        };
        await axios.post("http://localhost:8081/api/v1/user",params);

        const res = await axios.get("http://localhost:8081/api/v1/user");
        expect(res.data.length).toBe(2);
        
    });


    test("It test PUT /user/:id", async ()=> {
        // Get user list
        const res = await axios.get("http://localhost:8081/api/v1/user");

        const params = {
            email: "update@gmail.com",
            password: "testing",
        };

        // login user
        const auth = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: res.data[0].email,
            password: "testing"
        });

        // update user
        const updated = await axios.put(`http://localhost:8081/api/v1/user/${res.data[0].id}`,params,{
            headers: {
                Authorization: `Bearer ${auth.data.data}`
            }
        });

        expect(updated.data.data.email).toBe("update@gmail.com");

    });


    test("It test PUT /user/:id updating not own account", async ()=> {
        // Get user list
        const res = await axios.get("http://localhost:8081/api/v1/user");

        const params = {
            email: "update@gmail.com",
            password: "testing",
        };

        // login user
        const auth = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: res.data[0].email,
            password: "testing"
        });

        // update user
        await axios.put(`http://localhost:8081/api/v1/user/${res.data[1].id}`,params,{
            headers: {
                Authorization: `Bearer ${auth.data.data}`
            }
        }).catch(err => {
            expect(err.response.data.message).toBe("You can only update your account");
        });

    });


    test("It test PUT /user/:id with no password", async ()=> {
        // Get user list
        const res = await axios.get("http://localhost:8081/api/v1/user");

        // login user
        const auth = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: res.data[0].email,
            password: "testing"
        });

        const params = {
            email: "update@gmail.com",
            password: "",
        };

        // update user
        axios.put(`http://localhost:8081/api/v1/user/${res.data[0].id}`,params,{
            headers: {
                Authorization: `Bearer ${auth.data.data}`
            }
        }).catch(err => {
            expect(err.response.data.error.details[0].message).toBe(`"password" is not allowed to be empty`);
        });

    });


    test("It test PUT /user/:id with no email", async ()=> {
        // Get user list
        const res = await axios.get("http://localhost:8081/api/v1/user");

        // login user
        const auth = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: res.data[0].email,
            password: "testing"
        });

        const params = {
            email: "",
            password: "testing",
        };

        // update user
        axios.put(`http://localhost:8081/api/v1/user/${res.data[0].id}`,params,{
            headers: {
                Authorization: `Bearer ${auth.data.data}`
            }
        }).catch(err => {
            expect(err.response.data.error.details[0].message).toBe(`"email" is not allowed to be empty`);
        });

    });


    test("It test PUT /user/:id with invalid email", async ()=> {
        // Get user list
        const res = await axios.get("http://localhost:8081/api/v1/user");

        // login user
        const auth = await axios.post(`http://localhost:8081/api/v1/auth/login`,{
            email: res.data[0].email,
            password: "testing"
        });

        const params = {
            email: "testing",
            password: "testing",
        };

        // update user
        axios.put(`http://localhost:8081/api/v1/user/${res.data[0].id}`,params,{
            headers: {
                Authorization: `Bearer ${auth.data.data}`
            }
        }).catch(err => {
            expect(err.response.data.error.details[0].message).toBe(`"email" must be a valid email`);
        });

    });

    test("It test GET /user/:id using existing id", async ()=> {
        // Get user list
        const res = await axios.get("http://localhost:8081/api/v1/user");

        const { data } = await axios.get(`http://localhost:8081/api/v1/user/${res.data[0].id}`);

        expect(data.email).toBe(res.data[0].email);
        expect(data.id).toBe(res.data[0].id);
    });


    test("It test GET /user/:id using not existing id", async ()=> {

        axios.get(`http://localhost:8081/api/v1/user/non_existing_id`).catch(err => {
            expect(err.response.data.message).toBe("User not found");
        });        

    });


    test("It test DELETE /user/:id", async ()=> {
        // Get user list
        const res = await axios.get("http://localhost:8081/api/v1/user");

        // update user
        const { data } =await axios.delete(`http://localhost:8081/api/v1/user/${res.data[0].id}`);
        expect(data.message).toBe("User deleted successfully");
        expect(data.data.email).toBe(res.data[0].email);
        expect(data.data.id).toBe(res.data[0].id);

    });


    test("It test DELETE /user/:id using not existing id", async ()=> {
        // Get user list
        const res = await axios.get("http://localhost:8081/api/v1/user");

        axios.delete(`http://localhost:8081/api/v1/user/non_existing_id`).catch(err => {
            expect(err.response.data.message).toBe("User not found");
        });        

    });


});