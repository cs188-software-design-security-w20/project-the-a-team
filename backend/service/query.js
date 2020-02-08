'use strict';

const { sequelize } = require('../models/database.js');
const Taxinfo = require('../models/Taxinfo.js');
const Fw2 = require('../models/Fw2.js');
const F1099int = require('../models/F1099int.js');
const F1099div = require('../models/F1099div.js');
const F1099b = require('../models/F1099b.js');
const Dependents = require('../models/Dependents.js');

const getUserData = async (user) => {
  try {
    return sequelize.transaction(async (t) => {
      const ttaxinfo = await Taxinfo.findOne({
        where: { userId: user.id },
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        transaction: t,
      });
      const [
        tfw2,
        tf1099int,
        tf1099b,
        tf1099div,
        tdependents,
      ] = await Promise.all([
        Fw2.findAll({
          where: { taxinfoId: ttaxinfo.id },
          attributes: { exclude: ['id', 'taxinfoId', 'createdAt', 'updatedAt'] },
          transaction: t,
        }),
        F1099int.findAll({
          where: { taxinfoId: ttaxinfo.id },
          attributes: { exclude: ['id', 'taxinfoId', 'createdAt', 'updatedAt'] },
          transaction: t,
        }),
        F1099b.findAll({
          where: { taxinfoId: ttaxinfo.id },
          attributes: { exclude: ['id', 'taxinfoId', 'createdAt', 'updatedAt'] },
          transaction: t,
        }),
        F1099div.findAll({
          where: { taxinfoId: ttaxinfo.id },
          attributes: { exclude: ['id', 'taxinfoId', 'createdAt', 'updatedAt'] },
          transaction: t,
        }),
        Dependents.findAll({
          where: { taxinfoId: ttaxinfo.id },
          attributes: { exclude: ['id', 'taxinfoId', 'createdAt', 'updatedAt'] },
          transaction: t,
        }),
      ]);
      return {
        taxinfo: ttaxinfo,
        fw2: tfw2,
        f1099int: tf1099int,
        f1099b: tf1099b,
        f1099div: tf1099div,
        dependents: tdependents,
      };
    });
  } catch (err) {
    console.log(err); // eslint-disable-line no-console
  }
  return {};
};

module.exports = { getUserData };
