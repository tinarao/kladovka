import { Kladowka } from "./kladowka/kladowka";

export const kladowka = new Kladowka(
    import.meta.env.VITE_KL_KEY,
    import.meta.env.VITE_KL_TOKEN,
);