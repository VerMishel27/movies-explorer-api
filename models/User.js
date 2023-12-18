const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');

const userShema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: {
        value: true,
        message: 'Поле email является обязательным',
      },
      validate: {
        validator: (v) => isEmail(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
      unique: true,
    },
    password: {
      type: String,
      required: {
        value: true,
        message: 'Поле password является обязательным',
      },
      select: false,
    },
    name: {
      type: String,
      required: {
        value: true,
        message: 'Поле name является обязательным',
      },
      minlength: [2, 'Минимальная длинна 2 символа'],
      maxlength: [30, 'Максимальная длинна 30 символов'],
    },
  },
  { versionKey: false, timestamps: true },
);

module.exports = mongoose.model('user', userShema);
