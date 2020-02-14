'use strict';

const uuid = require('uuid');

const { sequelize } = require('../models/database.js');
const User = require('../models/User.js');
const Taxinfo = require('../models/Taxinfo.js');
const Fw2 = require('../models/Fw2.js');
const F1099int = require('../models/F1099int.js');
const F1099b = require('../models/F1099b.js');
const F1099div = require('../models/F1099div.js');
const Dependents = require('../models/Dependents.js');
const converter = require('../utils/conversion.js');
const cryptor = require('../utils/encryption.js');
const validator = require('../utils/validation.js');

const getUserByUUID = async (userUUID) => sequelize.transaction(async (t) => User.findOne({
  where: { uuid: userUUID },
  transaction: t,
}));

const ensureUserTaxinfo = async (googleId) => sequelize.transaction(async (t) => {
  validator.validateGoogleId(googleId);
  const [user, created] = await User.findOrCreate({
    where: { googleId },
    defaults: { uuid: uuid.v4().toLowerCase() },
    transaction: t,
  });
  if (created) {
    await Taxinfo.create({ userId: user.id }, { transaction: t });
  }
  console.log(`logged in with google id ${googleId} created ${created}`); // eslint-disable-line no-console
  return user;
});

const getUserData = async (user) => sequelize.transaction(async (t) => {
  const taxinfo = await Taxinfo.findOne({
    where: { userId: user.id },
    attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
    transaction: t,
  });
  const queryOptions = {
    where: { taxinfoId: taxinfo.id },
    attributes: { exclude: ['id', 'taxinfoId', 'createdAt', 'updatedAt'] },
    transaction: t,
  };
  const [
    fw2,
    f1099int,
    f1099b,
    f1099div,
    dependents,
  ] = await Promise.all([
    Fw2,
    F1099int,
    F1099b,
    F1099div,
    Dependents,
  ].map((form) => form.findAll(queryOptions)));
  taxinfo.ssn = cryptor.decryptData(taxinfo.ssn);
  taxinfo.spouseSSN = cryptor.decryptData(taxinfo.spouseSSN);
  taxinfo.bankAccount = cryptor.decryptData(taxinfo.bankAccount);
  for (const value of dependents) {
    value.ssn = cryptor.decryptData(value.ssn);
  }
  return {
    taxinfo,
    fw2,
    f1099int,
    f1099b,
    f1099div,
    dependents,
  };
});

