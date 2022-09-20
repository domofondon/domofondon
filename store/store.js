import { makeAutoObservable } from "mobx";
import firebase from "firebase/app";

import { API } from "api";
import { photoURLs } from "helpers";

import { userStore } from "./stores/userStore";
import { adminStore } from "./stores/adminStore";
import { addressesStore } from "./stores/addressesStore";

class Store {
  isGettingAuth = true;

  isAdmin = false;

  userStore = userStore;

  adminStore = adminStore;

  addressesStore = addressesStore;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    firebase.auth().onAuthStateChanged(this.handleAuthStateChange.bind(this));
  }

  *handleAuthStateChange(user) {
    this.isGettingAuth = true;
    try {
      if (user) {
        const phone = user.phoneNumber;

        let userInfo = yield API.getUserInfo(phone);

        if (userInfo === null) {
          userInfo = yield API.createUser(phone);
        }

        this.isAdmin = yield API.checkIsAdmin(phone);

        if (!this.isAdmin) {
          this.userStore.setUser(userInfo);
          yield photoURLs.loadByUser(userInfo);
        } else {
          this.adminStore.setAdmin(userInfo);
          yield this.adminStore.getAdmins();
          yield this.adminStore.getUsers();
        }

        yield this.addressesStore.getAddresses();
      } else {
        this.isAdmin = false;
        this.userStore.setUser(null);
        this.adminStore.setAdmin(null);
      }
    } catch (err) {
      alert(err);
    }
    this.isGettingAuth = false;
  }
}

const store = new Store();

export { store };
