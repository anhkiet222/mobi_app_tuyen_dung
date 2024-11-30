


const passwordRegex = /^([a-zA-Z0-9]{6,20})$/  // min is 6 and without special char
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/  // format abc@abc
const phoneRegex = /^\d{10}$/   // min 10 number
const handleValidate = (data, type) => {
    var kq = ''
    if (data === '' || data === null)
        return kq = 'Không được để trống'
    switch (type) {
        case "isEmpty": // check empty
            return true
        case "password": // check password
            if (passwordRegex.test(data))
                return true
            kq = 'Mật khẩu không có ký tự đặt biệt và 6 ký tự trở lên và tối đa 20 ký tự'
            return kq
        case "email": // check email
            if (emailRegex.test(data))
                return true
            kq = 'Email sai định dạng'
            return kq
        case "phone": // check phonenumber
            if (phoneRegex.test(data))
                return true
            kq = 'Số điện thoại cần 10 số'
            return kq
        default:
            return 2
    }

}
// return ra true . ok 
// return 2 => type is wrong 

export default handleValidate