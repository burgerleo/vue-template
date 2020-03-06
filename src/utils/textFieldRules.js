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
        }
      }
    }
  }
};