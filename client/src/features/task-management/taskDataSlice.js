import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiCaller } from '../../helpers'

/**
  A temporary initial state has been created to test with the components and render meaningful
  on the screen. The action creators in the reducer are responsible for implementing the changes 
  that the user makes when editing the task.
*/

const sampleCheckList = [
  {
    checklistId: 1,
    description: "Finish Me",
    sectionIndex: "",
  },
  {
    checklistId: 2,
    description: "Hello World",
    sectionIndex: "",
  },
  {
    checklistId: 3,
    description: "What scene",
    sectionIndex: "",
  }
]

const sampleState = {
  archiveList: [],

  taskList : [ // fetch Task Manager
    {
      taskId: 'r1',
      title: "Fix TM",
      description: "",
      submissionId: -1,
      ownerId: 1,
      statusId: 1,
      subTasks: [
        {
          taskId: "s1",
          assTaskId: 'r1', //associated taskId (task to which this subtask is associated with)
          ownerId: 2,
          assigneeId: 2,
          description: "hello world",
          check: true
        }
      ],
      logs: [
        {
          logId: 1,
          creatorId: 1,
          description: "hello",
          createdAt: "2020/01/10",
          updatedAt: "2020/02/19"
        }
      ],
      archive: false,
      createdAt: "",
      updatedAt: ""
    },
    {
      taskId: 'c1',
      title: "Code",
      description: "",
      ownerId: 2,
      statusId: 2,
      logs: [],
      archive: false,
      createdAt: "",
      updatedAt: ""
    }
  ],

  isPending: false,
  error: null,
}

const initialState = {
  archiveList: [],
  checkList: [],
  taskList: [],
  subTaskIds: [],
  isPending: false,
  error: null
}

export const fetchTaskManager = createAsyncThunk(
  'taskData/fetchTaskManager',
  async (_, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 

    // const data = {
    //   taskList: sampleState.taskList
    // }

    // return data

    return await apiCaller('/api/task-manager/fetch', {}, 200, 
    (data) =>(data), 
    rejectWithValue)  
  }
)

export const fetchTask = createAsyncThunk(
  'taskData/fetchTask',
  async (archiveObj, { getState, rejectWithValue }) => {
    const {taskId, ownerId} = archiveObj

    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 

    return await apiCaller('/api/task-manager/task/fetch', { taskId }, 200, 
    (data) => ({data, archiveObj}), 
    rejectWithValue)  
  }
)

export const fetchCheckList = createAsyncThunk(
  'taskData/fetchCheckList',
  async (IdObj, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 
    
    const data = sampleCheckList

    return {IdObj, data}

    return await apiCaller('/api/submission/fetch-list', {}, 200, 
    (data) => {
      
    }, rejectWithValue)    
  }
)

export const fetchArchiveList = createAsyncThunk(
  'taskData/fetchArchiveList',
  async (_, { getState, rejectWithValue }) => {
    const { isPending } = getState().taskData
    if (isPending != true) {
      return
    } 
    return sampleState.archiveList

    //TBD
    return await apiCaller('/api/task-manager/fetch-archive', {}, 200, 
    (data) => {
      
    }, rejectWithValue)  
    //{taskList: [taskDetailsObj]}
    //{taskId: "String", ownerId: Number, createdAt: Date, updatedAt: Date}
  }
)

export const createRequestTask = createAsyncThunk( // GIVES INTERNAL SERVER ERROR
  'taskData/createRequestTask',
  async (reqTaskObject, { rejectWithValue }) => {
    const { title, description, submissionId, ownerId, statusId } = reqTaskObject

    return await apiCaller('/api/task-manager/task/req/create', {
      task: {
        title: title,
        description: "description",
        submissionId: 1,
        ownerId: 1,
        statusId: 1
      }
    }, 201, 
    (data) => ({data, reqTaskObject}), 
    rejectWithValue)  
  }
)

