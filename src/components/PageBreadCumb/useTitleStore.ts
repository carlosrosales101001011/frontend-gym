import { create } from "zustand";

interface TitleStore {
  title: string;
  subTitle: string;
  onChangeTitle: (title:string) => void;
  onChangeSubTitle: (subTitle:string)=>void;
}

export const useTitleStore = create<TitleStore>((set) => ({
  title: '',
  subTitle: '',
  onChangeTitle: (title:string) =>
    set(() => ({
      title: title,
    })),
  onChangeSubTitle: (subTitle:string) =>
    set(() => ({
      subTitle: subTitle,
    })),

}));