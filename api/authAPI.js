import firebase from "firebase/app";
import "firebase/auth";

class AuthAPI {
  recaptchaVerifier = null;

  confirmationResult = null;

  recaptchaVerifierVisible = (callback) => {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha", {
      size: "normal",
      callback,
    });
  };

  recaptchaVerifierInvisible = (callback) => {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha", {
      size: "invisible",
      callback,
    });
  };

  phoneSignIn = (phoneNumber) => {
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier)
      .then((confirmationResult) => {
        this.confirmationResult = confirmationResult;
      })
      .catch(alert);
  };

  verifyCode = (code) => {
    this.confirmationResult.confirm(code).catch(alert);
  };

  logout = () => {
    firebase.auth().signOut().catch(alert);
  };
}

const authAPI = new AuthAPI();

export { authAPI };
