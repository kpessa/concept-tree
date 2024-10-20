import { writable } from 'svelte/store';

export const configStore = writable({});

export function updateConfig(newConfig) {
    configStore.set(newConfig);
}

export function loadConfig() {
    // You can add logic here to load the initial config from a file or API
    // For now, we'll just initialize with an empty object
    configStore.set({});
}
