import { writable } from "svelte/store";

export const cart = writable([]);
export const resume = writable({});
export const currentStep = writable(1);
export const temporaryAddress = writable({});