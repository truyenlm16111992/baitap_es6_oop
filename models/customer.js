import Person from "./person.js";
class Customer extends Person{
    constructor(_id, _code, _name, _email, _address, _type, _company, _totalBillAmount, _review){
        super(_id, _code, _name, _email, _address, _type);
        this.company=_company;
        this.totalBillAmount=_totalBillAmount;
        this.review=_review;
    }
}
export default Customer;