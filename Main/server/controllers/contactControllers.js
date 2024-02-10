const asyncHandler = require("express-async-handler");
const Contacts = require("../models/contactModels");

const getContacts = asyncHandler(async (req, res) => {
  try{
  const contactsList = await Contacts.find({ user_id: req.user.id });
  res.status(200).json(contactsList);
  }catch(err){
    console.log(err)
  }
});

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("all fields are mandetory");
  }
  // console.log(name, email, phone);
  const constactsList = await Contacts.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });

  res.status(201).json(constactsList);
});

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contacts.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contacts.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to edit other contacts");
  }
  const updateContact = await Contacts.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updateContact);
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contacts.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to delete other contacts");
  }
  await Contacts.deleteOne({ _id: req.params.id });
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
