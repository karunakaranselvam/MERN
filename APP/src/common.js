export const getUserData = () => {
    let tokenData = getTokenData();

    if (tokenData) {
        let userData = decryptJWT(tokenData, false);
        return userData.data
    }
}

export const decryptJWT = (token, enc_data) => {
    if (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        // if (enc_data) {
        //     var res = JSON.parse(window.atob(base64));
        //     return res.data
        // }
        // else {
            return JSON.parse(window.atob(base64));
        // }
    } else {
        return false;
    }
}

export const getTokenData = () => {
    if (localStorage.getItem("jwt_token") !== undefined) {
        return localStorage.getItem("jwt_token");
    } else {
        return false;
    }
}

export const num_valid = (e, setFieldValue, field) => {
    const val = e.target.value;
    if (e.target.validity.valid) setFieldValue(field, e.target.value);
    else if (val === '' || val === '-') setFieldValue(field, val);
}

export const isNumberKey = (e) => {
    var result = false; 
    try {
        var charCode = (e.which) ? e.which : e.keyCode;
        if ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105)) {
            result = true;
        }
    }
    catch(err) {
        //console.log(err);
    }
    return result;
}

export const TableDate = (date) => {
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}

export const DatePicker = (date) => {
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
export const addDefaultSrc = (e) => {
    e.target.src = './assets/placeholder.png'
}