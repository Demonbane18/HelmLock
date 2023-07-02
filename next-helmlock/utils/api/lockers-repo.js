import Locker from '../../models/Locker';

export const lockersRepo = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await Locker.find();
}

async function getById(id) {
  return await Locker.findById(id);
}

async function create(params) {
  // validate
  if (await Locker.findOne({ name: params.name })) {
    throw 'Locker name "' + params.name + '" is already taken';
  }

  const locker = new Locker(params);

  // save locker
  await locker.save();
}

async function update(id, params) {
  const locker = await Locker.findById(id);

  // validate
  if (!locker) throw 'Locker not found';
  if (
    locker.name !== params.name &&
    (await Locker.findOne({ name: params.name }))
  ) {
    throw 'Lockername "' + params.name + '" is already taken';
  }

  // copy params properties to locker
  Object.assign(locker, params);

  await locker.save();
}

async function _delete(id) {
  await Locker.findByIdAndRemove(id);
}
