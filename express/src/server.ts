import express, { type Application, type Request, type Response } from 'express';

const app: Application = express();
const PORT = 5000



app.get('/', (req: Request, res: Response) => {
    res.send('this is home page')
})


app.listen(PORT, () => {
    console.log(`server is running ${PORT}`)
})