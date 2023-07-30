import Person from "./person.js";
class Student extends Person {
    constructor(_id, _code, _name, _email, _address, _type, _math, _physics, _chemistry) {
        super(_id, _code, _name, _email, _address, _type);
        this.math = _math;
        this.physics = _physics;
        this.chemistry = _chemistry;
    }
    getScore() {
        return (this.math + this.physics + this.chemistry) / 3;
    }
}
export default Student;