export const createCustomTask = createAsyncThunk(
  'taskData/createCustomTask',
  async (cusTaskObject, { rejectWithValue }) => {
    const { title, description, ownerId, statusId } = cusTaskObject

    return await apiCaller('/api/task-manager/task/cus/create', {
      task: {
        title: title,
        description: description,
        ownerId: ownerId,
        statusId: statusId
      }
    }, 201, 
    (data) => ({data, cusTaskObject}), 
    rejectWithValue)
  }
)

export const createNewLog = createAsyncThunk(
  'taskData/createNewLog',
  async (logObj, { rejectWithValue }) => {
    const { taskId, creatorId, logText } = logObj
  
    return await apiCaller('/api/task-manager/log/add', {
      taskId: taskId,
      description: logText
    }, 201, 
    (data) => ({data, logObj}), 
    rejectWithValue)  
  }
)

export const moveTask = createAsyncThunk(
  'taskData/moveTask',
  async (editTaskObject, { getState, rejectWithValue }) => {
    const { taskId, srcColumnId, dstColumnId } = editTaskObject

    if (taskId[0] === 'r') {
      return await apiCaller('/api/task-manager/task/req/edit', {
        task: {
          taskId: taskId,
          ownerId: dstColumnId
        }
      }, 200, 
      (data) => ({data, editTaskObject}), 
      rejectWithValue)
    } else if (taskId[0] === 'c') {
      return await apiCaller('/api/task-manager/task/cus/edit', {
        task: {
          taskId: taskId,
          ownerId: dstColumnId
        }
      }, 200, 
      (data) => ({data, editTaskObject}), 
      rejectWithValue)
    }
    //else { //if subtask then don't do anything here but in the edit request task API
    // }
  }
)

export const moveSubTask = createAsyncThunk(
  'taskData/moveTask',
  async (subTaskObject, { getState, rejectWithValue }) => {
    const { mainTaskId, subTaskList } = subTaskObject

    return await apiCaller('/api/task-manager/task/req/edit', {
      task: {
        taskId: mainTaskId,
        subTasks: subTaskList
      }
    }, 200, 
    (data) => ({data, mainTaskId}), 
    rejectWithValue)
  }
)

export const taskOwnerChange = createAsyncThunk(
  'taskData/taskOwnerChange',
  async (ownerChangeObj, { rejectWithValue }) => {
    const { taskId, owner } = ownerChangeObj
    
    if (taskId[0] === 'r') {
      return await apiCaller('/api/task-manager/task/req/edit', {
        task: {
          taskId: taskId,
          ownerId: owner
        }
      }, 200, 
      (data) => ({data, ownerChangeObj}), 
      rejectWithValue)
    } else if (taskId[0] === 'c') {
      return await apiCaller('/api/task-manager/task/cus/edit', {
        task: {
          taskId: taskId,
          ownerId: owner
        }
      }, 200, 
      (data) => ({data, ownerChangeObj}), 
      rejectWithValue)
    }
  }
)

export const updateTitle = createAsyncThunk(
  'taskData/updateTitle',
  async (titleObj, { rejectWithValue }) => {
    const { taskId, taskTitle } = titleObj

    if (taskId[0] === 'r') {
      return await apiCaller('/api/task-manager/task/req/edit', {
        task: {
          taskId: taskId,
          title: taskTitle
        }
      }, 200, 
      (data) => ({data, titleObj}), 
      rejectWithValue)
    } else if (taskId[0] === 'c') {
      return await apiCaller('/api/task-manager/task/cus/edit', {
        task: {
          taskId: taskId,
          title: taskTitle
        }
      }, 200, 
      (data) => ({data, titleObj}), 
      rejectWithValue)
    }
  }
)

export const updateDescription = createAsyncThunk(
  'taskData/updateDescription',
  async (descObj, { rejectWithValue }) => {
    const { taskId, text } = descObj
    
    if (taskId[0] === 'r') {
      return await apiCaller('/api/task-manager/task/req/edit', {
        task: {
          taskId: taskId,
          description: text
        }
      }, 200, 
      (data) => ({data, descObj}), 
      rejectWithValue)
    } else if (taskId[0] === 'c') {
      return await apiCaller('/api/task-manager/task/cus/edit', {
        task: {
          taskId: taskId,
          description: text
        }
      }, 200, 
      (data) => ({data, descObj}), 
      rejectWithValue)
    }
  }
)

