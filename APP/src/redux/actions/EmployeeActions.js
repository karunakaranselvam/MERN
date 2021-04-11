import axios from "axios";
import * as common from "../../common";

export const GET_EMPLOYEE = "GET_EMPLOYEE";

export const getEmployee = () => dispatch => {
    axios
        .get("http://localhost:5000/employee")
        .then(res => {
            var data = common.decryptJWT(res.data.token, true)
            dispatch({
                type: GET_EMPLOYEE,
                payload: data.employee
            });
        })
        .catch((e) => {
            console.log(e.message);
        });
};