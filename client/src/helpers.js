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
      
        console.log(req_init.body)
        
        const res = await fetch(api, req_init)
        if (res.ok) {
            const data = await res.json()
            console.log(data)
            if (data.statusCode != successCode) {
                throw new Error((data.error !== undefined) 
                ? `${data.statusCode}: ${data.message} - "${JSON.stringify(data.error.details)}"`
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