const updateUserData = async (user, data) => {
  validator.validateTaxinfoInput(data);
  await sequelize.transaction(async (t) => {
    const taxinfo = await Taxinfo.findOne({
      where: { userId: user.id },
      transaction: t,
    });
    const promises = [];
    promises.push(taxinfo.update({
      lastName: data.lastName,
      firstName: data.firstName,
      middleName: data.middleName,
      ssn: cryptor.encryptData(data.ssn),
      spouseName: data.spouseName,
      spouseSSN: cryptor.encryptData(data.spouseSSN),
      addr1: data.addr1,
      addr2: data.addr2,
      addr3: data.addr3,
      bankAccount: cryptor.encryptData(data.bankAccount),
      bankRouting: data.bankRouting,
      bankIsChecking: data.bankIsChecking,
    }, { transaction: t }));
    if (data.fw2 !== undefined) {
      for (const key of Object.keys(data.fw2)) {
        const queryOptions = {
          where: { taxinfoId: taxinfo.id, uuid: key.toLowerCase() },
          transaction: t,
        };
        promises.push((async () => {
          if (data.fw2[key] === null) {
            return Fw2.destroy(queryOptions);
          }
          const [form] = await Fw2.findOrCreate(queryOptions);
          return form.update({
            employer: data.fw2[key].employer,
            income: converter.floatToBigint(data.fw2[key].income),
            taxWithheld: converter.floatToBigint(data.fw2[key].taxWithheld),
          }, { transaction: t });
        })());
      }
    }
    if (data.f1099int !== undefined) {
      for (const key of Object.keys(data.f1099int)) {
        const queryOptions = {
          where: { taxinfoId: taxinfo.id, uuid: key.toLowerCase() },
          transaction: t,
        };
        promises.push((async () => {
          if (data.f1099int[key] === null) {
            return F1099int.destroy(queryOptions);
          }
          const [form] = await F1099int.findOrCreate(queryOptions);
          return form.update({
            payer: data.f1099int[key].payer,
            income: converter.floatToBigint(data.f1099int[key].income),
            // eslint-disable-next-line max-len
            usSavingTreasInterest: converter.floatToBigint(data.f1099int[key].usSavingTreasInterest),
            taxWithheld: converter.floatToBigint(data.f1099int[key].taxWithheld),
            taxExemptInterest: converter.floatToBigint(data.f1099int[key].taxExemptInterest),
          }, { transaction: t });
        })());
      }
    }
    if (data.f1099b !== undefined) {
      for (const key of Object.keys(data.f1099b)) {
        const queryOptions = {
          where: { taxinfoId: taxinfo.id, uuid: key.toLowerCase() },
          transaction: t,
        };
        promises.push((async () => {
          if (data.f1099b[key] === null) {
            return F1099b.destroy(queryOptions);
          }
          const [form] = await F1099b.findOrCreate(queryOptions);
          return form.update({
            desc: data.f1099b[key].desc,
            proceeds: converter.floatToBigint(data.f1099b[key].proceeds),
            basis: converter.floatToBigint(data.f1099b[key].basis),
            isLongTerm: data.f1099b[key].isLongTerm,
            taxWithheld: converter.floatToBigint(data.f1099b[key].taxWithheld),
          }, { transaction: t });
        })());
      }
    }
    if (data.f1099div !== undefined) {
      for (const key of Object.keys(data.f1099div)) {
        const queryOptions = {
          where: { taxinfoId: taxinfo.id, uuid: key.toLowerCase() },
          transaction: t,
        };
        promises.push((async () => {
          if (data.f1099div[key] === null) {
            return F1099div.destroy(queryOptions);
          }
          const [form] = await F1099div.findOrCreate(queryOptions);
          return form.update({
            payer: data.f1099div[key].payer,
            ordDividends: converter.floatToBigint(data.f1099div[key].ordDividends),
            qualDividends: converter.floatToBigint(data.f1099div[key].qualDividends),
            taxWithheld: converter.floatToBigint(data.f1099div[key].taxWithheld),
            exemptInterestDiv: converter.floatToBigint(data.f1099div[key].exemptInterestDiv),
          }, { transaction: t });
        })());
      }
    }
    if (data.dependents !== undefined) {
      for (const key of Object.keys(data.dependents)) {
        const queryOptions = {
          where: { taxinfoId: taxinfo.id, uuid: key.toLowerCase() },
          transaction: t,
        };
        promises.push((async () => {
          if (data.dependents[key] === null) {
            return Dependents.destroy(queryOptions);
          }
          const [form] = await Dependents.findOrCreate(queryOptions);
          return form.update({
            name: data.dependents[key].name,
            ssn: cryptor.encryptData(data.dependents[key].ssn),
            relation: data.dependents[key].relation,
            childCredit: data.dependents[key].childCredit,
          }, { transaction: t });
        })());
      }
    }
    return Promise.all(promises);
  });
};

const clearUserData = async (user) => sequelize.transaction(async (t) => {
  const taxinfo = await Taxinfo.findOne({
    where: { userId: user.id },
    transaction: t,
  });
  await Promise.all([Fw2, F1099int, F1099b, F1099div, Dependents].map((form) => form.destroy({
    where: { taxinfoId: taxinfo.id },
    transaction: t,
  })));
  await taxinfo.update({
    lastName: null,
    firstName: null,
    middleName: null,
    ssn: null,
    spouseName: null,
    spouseSSN: null,
    addr1: null,
    addr2: null,
    addr3: null,
    bankAccount: null,
    bankRouting: null,
    bankIsChecking: null,
  }, { transaction: t });
  return user.update({ pdfResult: null }, { transaction: t });
});

module.exports = {
  getUserByUUID,
  ensureUserTaxinfo,
  getUserData,
  updateUserData,
  clearUserData,
};
