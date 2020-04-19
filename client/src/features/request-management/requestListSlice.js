import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    forms: {
        'form-1': {
            id: 1, 
            formId:'temp-1', 
            userId:'soc-1', 
            formStatus:'Pending', // CAN BE CHANGED
            ccaNotes: [ 'CCANote1', 'CCANote2' ], // CANBE UPDATED
            ccaNoteTimestamp: '25/01/2020',
            ccaNotes: [ 'SocietyNote1', 'SocietyNote2' ],
            societyNoteTimestamp: '',
            itemsData: [
                {itemId: 0, gender:'Male'},
                {itemId: 1, alcoholic:'No'}
            ]
        },
        'form-2': {
            id: 2, 
            formId:'temp-2', 
            userId:'soc-2', 
            formStatus:'Approved', // CAN BE CHANGED
            ccaNotes: [ 'CCANote1'], // CANBE UPDATED
            ccaNoteTimestamp: '01/02/2019',
            ccaNotes: [ 'SocietyNote1' ],
            societyNoteTimestamp: '',
            itemsData: [
                {itemId: 0, gender:'Female'},
                {itemId: 1, alcoholic:'Yes'}
            ]
        },
    },
    formsOrder: ['form-1', 'form-2' ]
}

const requestListData = createSlice ({
    name:'requestListData',
    initialState: initialState,
    reducers: {
        changeFormStatus: (state, action) => { //i will recieve the formId and then corresponding to that I will update the form status 
            let {formTempId, formStatus} =action.payload
            formTempId = `form-${formTempId}`
            // console.log(state.forms[formTempId].formStatus)
            state.forms[formTempId].formStatus = formStatus
            // console.log(state.forms[formTempId].formStatus)
        },

        updateCCANotes: (state, action) => {
            const { formId, newNote } = action.payload
            state.forms[formId].ccaNotes.push(newNote)
        }
    }
})

export const { changeFormStatus, updateCCANotes } = requestListData.actions

export default requestListData.reducer