import express, { json } from 'express';

const app = express();

app.get("/", (request, response) => {
    return response.json({
        "message": "HELLO WORLD!"
    })
})

app.post("/users", (request, response) => {
    const reqBody = request.body;
    console.log(typeof(reqBody));
    return response.json({
        "message": "POST method used"
    })
})

app.listen(3333, () => console.log("Server running on port 3333"));