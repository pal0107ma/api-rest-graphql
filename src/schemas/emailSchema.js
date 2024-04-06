import Joi from 'joi';
const schema = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net"] },
});
export default schema;
