import { writable, derived } from 'svelte/store';
import htgData from '../../data/htg.json';

export const configStore = writable(htgData);

export function updateConfig(newConfig) {
    configStore.set(newConfig);
}

export function loadConfig() {
    configStore.set(htgData);
}

function processData(data) {
    console.log('Creating new tree_structure');

    const htgObjects = data.RCONFIG.OBJECT;

    // Find the userarea object
    const userarea = htgObjects.find(obj => obj.OBJECTKEY === 'userarea');

    if (!userarea) {
        console.error('userarea not found');
        return null;
    }

    // Recursive function to build the complete tree
    function buildTree(obj) {
        const children = obj.SUB ? obj.SUB.map(sub => {
            const childObj = htgObjects.find(o => o.OBJECTKEY === sub.OBJECTKEY);
            return childObj ? buildTree(childObj) : null;
        }).filter(Boolean) : [];

        return {
            ...obj,
            children: children.length > 0 ? children : undefined
        };
    }

    // Create the tree structure with 'userarea' as the root
    const treeStructure = buildTree(userarea);

    console.log(`Tree structure size: ${JSON.stringify(treeStructure).length} characters`);

    // Log the first few levels of the tree structure for debugging
    console.log(JSON.stringify(treeStructure, null, 2).substring(0, 1000) + '...');

    return treeStructure;
}

// Create a derived store that processes the data
export const processedConfigStore = derived(configStore, $configStore => processData($configStore));

// Call loadConfig immediately to set the initial state
loadConfig();
