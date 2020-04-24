import { configureStore } from '@reduxjs/toolkit'
import taskDataReducer from '../features/task-management/taskDataSlice'
import requestListReducer from '../features/request-management/requestListSlice'
import taskStatusDetailsReducer from '../features/account-settings/taskStatusDetailsSlice'
import societyDataReducer from '../features/account-settings/societyDataSlice'
import formDataReducer from '../features/form-management/formDataSlice'
import formTemplateReducer from '../features/form-management/formTemplateSlice'
import propertiesDataReducer from '../features/form-management/propertiesDataSlice'
import formListReducer from '../features/form-management/formListSlice'

import ccaDetailsReducer from '../features/account-settings/ccaDetailsSlice'

export default configureStore({
  reducer: {
    taskData: taskDataReducer,
    requestListData: requestListReducer,
    taskStatusDetails: taskStatusDetailsReducer,
    societyData: societyDataReducer,
    ccaDetails:ccaDetailsReducer,
    formTemplate: formTemplateReducer,
    formData: formDataReducer,
    propertiesData: propertiesDataReducer,
    formList: formListReducer
  },
})
