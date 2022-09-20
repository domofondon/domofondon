import { makeAutoObservable } from 'mobx';

import { API } from 'api';

class AdminStore {
  admin = null;

  users = [];

  admins = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setAdmin = (userInfo) => {
    this.admin = userInfo;
  };

  *getUsers() {
    try {
      const users = yield API.getUsers();
      const adminsPhones = this.admins.map((admin) => admin.phone);
      this.users = users.filter((user) => !adminsPhones.includes(user.phone));
    } catch (err) {
      alert(err);
    }
  }

  *getAdmins() {
    try {
      this.admins = yield API.getAdmins();
    } catch (err) {
      alert(err);
    }
  }

  *setFaceProcessed({ userId, faceId, isProcessed }) {
    const userData = this.users.find((user) => user.id === userId);
    const faces = userData.faces.map((face) =>
      face.id === faceId ? { ...face, isProcessed } : face
    );
    const newUserData = { ...userData, faces };

    try {
      yield API.editUser(newUserData);
      this.users = this.users.map((user) => (user.id === userId ? newUserData : user));
    } catch (err) {
      alert(err);
    }
  }
}

const adminStore = new AdminStore();

export { adminStore };