export const changeTaskStatus = createAsyncThunk(
  'taskData/changeTaskStatus',
  async (statusObj, { rejectWithValue }) => {
    const { taskId, statusId } = statusObj
    
    if (taskId[0] === 'r') {
      return await apiCaller('/api/task-manager/task/req/edit', {
        task: {
          taskId: taskId,
          statusId: statusId
        }
      }, 200, 
      (data) => ({data, statusObj}), 
      rejectWithValue)
    } else if (taskId[0] === 'c') {
      return await apiCaller('/api/task-manager/task/cus/edit', {
        task: {
          taskId: taskId,
          statusId: statusId
        }
      }, 200, 
      (data) => ({data, statusObj}), 
      rejectWithValue)
    }    
  }
)

export const linkFormToTask = createAsyncThunk( // only for request task
  'taskData/linkFormToTask',
  // if submission passed to the edit request task API, then get response main subTaskIds and store them
  async (submissionObj, { rejectWithValue }) => {
    const { taskId, submissionId } = submissionObj
    
    const data = {
      newLogs: [],
      subTaskIds: [1,2,3,4]
    }
    
    // call the "/api/task-manager/task/req/edit" API
    // send the taskId and the submissionId to backend in either case
    // data = {
    // newLogs: [],
    // }

    return {data, submissionObj}

    //{task*: editReqTaskObj}
    //{task*: editCusTaskObj}
    /*
    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, 
    subtasks**: [subtaskObj]}, archive**: Boolean}
    subtaskObj == {subtaskId*: Number, assigneeId**: Number, description**: "String", check**: Boolean}

    {taskId: "String", title**: "String", description**: "String", ownerId**: Number, statusId**: Number, archive**: Boolean}
    */
    return await apiCaller('/api/task-manager/task/req/edit', {}, 200, 
    (data) => {
      
    }, rejectWithValue)  
    
    //{newLog: logObj, subTaskIds**: [Number]}
    //{newLog: logObj}
    //{logId: Number, creatorId: Number, description: "String", createdAt: Date, updatedAt: Date}
  }
)

