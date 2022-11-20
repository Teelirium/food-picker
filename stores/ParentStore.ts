import { makeAutoObservable} from "mobx";
import { useStaticRendering } from "mobx-react";

const isServer = typeof window === "undefined";
// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(isServer);

type SerializedStore = {
    parentName: string;
    childs: [];
    selectedChild: string;
}

class ParentStore {
    constructor() {
        makeAutoObservable(this);
    }

    params = {
        parentName: "",  
        childs: [],
        selectedChild: ""
        
    }

    hydrate(serializedStore: SerializedStore) {
        this.params.parentName = serializedStore.parentName != null ? serializedStore.parentName: "";
        this.params.selectedChild = serializedStore.selectedChild != null ? serializedStore.selectedChild: "";
        this.params.childs = serializedStore.childs != null ? serializedStore.childs : [];
        
    }

    setParent = (parentName: string) => {
        this.params.parentName = parentName != null ? parentName : this.params.parentName;
    }

    setChild = (childName: string) => {
        this.params.selectedChild = childName != null ? childName : this.params.parentName;
    }
}

export default ParentStore;