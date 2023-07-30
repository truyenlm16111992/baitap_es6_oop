class Person {
    constructor(_id, _code, _name, _email, _address, _type) {
        this.id = _id;
        this.code = _code;
        this.name = _name;
        this.email = _email;
        this.address = _address;
        this.type = _type;
    }
    getPersonTypeText() {
        switch(this.type){
            case "1":
                return "Sinh viên";
            case "2":
                return "Giảng viên";
            case "3":
                return "Khách hàng";
            default:
                return "";
        }
    }
}
export default Person;