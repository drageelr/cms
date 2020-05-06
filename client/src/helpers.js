/**
API Caller helper to refactor common API code that requires bearer tokens (all http requests have POST method)

@param {string} api API URL
@param {object} body body needed for the API call (pass as empty object if not needed)
@param {number} successCode success status code e.g. 200
@param {function} dataReturner data returning function, processes data to return it in a specific format
@param {function} rejectWithValue  rejectWithValue function for that specific async thunk that calls it
*/

export async function apiCaller(api, body, successCode, dataReturner, rejectWithValue) {
  try {
    let req_init = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.token}`, 
      },
    }
    // if body is an empty object, do not include it
    if (!(Object.keys(body).length === 0 && body.constructor === Object)){
      req_init['body'] = JSON.stringify(body)
    }
    
    const res = await fetch(api, req_init)
    if (res.ok) {
      const data = await res.json()
      console.log("api", data)
      if (data.statusCode != successCode) {
        throw new Error((data.error !== undefined) 
        ? `${data.statusCode}: ${data.message} - ${JSON.stringify(data.error.details).replace(/[\[\]\{\}"'\\]+/g, '').split(':').pop()}`
        : `${data.statusCode}: ${data.message}`) 
      }
      return dataReturner(data)
    }
    throw new Error(`${res.status}, ${res.statusText}`) 
  }
  catch (err) {
    return rejectWithValue(err.toString())
  }
}

export function simplifyTimestamp(ts, dateOnly=true) {
  const monthAbbrev = {"01":"Jan", "02":"Feb", "03":"Mar", "04":"Apr", "05":"May", "06":"Jun", "07":"Jul", "08":"Aug",
  "09":"Sep", "10":"Oct", "11":"Nov", "12":"Dec"}
  const dateTime = ts.split('T')
  const YYMMDD = dateTime[0].split('-')
  const HHMMSS = dateTime[1].split(':')
  
  const dateOnlyString = `${YYMMDD[2]} ${monthAbbrev[YYMMDD[1]]} ${YYMMDD[0]}`
  return dateOnly ? dateOnlyString : `${HHMMSS[0]}:${HHMMSS[1]} - ${dateOnlyString}`
} 