import { getAPIInstance } from "../constants/api.js";
import Student from "./student.js";
import Employee from "./employee.js";
import Customer from "./customer.js";
class ListPerson {
    constructor(_list = [], _filter = {}) {
        this.list = _list;
        this.filter = _filter;
    }

    findPerson(code) {
        return this.list.findIndex(e => e.code === code);
    }

    findPersonByAttribute(keySearch) {
        const keys = {
            ...keySearch
        }
        return this.list.filter(e => {
            let flag = false;
            Object.keys(keys).forEach(x => {

                return flag ||= (!keys[x] || e[x] && convertStringSearch(e[x]).indexOf(convertStringSearch(keys[x])) > -1);
            });
            return flag;
        });
    }

    getList(option) {
        const sort = {
            column: "id",
            asc: true,
            ...option
        };
        const { column, asc } = sort;
        return this.findPersonByAttribute(this.filter).sort((a, b) => {
            if (isNaN(a[column]) || isNaN(b[column])) {
                return asc ? a[column].localeCompare(b[column], 'vi', { sensitivity: 'base' }) : b[column].localeCompare(a[column], 'vi', { sensitivity: 'base' });
            } else
                return asc ? a[column] - b[column] : b[column] - a[column];
        });
    }

    async addPerson(obj, option) {
        const callback = {
            before: (config) => config,
            error: (error) => error,
            ...option
        }
        let instance = getAPIInstance();
        instance.interceptors.request.use(callback.before);
        instance.interceptors.response.use(callback.error);
        if (obj.id)
            return await instance.put(`/user/${obj.id}`, obj);
        else
            return await instance.post("/user", obj);
    }

    async deletePerson(id, option) {
        const callback = {
            before: (config) => config,
            error: (error) => error,
            ...option
        }
        let instance = getAPIInstance();
        instance.interceptors.request.use(callback.before);
        instance.interceptors.response.use(callback.error);
        return await instance.delete(`/user/${id}`);
    }
}
const getPersonList = async (option) => {
    const callback = {
        before: (config) => config,
        error: (error) => error,
        ...option
    }
    let instance = getAPIInstance();
    let list = [];
    instance.interceptors.request.use(callback.before);
    instance.interceptors.response.use(callback.error);
    await instance.get("/user").then(response => {
        list = response.data.map(e => {
            const { id, code, name, email, address, type, math, physics, chemistry, numWorkDay, salary, company, totalBillAmount, review } = e;
            switch (type) {
                case "1":
                    return new Student(id, code, name, email, address, type, +math, +physics, +chemistry);
                case "2":
                    return new Employee(id, code, name, email, address, type, +numWorkDay, +salary);
                case "3":
                    return new Customer(id, code, name, email, address, type, company, +totalBillAmount, review);
            }
        });
    });
    return list;
}

const getPersonById = async (id, option) => {
    const callback = {
        before: (config) => config,
        error: (error) => error,
        ...option
    };
    let obj;
    const instance = getAPIInstance();
    instance.interceptors.request.use(callback.before);
    instance.interceptors.response.use(callback.error);
    await instance.get(`/user/${id}`).then((response => {
        const { id, code, name, email, address, type, math, physics, chemistry, numWorkDay, salary, company, totalBillAmount, review } = response.data;
        switch (type) {
            case "1":
                obj = new Student(id, code, name, email, address, type, +math, +physics, +chemistry);
                break;
            case "2":
                obj = new Employee(id, code, name, email, address, type, +numWorkDay, +salary);
                break;
            case "3":
                obj = new Customer(id, code, name, email, address, type, company, +totalBillAmount, review);
                break;
        }
    }));
    return obj;
}

export default ListPerson;
export { getPersonList, getPersonById };
