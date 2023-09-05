const Contact = require("../models/contacts.model");

const getAll = async (options, filter) => {
  try {
    const { page, limit } = options;
    const results = await Contact.paginate(filter, { page, limit });
    return results;
  } catch (error) {
    throw error;
  }
};

const getOne = async (id) => {
  return Contact.findById(id);
};

const create = async (data) => {
  try {
    const contactDataWithOwner = { ...data, owner: data.owner };
    const result = await Contact.create(contactDataWithOwner);
    return result;
  } catch (error) {
    throw error;
  }
};

const update = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, {
    new: true,
  });
};

const updateContact = async (id, favorite) => {
  return Contact.findByIdAndUpdate(
    id,
    { favorite },
    {
      new: true,
    }
  );
};

const remove = async (id) => {
  return Contact.findByIdAndDelete(id);
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  updateContact,
  remove,
};
