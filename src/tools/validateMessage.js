/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} хоосон байна!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

export default validateMessages;