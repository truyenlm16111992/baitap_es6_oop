// document.getElementById("username-error").setCustomValidity("Invalid field.");
// document.getElementById("username-error").setCustomValidity("");
let timer;
window.eventErrorValidation = (event) => {
    let target = event.currentTarget;
    clearTimeout(timer);
    timer = setTimeout(()=>handleValidation(target),300);
}
const handleValidation = (obj) => {
    const nameObj = obj.getAttribute("name");
    const errorTarget = obj.dataset.errorTarget;
    let isValid = true;
    switch (nameObj) {
        case "code":
            isValid = checkStringLength(obj.value, 1, 5, errorTarget, "Mã số là số nguyên dương không quá 5 chữ số, không bỏ trống") && checkRegex(obj.value, /^\d+$/, errorTarget, "Mã số là số nguyên dương không quá 5 chữ số");// && (!getElement('#btnCapNhat').dataset.id && phones.checkExistID(obj.value) > -1 ? false & showMessage(idErrorMsg, `ID sản phẩm '${obj.value}' đã tồn tại.`) : showMessage(idErrorMsg, ""));
            break;
        // case "price":
        //     isValid = checkStringLength(obj.value, 1, undefined, idErrorMsg, "Đây là trường bắt buộc không được bỏ trống") && checkRegex(obj.value, /^\d+$/, idErrorMsg, "Giá sản phẩm là một số nguyên dương");
        //     break;
        // case "image":
        //     isValid = checkStringLength(obj.value, 1, undefined, idErrorMsg, "Đây là trường bắt buộc không được bỏ trống") && checkRegex(obj.value, /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&=]*)/g, idErrorMsg, "Link ảnh sản phẩm không hợp lệ");
        //     break;
        // case "brand":
        // case "name":
        // case "image":
        //     isValid = checkStringLength(obj.value, 1, undefined, idErrorMsg, "Đây là trường bắt buộc không được bỏ trống");
        //     break;
    }
    obj.setCustomValidity(isValid?"":"Error");
    return isValid;
}