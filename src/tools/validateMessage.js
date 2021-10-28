/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} хоосон байна!',
  types: {
    email: '${label} Формат буруу байна!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

export default validateMessages;
