import { makeAutoObservable } from "mobx";

import { API } from "api";

class UserStore {
  user = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setUser = (user) => {
    this.user = user;
  };

  *editUser(newData) {
    try {
      const userData = { ...this.user, ...newData };
      this.user = yield API.editUser(userData);
    } catch (err) {
      alert(err);
    }
  }

  *addFace(file) {
    try {
      const id = `${this.user.id}_${Date.now()}`;
      const newFace = {
        id,
        fileId: id,
        name: "",
        surname: "",
        relation: "",
        isProcessed: false,
      };
      yield API.uploadPhoto(id, file);
      yield this.editUser({ faces: [...this.user.faces, newFace] });
    } catch (err) {
      alert(err);
    }
  }

  *deleteFace(id) {
    const faces = this.user.faces.filter((face) => face.id !== id);
    const userData = { ...this.user, faces };

    try {
      yield API.deletePhoto(id);
      yield API.editUser(userData);
      this.user = userData;
    } catch (err) {
      alert(err);
    }
  }

  *editFace(face) {
    const faces = this.user.faces.map((el) =>
      el.id === face.id ? { ...el, ...face } : el
    );
    const userData = { ...this.user, faces };

    try {
      yield API.editUser(userData);
      this.user = userData;
    } catch (err) {
      alert(err);
    }
  }
}

const userStore = new UserStore();

export { userStore };
