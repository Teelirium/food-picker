import { makeAutoObservable } from "mobx";
import { Parent } from "types/Parent";

class ParentStore {
  parent: Parent | null;
  selectedChildIndex: number;

  constructor() {
    this.parent = null;
    this.selectedChildIndex = 0;
    makeAutoObservable(this);
  }

  fetchParent() {
    this.parent = {
      id: 12,
      username: "hi",
      name: "Редискова",
      surname: "Светлана",
      middleName: "Сергеевна",
      children: [],
    };
  }

  get selectedChild() {
    return this.parent?.children[this.selectedChildIndex];
  }

  selectChild(index: number) {
    this.selectedChildIndex = index;
  }
}

const parentStore = new ParentStore();

export default parentStore;
