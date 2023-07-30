import ListPerson, { getPersonList, getPersonById } from "../models/listperson.js";
const listPerson = new ListPerson();
let timer;
window.eventErrorValidation = (event) => {
    let target = event.currentTarget;
    clearTimeout(timer);
    timer = setTimeout(() => handleValidation(target), 300);
}
const handleValidation = (obj) => {
    const nameObj = obj.getAttribute("name");
    const errorTarget = obj.dataset.errorTarget;
    const type = getElement("#modalDetail input[name=type]:checked").value;
    let isValid = true;
    switch (nameObj) {
        case "code":
            const isEdit = getElement("#tbId").value ? true : false;
            isValid = checkStringLength(obj.value, 1, 5, errorTarget, "Mã số là số nguyên dương không quá 5 chữ số, không bỏ trống") && checkRegex(obj.value, /^\d+$/, errorTarget, "Mã số là số nguyên dương không quá 5 chữ số") && (!isEdit && listPerson.findPerson(obj.value) > -1 ? false & showMessage(errorTarget, `Mã số '${obj.value}' đã tồn tại.`) : true);
            break;
        case "email":
            isValid = checkStringLength(obj.value, 1, undefined, errorTarget, "Đây là trường bắt buộc không được bỏ trống") && checkEmail(obj.value, errorTarget, "Email không đúng định dạng");
            break;
        case "name":
            isValid = checkStringLength(obj.value, 1, undefined, errorTarget, "Đây là trường bắt buộc không được bỏ trống");
            break;
        case "math":
        case "physics":
        case "chemistry":
            isValid = type !== "1" ? true : checkStringLength(obj.value, 1, undefined, errorTarget, "Đây là trường bắt buộc không được bỏ trống") && checkRangeNumber(obj.value, 0, 10, errorTarget, "Giá trị hợp lệ là một số từ 0 - 10");
            break;
        case "numWorkDay":
        case "salary":
            isValid = type !== "2" ? true : checkStringLength(obj.value, 1, undefined, errorTarget, "Đây là trường bắt buộc không được bỏ trống") && checkRangeNumber(obj.value, 0, undefined, errorTarget, "Giá trị hợp lệ là phải là số dương");
            break;
        case "company":
            isValid = type !== "3" ? true : checkStringLength(obj.value, 1, undefined, errorTarget, "Đây là trường bắt buộc không được bỏ trống");
            break;
        case "totalBillAmount":
            isValid = type !== "3" ? true : checkStringLength(obj.value, 1, undefined, errorTarget, "Đây là trường bắt buộc không được bỏ trống") && checkRangeNumber(obj.value, 0, undefined, errorTarget, "Giá trị hợp lệ là phải là số dương");
            break;
    }
    obj.setCustomValidity(isValid ? "" : "Error");
    return isValid;
}

