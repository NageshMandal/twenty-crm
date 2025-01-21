import { atom } from 'recoil';

export const selectedMenuAtom = atom<string | null>({
  key: 'selectedMenuAtom', // Unique key
  default: null, // Default state is no menu selected
});
