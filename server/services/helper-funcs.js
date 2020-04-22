'use strict'
/*
  ------------------ CODE BODY --------------------
*/

/*
  <<<<< EXPORT FUNCTIONS >>>>>
*/

exports.duplicateObject = (orgObj, propList = [], ignoreUndefined = false, prefix = "") => {
  let copyObj = {};

  let keysToCopy = Object.keys(orgObj);

  if (propList.length) {
    keysToCopy = propList;
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