import Person from "./person.js";
class Employee extends Person {
    constructor(_id, _code, _name, _email, _address, _type, _numWorkDay, _salary) {
        super(_id, _code, _name, _email, _address, _type);
        this.numWorkDay = _numWorkDay;
        this.salary = _salary;
    }
    getTotalSalary() {
        return this.numWorkDay * this.salary;
    }
}
export default Employee;