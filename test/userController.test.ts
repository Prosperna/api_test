import http from 'http';
import axios from 'axios';
import app from '../app';

describe("User controller api testing",()=>{
    
    const port = 8081;
    beforeAll(()=>{
        const server = http.createServer(app);
        server.listen(port,() => {
            console.log("server listening");
        });
        
        
    });

    

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



});