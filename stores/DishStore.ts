import axios from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';

import { PartialDish } from 'types/Dish';

class DishStore {
  dish: PartialDish | null;

  constructor() {
    this.dish = null;
    makeAutoObservable(this);
  }

  fetchDish(id: number) {
    axios
      .get(`/api/dishes/${id}`)
      .then((resp) => resp.data)
      .then((d) =>
        runInAction(() => {
          this.dish = d;
        }),
      )
      .catch(console.log);
  }
}

const parentStore = new DishStore();

export default parentStore;