getElement("#btnNew").onclick = () => {
    // Reset UI 
    getElements("#modalDetail input:not(input[type=radio]), #modalDetail textarea").forEach(e => {
        e.value = "";
        e.setCustomValidity("");
    });
    getElement("#chxStudent").checked = true;
    getElement("#tbCode").toggleAttribute("disabled", false);
}
const renderTable = (list) => {
    let content = list.map(e => {
        return `
        <tr class="bg-white border-b">
            <td class="p-2">
                ${e.code}
            </td>
            <td class="p-2 text-left">
                ${e.name}
            </td>
            <td class="p-2">
                ${e.email}
            </td>
            <td class="p-2  text-left">
                ${e.address}
            </td>
            <td class="p-2">
                ${e.getPersonTypeText()}
            </td>
            <td class="p-2">
            ${e.type === "1" ? e.getScore().toFixed(2) : ""}
            </td>
            <td class="p-2">
                ${e.type === "2" ? formatMoney(e.getTotalSalary()) : ""}
            </td>
            <td class="p-2  text-left">
            ${e.type === "3" ? e.company : ""}
            </td>
            <td class="p-2 space-x-2">
                <button class="font-medium text-blue-600 dark:text-blue-500 hover:underline" onclick="loadPersonDetail(${e.id})"><i class="fa fa-edit"></i></button>
                <button class="font-medium text-blue-600 dark:text-blue-500 hover:underline" onclick="deletePerson(${e.id}, event)"><i class="fa fa-trash-alt"></i></button>
            </td>
        </tr>
        `;
    }).join("");
    if (!list.length)
        content = `
            <tr>
                <td class="p-2 font-medium" colspan="9">Không có dữ liệu</td>
            </tr>
        `;
    getElement("#dtList").innerHTML = content;
}
const editLoadingGridLayout = (isLoading) => {
    getElement("#dtList").classList.toggle("hidden", isLoading);
    getElement("#listLoading").classList.toggle("hidden", !isLoading);
}
const loadData = () => {
    const option = {
        before: (config) => {
            editLoadingGridLayout(true);
            return config;
        }
    }
    getPersonList(option).then(result => {
        listPerson.list = result;
        getElement("#cbPersonType").onchange();
        editLoadingGridLayout(false);
    });
}
loadData();
window.loadPersonDetail = (id) => {
    const editLoadingLayout = (isLoading) => {
        getElements("#detailBody, #detailFooter").forEach(e => e.classList.toggle("hidden", isLoading));
        getElement("#detailLoading").classList.toggle("hidden", !isLoading);
    }
    const option = {
        before: (config) => {
            editLoadingLayout(true);
            return config;
        }
    }
    getPersonById(id, option).then(result => {
        const { id, type } = result;
        getElements("#modalDetail input:not(input[name=type]), #modalDetail textarea").forEach(e => {
            const nameObj = e.getAttribute("name");
            if (result[nameObj])
                e.value = result[nameObj];
        });
        getElement(`#modalDetail input[name=type][value="${type}"]`).checked = true;
        editLoadingLayout(false);
    });
    getElement("#btnNew").click();
    getElement("#tbCode").toggleAttribute("disabled", true);
}

getElement("#btnSave").onclick = () => {
    let isValid = true;
    const type = getElement("#modalDetail input[name=type]:checked").value;
    const obj = { type };
    [...getElements("#modalDetail input:not(input[name=type]), #modalDetail textarea")].filter(e => {
        const personType = e.dataset.personType;
        return !personType || personType === type;
    }).forEach(e => {
        isValid &= handleValidation(e);
        obj[e.name] = e.value;
    });
    if (isValid) {
        editLoadingGridLayout(true);
        listPerson.addPerson(obj).then(() => loadData());
        getElement("#btnClose").click();
    }
}
window.deletePerson = (id, event) => {
    if (confirm("Bạn có chắc rằng muốn xóa?")) {
        const target = event.currentTarget;
        target.toggleAttribute("disabled", true);
        editLoadingGridLayout(true);
        listPerson.deletePerson(id)
            .then(() => {
                loadData();
            })
            .catch(() => {
                target.toggleAttribute("disabled", false);
            });
    }
}
getElement("#cbPersonType").onchange = (event) => {
    listPerson.filter = {
        type: getElement("#cbPersonType").value
    };
    renderTable(listPerson.getList());
}
window.searchBox = (event) => {
    const searchValue = event.currentTarget.value;
    listPerson.filter = {
        name: searchValue,
        email: searchValue,
        address: searchValue,
        company: searchValue
    };
    clearTimeout(timer);
    timer = setTimeout(() => {
        renderTable(listPerson.getList());
    }, 500);
}
window.sortColumn = (column, event) => {
    const target = event.currentTarget;
    const regex = new RegExp("true");
    target.dataset.asc = !regex.test(target.dataset.asc);
    const optionSort = {
        column,
        asc: regex.test(target.dataset.asc)
    };
    renderTable(listPerson.getList(optionSort));
}