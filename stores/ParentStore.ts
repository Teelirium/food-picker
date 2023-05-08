import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

import { ParentWithChildren } from 'types/Parent';

class ParentStore {
  parent: ParentWithChildren | null;

  childIndex: number;

  constructor() {
    this.parent = null;
    this.childIndex = 0;
    makeAutoObservable(this);
  }

  fetchParent(id: number) {
    axios
      .get(`/api/parents/${id}?children=true`)
      .then((resp) => resp.data)
      .then((p) =>
        runInAction(() => {
          this.parent = p;
        }),
      )
      .catch(console.log);
  }

  get currentChild() {
    return this.parent?.children[this.childIndex];
  }

  setChild(index: number) {
    this.childIndex = index;
  }
}

const parentStore = new ParentStore();

export default parentStore;
