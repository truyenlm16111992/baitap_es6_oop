import { getAPIInstance } from "../constants/api.js";
import Student from "./student.js";
import Employee from "./employee.js";
import Customer from "./customer.js";
class ListPerson {
    constructor(_list = []) {
        this.list = _list;
    }

    findPerson(code) {
        this.list.findIndex(e => e.code === code);
    }

    findPersonByAttribute(keySearch) {
        const keys = {
            "type": "",
            ...keySearch
        }
        return this.list.filter(e => {
            let flag = true;
            Object.keys(keys).forEach(x => flag &&= (!keys[x] || convertStringSearch(e[x]).indexOf(convertStringSearch(keys[x])) > -1));
            return flag;
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
