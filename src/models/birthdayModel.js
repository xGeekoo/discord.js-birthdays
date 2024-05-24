const mongoose = require('mongoose');
const getRandomInt = require('../utils/getRandomInt');

const months = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre'
];

const monthsOf31Days = [
  'janvier',
  'mars',
  'mai',
  'juillet',
  'août',
  'octobre',
  'décembre'
];

const monthsOf30Days = ['avril', 'juin', 'septembre', 'novembre'];

const birthdaySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      trim: true,
      required: [true, 'Merci de fournir un userId']
    },
    name: {
      type: String
    },
    month: {
      type: String,
      trim: true,
      lowercase: true,
      enum: {
        values: months,
        message: 'Merci de fournir un mois valide'
      },
      required: [true, 'Merci de fournir un mois']
    },
    day: {
      type: Number,
      validate: {
        validator: function (val) {
          if (!Number.isInteger(val)) return false;

          if (this.month === 'février') {
            return val >= 1 && val <= 29;
          }

          if (monthsOf31Days.includes(this.month)) {
            return val >= 1 && val <= 31;
          }

          if (monthsOf30Days.includes(this.month)) {
            return val >= 1 && val <= 30;
          }

          return false;
        },
        message: 'Merci de fournir un jour valide'
      },
      required: [true, 'Merci de fournir un jour']
    },
    isAnnounced: {
      type: Boolean,
      default: false
    },
    isPresent: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      // default: () => Date.now()
      default: () => new Date(2020, getRandomInt(0, 11), getRandomInt(1, 28))
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false }
);

birthdaySchema.virtual('isBirthday').get(function () {
  const currentMonth = months.at(new Date().getUTCMonth());
  const currentDay = new Date().getUTCDate();
  const currentYear = new Date().getUTCFullYear();
  const isLeapYear = new Date(currentYear, 2, 0) === 29;

  if (this.month === 'février' && this.day === 29) {
    if (isLeapYear) {
      return currentMonth === 'février' && currentDay === 29;
    } else {
      return currentMonth === 'mars' && currentDay === 1;
    }
  }

  return this.month === currentMonth && this.day === currentDay;
});

birthdaySchema.pre(/^find/, function (next) {
  console.log('test');
  this.find({ isPresent: true });
  next();
});

birthdaySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isPresent: true } });
  next();
});

birthdaySchema.statics.getNumPages = async function ({ month, pageSize = 3 }) {
  const arr = await this.aggregate([
    {
      $match: { month }
    },
    {
      $group: {
        _id: '$day',
        ids: { $push: '$_id' }
      }
    },
    {
      $project: { _id: 0 }
    }
  ]);

  const numMaxUsersDay =
    arr.length > 0 ? Math.max(...arr.map(obj => obj.ids.length)) : 0;

  return Math.ceil(numMaxUsersDay / pageSize) || 1;
};

birthdaySchema.statics.getBirthdaysOfMonth = async function ({
  month,
  pageNumber = 1,
  pageSize = 3
}) {
  return await this.aggregate([
    {
      $match: { month }
    },
    {
      $sort: { createdAt: 1 }
    },
    {
      $group: {
        _id: '$day',
        ids: { $push: '$_id' }
      }
    },
    {
      $addFields: {
        day: '$_id',
        ids: {
          $slice: ['$ids', (pageNumber - 1) * pageSize, pageNumber * pageSize]
        }
      }
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { day: 1 }
    }
  ]);
};

birthdaySchema.statics.generateBirthdaysDescription = function (birthdays) {
  return birthdays.length > 0
    ? birthdays
        .filter(birthday => birthday.ids.length > 0)
        .map(birthday => {
          const day = String(birthday.day).padStart(2, '0');
          const ids = birthday.ids.map(id => `<@${id}>`).join(' | ');

          return `\`${day}\` ${ids}`;
        })
        .join('\n')
    : null;
};

const Birthday = mongoose.model('Birthday', birthdaySchema);

module.exports = Birthday;
