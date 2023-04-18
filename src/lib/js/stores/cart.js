import { writable } from "svelte/store";

export const idCart = writable(0);
export const cart = writable([]);
export const resume = writable({});
export const currentStep = writable(1);
export const temporaryAddress = writable({});