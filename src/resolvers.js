import userProfile from './resolvers/users/userProfile.js'
import createPost from './resolvers/posts/createPost.js'
import post from './resolvers/posts/post.js'
import posts from './resolvers/posts/posts.js'
import updatePost from './resolvers/posts/updatePost.js'
import updateUser from './resolvers/users/updateUser.js'
import addUserSkill from './resolvers/users/addUserSkill.js'
import deleteUserSkill from './resolvers/users/deleteUserSkill.js'
import addUserWorkExperience from './resolvers/users/addUserWorkExperience.js'
import deleteUserWorkExperience from './resolvers/users/deleteUserWorkExperience.js'

const resolvers = {
  User: {
    id: (parent) => parent.id ?? parent._id
  },
  Post: {
    id: (parent) => parent.id ?? parent._id,
    responsesCount: (parent) => parent.responses.length

  },
  WorkExperience: {
    id: (parent) => parent.id ?? parent._id
  },
  Skill: {
    id: (parent) => parent.id ?? parent._id
  },
  Query: {
    userProfile,
    post,
    posts
  },
  Mutation: {
    createPost,
    updatePost,
    updateUser,
    addUserSkill,
    deleteUserSkill,
    addUserWorkExperience,
    deleteUserWorkExperience
  }

}

export default resolvers
