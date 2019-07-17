import DataLoader from 'dataloader';



export default (projectModel) => new DataLoader(async (userIds) => {
    const projectsFound = await projectModel.find({
        users: {
            $in: userIds
        }
    }).populate('users');

    const projects = userIds.map((userId) => {
        return projectsFound.filter((project) => {
            return project.users.some((users) => `${user._id}` === `${userId}`);
        })
    })

    return projects;

})