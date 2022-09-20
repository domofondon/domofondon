import { makeAutoObservable } from "mobx";

import { API } from "api";

class AddressesStore {
  addresses = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  *getAddresses() {
    try {
      const addresses = yield API.getAddresses();
      this.addresses = addresses.sort((a, b) =>
        a.fullAddress > b.fullAddress ? 1 : -1
      );
    } catch (err) {
      alert(err);
    }
  }
}

const addressesStore = new AddressesStore();

export { addressesStore };
