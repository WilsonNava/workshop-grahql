import dotenv from 'dotenv';
import { GraphQLServer } from 'graphql-yoga'
import mongoose from 'mongoose';
import userModel from './user.model'

dotenv.config();
const PORT = process.env.PORT || 4000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const models = {
    User: userModel
}

const typeDefs = `
  type User{
    id: ID,
    name: String,
    email: String!
  }

  type Query {
    hello(name: String): String!
    user: User!
    users: [User]!
  }

  input UserInput {
    name: String!
    email: String!
  }

  type Mutation {
    hello(name: String): Boolean
    createUser(name: String!, email: String!): User!
    createUsers(users: [UserInput]!): [User]!
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    user: () => ({name:"w", email:"emaisl"}),
    users: async (_, args, ctx) => {
        const users = await ctx.models.User.find({})
        return users;
    }
  },
  Mutation: {
      hello: (root, args) => null,

      createUser: async (_, args, ctx) => {
          const exists = await ctx.models.User.exists({email: args.email});
          if (!exists) {
            const userCreated = await ctx.models.User.create(args);
            return userCreated;
          }
           throw new Error("User already exist")
      },

      createUsers: async (_, args, ctx) => {
        const users = args.users;
        console.log(users)
        let exists = false;

        if (users.length === 0) return [];

        let emails = [];



        for (let i = 0; i <users.length; i++) {
            exists = await  emails.includes(users[i].email) || ctx.models.User.exists({email: users[i].email});
            emails.push(users[i].email);

            if (exists) {
                throw new Error("User already exist")
                break;
            }
        }

        const usersCreated = await ctx.models.User.create(users);

        return usersCreated;
      }
  },
  User: {
      //este es un resolver específico para un tipo
      id: (root) => root._id
  }
}


const db = mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@workshop-nyp5k.mongodb.net/users`)
.then((data) => {
    console.log("DB connected");
    const server = new GraphQLServer({
        typeDefs,
        resolvers,
        context: {
            models,
            db
        }
    })
    server.start(() => console.log(`Server is running on localhost:${PORT}`))
}).catch(()=>{
    console.log("Error")
});