const taskdata = createSlice({
  name: 'taskData',
  initialState: initialState,
  reducers: {
    archiveTask: (state, action) => { // send the task id to the server and create an archive of it
      const {taskId, ownerId} = action.payload

      state.columns[ownerId].taskIds.map(id => {
        if (taskId === id) {
          var filteredAry = state.columns[ownerId].taskIds.filter(function(e) { return e != id })
          const obj = state.tasks[taskId]
          state.archiveList.push(obj)
          state.columns[ownerId].taskIds = filteredAry
        } 
      })
    },

    unArchiveTask: (state, action) => { // on getting the archive tasks from server,
      // also get the taskOwner id with it so then adding task back to column is simple, for now hard-coding the column
      const {taskId,ownerId} = action.payload 

      state.columns[ownerId].taskIds.push(taskId) // put the task back in owners list
      state.archiveList.map(id => {
        var filteredAry = state.archiveList.filter(function(e) { return e.id != taskId })
        state.archiveList = filteredAry
      })
    },

    addTaskAssignees: (state, action) => {
      const {taskId, value} = action.payload
      
      state.tasks[taskId].assigneeList.push(value)
    },
    
    deleteTaskAssignee: (state, action) => {
      const {taskId, person} = action.payload
      
      state.tasks[taskId].assigneeList.map(name =>{
        if(name === person) {
          var filteredAry = state.tasks[taskId].assigneeList.filter(function(e) { return e !== name })
          state.tasks[taskId].assigneeList = filteredAry
        }
      })
    },

    subTaskDisplay: (state, action) => {
      const {taskId} = action.payload

      state.taskList.map(subtaskObj => {
        if (subtaskObj.taskId === taskId) { // get the subtask Obj from the task list
          state.taskList.map(taskObj => {
            if (taskObj.taskId === subtaskObj.assTaskId) { // get the task obj from task list to which the sub task is associated
              taskObj.subTasks.map(assSubTask => {
                if (assSubTask.taskId === taskId) { // get the subtask from the task that is same as the current subtask
                  assSubTask.check = false
                  subtaskObj.check = false
                }
              })
            }
          })
        }
      })
    },

    editSubTask: (state, action) => {
      const {taskId, srcColumnId, dstColumnId} = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId === taskId) { // get the subtask in the taskList
          state.taskList.map(assTaskObj => {
            if(assTaskObj.taskId === taskObj.assTaskId) { // get the task whose subtask is this subtask
              assTaskObj.subTasks.map(assSubTask => {
                if (assSubTask.taskId === taskId) {
                  assSubTask.ownerId = dstColumnId
                  assSubTask.assigneeId = dstColumnId
                  taskObj.ownerId = dstColumnId
                }
              })
            }
          })
        }
      })
    }
  },

  extraReducers: {
    [fetchTaskManager.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchTaskManager.fulfilled]: (state, action) => {
      state.taskList = action.payload.taskList
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId[0] === 'r' && taskObj.subTasks.length !== 0) {
          taskObj.subTasks.map(subObj => {
            state.taskList.push(subObj)
          })
        }
      })
    },
    [fetchTaskManager.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [fetchCheckList.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchCheckList.fulfilled]: (state, action) => {
      const {IdObj, data} = action.payload
      state.checkList = data

      let subTaskObj = {}
      
      state.checkList.map(checkObj => {
        var subTaskId = state.subTaskIds.splice(0, 1) // get the every first id in the array
        var subTaskDesc = checkObj.description
        state.taskList.map(taskObj => {
          if (taskObj.taskId === IdObj.taskId) {
            subTaskObj = {
              taskId: `s${subTaskId}`,
              subtaskId: subTaskId,
              assTaskId: IdObj.taskId, //associated taskId (task to which this subtask is associated with)
              ownerId: taskObj.ownerId,
              assigneeId: taskObj.ownerId,
              description: subTaskDesc,
              check: true
            }
            taskObj.subTasks.push(subTaskObj)
          }
        })
        state.taskList.push(subTaskObj)
      })
    },
    [fetchCheckList.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [fetchArchiveList.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchArchiveList.fulfilled]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.archiveList = action.payload
      }
    },
    [fetchArchiveList.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [fetchTask.pending]: (state, action) => {
      if (state.isPending === false) {
        state.isPending = true
      }
    },
    [fetchTask.fulfilled]: (state, action) => { // works for unarchive too as it fetches and pushes the task obj to the list
      const {data, archiveObj} = action.payload

      console.log(data)
      //state.taskList.push(task)   
      
      // state.archiveList.map(obj => {
      //   var filteredAry = state.archiveList.filter(function(e) { return e.obj.taskId !== archiveObj.taskId })
      //   state.archiveList = filteredAry
      // })
    },
    [fetchTask.rejected]: (state, action) => {
      if (state.isPending === true) {
        state.isPending = false
        state.error = action.payload
      }
    },

    [createRequestTask.fulfilled]: (state, action) => {
      console.log(action.payload)
      state.taskList.push({
        taskId: action.payload.data.taskId,
        logs: action.payload.data.logs,
        subTasks: action.payload.data.subTaskIds,
        ...action.payload.reqTaskObject
      })
      state.error = 'Request Task Created'
    },
    [createRequestTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [createCustomTask.fulfilled]: (state, action) => {
      console.log("here")
      state.taskList.push({
        taskId: action.payload.data.taskId,
        logs: action.payload.data.logs,
        ...action.payload.cusTaskObject
      })
      state.error = 'Custom Task Created'
    },
    [createCustomTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [createNewLog.fulfilled]: (state, action) => {
      const { data, logObj } = action.payload
      
      state.taskList.map(taskObj => {
        if(taskObj.taskId === logObj.taskId) {
          taskObj.logs.push({
            logId: data.logId,
            creatorId: logObj.creatorId,
            description: logObj.logText,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          })
        }
      })
    },
    [createNewLog.rejected]: (state, action) => {
      state.error = action.payload
    },

    [moveTask.fulfilled]: (state, action) => {
      const { data, editTaskObject } = action.payload
      
      // if (editTaskObject.taskId[0] === 's') {
      //   state.taskList.map(taskObj => {
      //     if (taskObj.taskId === editTaskObject.taskId) {
      //       state.taskList.map(assTaskObj => {
      //         if(assTaskObj.taskId === taskObj.assTaskId) {
      //           assTaskObj.subTasks.map(assSubTask => {
      //             if (assSubTask.taskId === editTaskObject.taskId) {
      //               assSubTask.ownerId = editTaskObject.dstColumnId
      //               assSubTask.assigneeId = editTaskObject.dstColumnId
      //               taskObj.ownerId = editTaskObject.dstColumnId
      //             }
      //           })
      //         }
      //       })
      //     }
      //   })
      // } else {
        state.taskList.map(taskObj => {
          if(taskObj.taskId === editTaskObject.taskId) {
            taskObj.ownerId = editTaskObject.dstColumnId
            taskObj.logs.push(data.newLog)
          }
        })
      //}
    },
    [moveTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [moveSubTask.fulfilled]: (state, action) => {
      const { data, mainTaskId } = action.payload
      
      state.taskList.map(taskObj => {
        if(taskObj.taskId === mainTaskId) {
          taskObj.logs.push(data.newLog)
        }
      })
    },
    [moveSubTask.rejected]: (state, action) => {
      state.error = action.payload
    },

    [taskOwnerChange.fulfilled]: (state, action) => {
      const {data, ownerChangeObj} = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId === ownerChangeObj.taskId) {
          taskObj.ownerId = ownerChangeObj.owner
          taskObj.logs.push(data.newLog)
        }
      })
    },
    [taskOwnerChange.rejected]: (state, action) => {
      state.error = action.payload
    },

    [updateTitle.fulfilled]: (state, action) => {
      const {data, titleObj} = action.payload
      
      state.taskList.map(taskObj => {
        if (taskObj.taskId === titleObj.taskId) {
          taskObj.title = titleObj.taskTitle
          taskObj.logs.push(data.newLog)
        }
      })
    },
    [updateTitle.rejected]: (state, action) => {
      state.error = action.payload
    },

    [updateDescription.fulfilled]: (state, action) => {
      const {data, descObj} = action.payload

      state.taskList.map(taskObj => {
        if (taskObj.taskId === descObj.taskId) {
          taskObj.description = descObj.text
          taskObj.logs.push(data.newLog)
        }
      })
    },
    [updateDescription.rejected]: (state, action) => {
      state.error = action.payload
    },

    [changeTaskStatus.fulfilled]: (state, action) => {
      const {data, statusObj} = action.payload

      state.taskList.map(taskObj => {
        if(taskObj.taskId === statusObj.taskId) {
          taskObj.statusId = statusObj.statusId
          taskObj.logs.push(data.newLog)
        }
      })
    },
    [changeTaskStatus.rejected]: (state, action) => {
      state.error = action.payload
    },

    [linkFormToTask.fulfilled]: (state, action) => {
      const {data, submissionObj} = action.payload

      state.taskList.map(taskObj => {
        if (taskObj.taskId === submissionObj.taskId) {
          taskObj.submissionId = submissionObj.submissionId
          taskObj.logs.push(data.newLog)
          state.subTaskIds = data.subTaskIds
        }
      })
      console.log(state.subTaskIds)
    },
    [linkFormToTask.rejected]: (state, action) => {
      state.error = action.payload
    },
  }
})

export const {
  archiveTask, 
  unArchiveTask,
  addTaskAssignees,
  deleteTaskAssignee,
  subTaskDisplay, 
  editSubTask
} = taskdata.actions

export default taskdata.reducer