import Joi from 'joi'

export default Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/)
