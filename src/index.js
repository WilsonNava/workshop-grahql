import dotenv from 'dotenv';
import { GraphQLServer } from 'graphql-yoga'
import mongoose from 'mongoose';
import {
  models,
  typeDefs,
  resolvers,
  loaders
} from './graphql';


dotenv.config();
const PORT = process.env.PORT || 4000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const db = mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@workshop-nyp5k.mongodb.net/users`)
.then((data) => {
    console.log("DB connected");
    const server = new GraphQLServer({
        typeDefs,
        resolvers,
        context: {
            models,
            db,
            loaders
        }
    })
    server.start(() => console.log(`Server is running on localhost:${PORT}`))
}).catch((e)=>{
    console.log("Error", e)
});
