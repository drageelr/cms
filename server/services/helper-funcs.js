'use strict'
/*
  ------------------ CODE BODY --------------------
*/

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

exports.duplicateObject = (orgObj, propList = [], ignoreUndefined = false, prefix = "", ignoreList = []) => {
  let copyObj = {};

  let keysToCopy = Object.keys(orgObj);

  if (propList.length) {
    keysToCopy = propList;
  }

  if (ignoreList.length) {
    for (let k of ignoreList) {
      let index = keysToCopy.indexOf(k);
      keysToCopy.splice(index, 1);
    }
  }

  if (!ignoreUndefined) {
    for (let k of keysToCopy) {
      copyObj[prefix + k] = orgObj[k];
    }
  } else {
    for (let k of keysToCopy) {
      if (orgObj[k] !== undefined) {
        copyObj[prefix + k] = orgObj[k];
      }
    }
  }
  
  return copyObj;
}

exports.createArrFromObjArr = (objArr, propName) => {
  let propArr = [];

  if (typeof propName !== "object") {
    for (let o of objArr) {
      if (o[propName] !== undefined) {
        propArr.push(o[propName]);
      }
    }
  } else {
    for (let o of objArr) {
      let tempObj = {};
      for (let p of propName)
      {
        if (o[p] !== undefined) {
          tempObj[p] = o[p];
        }
      }
      propArr.push(tempObj);
    }
  }
  
  return propArr;
}

exports.createObjFromObjArr = (objArr, keyProp, keyValue, ignoreUndefined = false) => {
  let miniObj = {};

  if (typeof keyValue !== "object") {
    for (let o of objArr) {
      miniObj[o[keyProp]] = o[keyValue];
    }
  } else {
    for (let o of objArr) {
      miniObj[o[keyProp]] = {};
      for (let kv of keyValue) {
        if (!ignoreUndefined || (ignoreUndefined && o[kv] !== undefined)) {
          miniObj[o[keyProp]][kv] = o[kv];
        }
      }
    }
  }
  

  return miniObj;
}

exports.compareLists = (list1, list2) => {
  let count = 0;
  for (let i of list1) {
    let inList = false;
    for (let j of list2) {
      if (i == j) {
        console.log("i: ", i);
        console.log("j: ", j);
        inList = true;
        break;
      }
    }
    if (inList) {
      console.log("inc!");
      count++;
    }
  }

  console.log(count);
  console.log(list2.length);
  return (count == list2.length) && (count == list1.length);
}