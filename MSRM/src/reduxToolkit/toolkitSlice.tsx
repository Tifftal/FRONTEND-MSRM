import { createSlice } from "@reduxjs/toolkit";


const toolkitSlice = createSlice({
    name: "toolkit",
    initialState: {
        count: 0,
        todos: ["test", "test1", "test2"],
        draftID: null,
        countInBag: 0,
    },
    reducers: {
        saveDraftMissionID(state, action) {
            state.draftID = action.payload
        },
    }
})

export default toolkitSlice.reducer

export const { saveDraftMissionID} = toolkitSlice.actions