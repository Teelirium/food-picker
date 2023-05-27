import { makeAutoObservable } from 'mobx';

class ParentStore {
  childIndex: number;

  constructor() {
    this.childIndex = 0;
    makeAutoObservable(this);
  }

  setChildIndex(index: number) {
    this.childIndex = index;
  }
}

const parentStore = new ParentStore();

export default parentStore;
