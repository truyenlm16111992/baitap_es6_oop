const getElements = (selector) => document.querySelectorAll(selector);
const getElement = (selector) => document.querySelector(selector);
const formatMoney = (money) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(money);
const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
const convertStringSearch = (str) => {
    return removeAccents(str.toLowerCase());
}
const showMessage = (_selector, _msgError) => {
    let domMsg = getElement(_selector);
    domMsg.innerHTML = _msgError;
    return 1;
}
const checkRegex = (_string, _regex, _selector, _msgError) => {
    if (!_regex.test(_string)) {
        showMessage(_selector, _msgError);
        return 0;
    }
    showMessage(_selector, "");
    return 1;
}
const checkRangeNumber = (_number, _min, _max, _selector, _msgError) => {
    if (Number.isNaN(_number) || _number < Number(_min) || _number > Number(_max)) {
        showMessage(_selector, _msgError);
        return 0;
    }
    showMessage(_selector, "");
    return 1;
}
const checkEmail = (_string, _selector, _msgError) => {
    regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return checkRegex(_string, regex, _selector, _msgError);
}
const checkStringLength = (_string, _min, _max, _selector, _msgError) => {
    let len = _string.trim().length;
    if (len < _min || len > Number(_max)) {
        showMessage(_selector, _msgError);
        return 0;
    }
    showMessage(_selector, "");
    return 1;
}