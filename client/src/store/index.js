import { configureStore } from '@reduxjs/toolkit'
import taskDataReducer from '../features/task-management/taskdataSlice'
import taskStatusDetailsReducer from '../features/account-settings/taskStatusDetailsSlice'
import societyDataReducer from '../features/account-settings/societyDataSlice'
import formDataReducer from '../features/form-management/formDataSlice'
import formTemplateReducer from '../features/form-management/formTemplateSlice'
import propertiesDataReducer from '../features/form-management/propertiesDataSlice'
import formListReducer from '../features/form-management/formListSlice'

export default configureStore({
  reducer: {
    taskData: taskDataReducer,
    taskStatusDetails: taskStatusDetailsReducer,
    societyData: societyDataReducer
    formTemplate: formTemplateReducer,
    formData: formDataReducer,
    propertiesData: propertiesDataReducer,
    formList: formListReducer
  },
})
