import {
    GET_EMPLOYEE,
} from "../actions/EmployeeActions";

const initialState = {
    employeeList: [],
};

const EmployeeReducer = function (state = initialState, action) {
    switch (action.type) {
        case GET_EMPLOYEE: {
            return {
                ...state,
                employeeList: [...action.payload]
            };
        }
        default: {
            return state;
        }
    }
};

export default EmployeeReducer;