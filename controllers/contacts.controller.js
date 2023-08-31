const contactsService = require("../services/contacts.service");

const createResponse = (status, code, data) => {
  return { status, code, data };
};

const get = async (req, res, next) => {
  try {
    const { query } = req;
    const results = await contactsService.getAll(query);
    res.json(createResponse("success", 200, { contacts: results }));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getOne(id);

    if (!result) {
      return res
        .status(404)
        .json(createResponse("not-found", 404, { contact: result }));
    }

    res.json(createResponse("success", 200, { contact: result }));
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json(createResponse("error", 400, { message: error.message }));
  }
};

const create = async (req, res, next) => {
  try {
    const { body } = req;
    const userId = req.user._id;
    const result = await contactsService.create({ ...body, owner: userId });
    res.json(createResponse("success", 200, { contact: result }));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const result = await contactsService.update(id, body);
    res.json(createResponse("success", 200, { contact: result }));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    if (typeof favorite !== "boolean") {
      return res
        .status(400)
        .json(
          createResponse("error", 400, { message: "missing field favorite" })
        );
    }

    const updatedContact = await contactsService.updateContact(contactId, {
      favorite,
    });

    if (!updatedContact) {
      return res
        .status(404)
        .json(createResponse("not-found", 404, { message: "Not found" }));
    }

    res
      .status(200)
      .json(createResponse("success", 200, { contact: updatedContact }));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.remove(id);
    res.json(createResponse("success", 200, { id, contact: result }));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  get,
  getById,
  create,
  update,
  updateFavorite,
  remove,
};
