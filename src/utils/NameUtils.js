// Define anonymous name code
const {
  getListRoomsByUserId
} = require('../services/roomService');

/**
 *Get random name code
 @returns {user1: {nick_name, uri}, user2: {nick_name, uri}}
 */
const anonymous_name = ['anteater', 'armadillo', 'axolotl', 'badger', 'bat', 'beaver', 'alligator'];
const random = async (id1, id2) => {
  const roomList1 = await getListRoomsByUserId(id1);
  let id1ExistingName = [];
  if (roomList1) {
    id1ExistingName = getExistingName(id1, roomList1);
  }

  const roomList2 = await getListRoomsByUserId(id2);
  let id2ExistingName = [];
  if (roomList2) {
    id2ExistingName = getExistingName(id2, roomList2);
  }

  let notExistingName1 = anonymous_name.filter((name) => !id1ExistingName.includes(name));

  let notExistingName2 = anonymous_name.filter((name) => !id2ExistingName.includes(name));

  const randomName1 = getRandomNameCodeFromArray(notExistingName1);
  const randomName2 = getRandomNameCodeFromArray(notExistingName2);

  console.log(`TAG: RANDOM NAME UTILS:\tname1: ${randomName1}, name2: ${randomName2}`);

  const uri1 = `kschat://local/resource/anonymousavatar/${randomName1}`;
  const uri2 = `kschat://local/resource/anonymousavatar/${randomName2}`;

  return {
    user1: {
      id: id1,
      nick_name: randomName1,
      uri: uri1,
    },
    user2: {
      id: id2,
      nick_name: randomName2,
      uri: uri2,
    },
  };
};

const getExistingName = (id, roomList) => {
  const existingName = [];
  roomList.forEach((element) => {
    const uid1 = element.user1.id;
    if (uid1 !== id) {
      existingName.push(element.user1.nick_name);
    } else {
      existingName.push(element.user2.nick_name);
    }
  });
  return existingName;
};

const getRandomNameCodeFromArray = (notExistingName) => {
  let randomName = '';
  if (notExistingName.length !== 0) {
    const randomIndex = Math.floor(Math.random() * notExistingName.length);
    randomName = notExistingName[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * anonymous_name.length);
    randomName = anonymous_name[randomIndex];
  }
  return randomName;
};

module.exports = {
  random,
};