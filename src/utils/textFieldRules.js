export default {
    data() {
        return {
            rules: {
                required: value => !!value || "Required.",
                min: value =>
                    (value != null && value.length >= 8) ||
                    "Please use at least 8 characters.",
                password: value =>
                    this.password.new == value || "Passwords don't match.",
                otp: value =>
                    (value != null && value.length == 6) ||
                    "Please enter 6-digit code.",
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return pattern.test(value) || "Invalid e-mail.";
                },
                url: value => {
                    const pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.%]+$/gm;
                    return pattern.test(value) || "Invalid url.";
                },
                ip: value => {
                    const pattern = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
                    return pattern.test(value) || "Invalid IP.";
                },
                mask: value => {
                    const pattern = /^(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(?:\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}\/(3[0-2]|2[0-9]|1[0-9]|[1-9])$/;
                    return pattern.test(value) || "Invalid IP/Mask.";
                },
                minutes: value => {
                    if (60 >= value && value >= 1) {
                        return true
                    }
                    return "1~60";
                },
                hours: value => {
                    if (24 >= value && value >= 1) {
                        return true
                    }
                    return "1~24";
                },
                days: value => {
                    if (30 >= value && value >= 1) {
                        return true
                    }
                    return "1~30";
                },
                number: value => {
                    const pattern = /^[0-9\s]*$/;
                    return pattern.test(value) || "Must be a number.";
                },
                length: value => {
                    const pattern = /^.{4}$/;
                    return pattern.test(value) || "Length must be 4.";
                },
                customerType: value => {
                    const pattern = /^([1-5]*)$/;
                    return pattern.test(value) || "Invalid customer type.";
                },
                emailCountLimit: value =>{
                    if (value ==null || value.length <= 20) {
                        return true
                    }
                    return "The number of emails cannot exceed 20.";
                },
                emailList: value => {
                    var result = true
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                    if (value) {
                        value.every(element => {
                            if (pattern.test(element) == true) {
                                return result = true
                            }else{
                                result = 'Invalid email exists.';
                            }
                        });
                    }
                    return result

                },
            }
        }
    }
};