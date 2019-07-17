import { idResolver, factoryQueryAll } from '../utils';

const resolvers = {
    Query: {
      projects: (_, __, ctx) => ctx.models.Project.find({}).populate('users')

    },
    Mutation: {
        createProject: (_, {project}, ctx) => ctx.models.Project.create(project),
        addUserToProject: async (_, { projectId, uesrId }, ctx) => {
            const userToAdd = await ctx.models.User.exist({
                _id:userId
            })

            if(!userToAdd) {
                throw new Error(`User nof found`)
            }
            const projectToAdd = ctx.models.Project.findOne({
                _id: projectId
            })

            if(!projectToAdd) {
                throw new Error(`Project nof found`)
            }

            projectToAdd.users.push(userId);

            return projectToAdd.save();
        }
    },
    Project: {
      id: idResolver
    }
};

export default resolvers;