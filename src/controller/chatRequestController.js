const requestingUser = [];

function matchRequest() {
  console.log(`matching request ${requestingUser.length}`);
  const result = [];
  if (requestingUser.length < 2) {
    console.log(`not enough requests`);
    return null;
  }

  const randomIndex1 = Math.floor(Math.random() * requestingUser.length);
  let randomIndex2 = randomIndex1;
  while (randomIndex1 === randomIndex2) {
    randomIndex2 = Math.floor(Math.random() * requestingUser.length);
  }

  result.push(requestingUser[randomIndex1]);
  result.push(requestingUser[randomIndex2]);

  requestingUser.splice(randomIndex1, 1);
  requestingUser.splice(randomIndex2, 1);

  return result;
}

function onChange(element) {
  console.log(`pusing:`);
  console.log(element);
  const result = matchRequest();

  if (result) {
    const uidArray = [];
    uidArray.push(result[0].uid);
    uidArray.push(result[1].uid);
    result.forEach((e) => {
      e.callback(uidArray);
    });
  }
}

function myPushFunction(array, element) {
  array.push(element);
  onChange(element);
}
function checkContainUid(uid) {
  let flag = false;
  requestingUser.forEach((e) => {
    if (e.uid === uid) {
      flag = true;
    }
  });
  return flag;
}

function addNewRequest(uid, callback) {
  const user = {
    uid: uid,
    callback: callback,
  };

  if (!checkContainUid(uid)) {
    console.log('adding new request');
    myPushFunction(requestingUser, user);
  } else {
    console.log('duplicated request');
  }
}

function cancelRequest(uid) {
  requestingUser.some((e, i) => {
    if (e.uid === uid) {
      console.log(`removing request ${e.uid}`);
      requestingUser.splice(i, 1);
      return true;
    }
    return false;
  });
}

module.exports = {
  addNewRequest,
  matchRequest,
  cancelRequest,
};
