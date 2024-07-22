export const userValidationSchema = {
  email: {
    notEmpty: { errorMessage: 'Email cannot be empty.' },
    isEmail: { errorMessage: 'Please enter a valid email.' },
  },
  fullname: {
    isString: {
      errorMessage: 'Please enter a valid name.',
    },
    notEmpty: {
      errorMessage: 'Name cannot be empty.',
    },
  },
  password: {
    notEmpty: { errorMessage: 'Password cannot be empty.' },
  },
};
