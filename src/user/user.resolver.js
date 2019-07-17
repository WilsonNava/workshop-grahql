import { idResolver } from '../utils';

const resolvers = {
    Query: {
      users: (_, __, ctx) => ctx.models.User.find({})
    },
    Mutation: {
      createUser: async (_, args, ctx) => {
        const {
          name,
          email
        } = args.user;

        const alreadyCreated = await ctx.models.User.exists({
          email,
        });

        if (alreadyCreated) {
          throw new Error('Email already exists');
        }

        const userCreated = await ctx.models.User.create({
          name,
          email,
        });
        return userCreated;
      },
    },
    User: {
      id: idResolver,
      projects: async (user, _, ctx) => {
        return ctx.loaders.projects.load(user._id);
     },
    }
}

export default resolvers;