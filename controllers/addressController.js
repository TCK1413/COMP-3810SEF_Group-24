const Address = require('../models/Address');
// --- mport country-list module ---
const { getNames } = require('country-list');

exports.listAddresses = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const addresses = await Address.find({ user: userId })
      .sort({ isDefault: -1, updatedAt: -1 })
      .lean();
    res.render('user/address-list', { addresses });
  } catch (e) {
    next(e);
  }
};

exports.newAddressForm = (req, res) => {
  // --- Pass countries to the template ---
  res.render('user/address-form', { 
    mode: 'create', 
    address: {}, 
    error: null,
    countries: getNames() // Pass the country list
  });
};

exports.createAddress = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { street, city, postalCode, country, phone, isDefault } = req.body;

    if (isDefault === 'on') {
      await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false });
    }

    await Address.create({
      user: userId,
      street, city, postalCode, country, phone,
      isDefault: isDefault === 'on'
    });

    res.redirect('/user/addresses');
  } catch (e) {
    let errorMessage = e.message;
    if (e.name === 'ValidationError') {
      errorMessage = Object.values(e.errors).map(val => val.message)[0];
    }
    // --- Pass countries back on error ---
    res.status(400).render('user/address-form', { 
      mode: 'create', 
      address: req.body, 
      error: errorMessage,
      countries: getNames() // Pass the country list again
    });
  }
};

exports.editAddressForm = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const address = await Address.findOne({ _id: req.params.addressId, user: userId }).lean();
    if (!address) return res.redirect('/user/addresses');
    
    // --- Pass countries to the template ---
    res.render('user/address-form', { 
      mode: 'edit', 
      address, 
      error: null,
      countries: getNames() // Pass the country list
    });
  } catch (e) {
    next(e);
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { street, city, postalCode, country, phone, isDefault } = req.body;

    if (isDefault === 'on') {
      await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false });
    }

    await Address.updateOne(
      { _id: req.params.addressId, user: userId },
      { street, city, postalCode, country, phone, isDefault: isDefault === 'on' },
      { runValidators: true } 
    );

    res.redirect('/user/addresses');
  } catch (e) {
    let errorMessage = e.message;
    if (e.name === 'ValidationError') {
      errorMessage = Object.values(e.errors).map(val => val.message)[0];
    }
    // --- Pass countries back on error ---
    res.status(400).render('user/address-form', {
      mode: 'edit',
      address: { _id: req.params.addressId, ...req.body },
      error: errorMessage,
      countries: getNames() // Pass the country list again
    });
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    await Address.deleteOne({ _id: req.params.addressId, user: userId });
    res.redirect('/user/addresses');
  } catch (e) {
    next(e);
  }
};

exports.setDefaultAddress = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const { addressId } = req.params;
    await Address.updateMany({ user: userId, isDefault: true }, { isDefault: false });
    await Address.updateOne({ _id: addressId, user: userId }, { isDefault: true });
    res.redirect('/user/addresses');
  } catch (e) {
    next(e);
  }
};
