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
      name: "Редискова",
      surname: "Светлана",
      middleName: "Сергеевна",
      children: ["Редисков Андрей Сергеевич", "Редисков Иван Андреевич"],
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
