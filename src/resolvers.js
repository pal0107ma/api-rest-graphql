import userProfile from './resolvers/userProfile.js'
import createPost from './mutations/createPost.js'
import post from './resolvers/post.js'
import posts from './resolvers/posts.js'
import updatePost from './mutations/updatePost.js'
import updateUser from './mutations/updateUser.js'
import addUserSkill from './resolvers/users/addUserSkill.js'
import deleteUserSkill from './resolvers/users/deleteUserSkill.js'

const resolvers = {
  User: {
    id: (parent) => parent.id ?? parent._id
  },
  Post: {
    id: (parent) => parent.id ?? parent._id,
    responsesCount: (parent) => parent.responses.length

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
    deleteUserSkill
  }

}

export default resolvers
