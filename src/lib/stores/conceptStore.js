import { writable } from 'svelte/store';
import * as d3 from 'd3';

export const conceptList = writable([]);
export const conceptTree = writable(null);
export const selectedConcept = writable(null);

export async function loadConceptData() {
    try {
        const response = await fetch('/data/concepts_3000.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        if (!text) {
            throw new Error("CSV file is empty");
        }
        const rawData = d3.csvParse(text);
        if (!rawData || rawData.length === 0) {
            throw new Error("Failed to parse CSV data");
        }
        console.log('Loaded concepts:', rawData.length);
        conceptList.set(rawData);
    } catch (error) {
        console.error('Error in loadConceptData:', error);
        conceptList.set([]);
        throw error;
    }
}

export function updateConcepts(newConcepts) {
    conceptList.update(currentConcepts => {
        const updatedConcepts = [...currentConcepts];
        const addedConcepts = [];
        const updatedConceptIds = [];

        newConcepts.forEach(newConcept => {
            const index = updatedConcepts.findIndex(c => c.CONCEPT_NAME_KEY === newConcept.CONCEPT_NAME_KEY);
            if (index !== -1) {
                if (JSON.stringify(updatedConcepts[index]) !== JSON.stringify(newConcept)) {
                    updatedConcepts[index] = { ...updatedConcepts[index], ...newConcept };
                    updatedConceptIds.push(newConcept.CONCEPT_NAME_KEY);
                }
            } else {
                updatedConcepts.push(newConcept);
                addedConcepts.push(newConcept.CONCEPT_NAME_KEY);
            }
        });

        console.log(`Updated ${updatedConceptIds.length} concepts and added ${addedConcepts.length} new concepts.`);
        return updatedConcepts;
    });
}

export function buildConceptTree(rootId) {
    console.log(`Starting to build concept tree with root ID: ${rootId}`);
    let concepts;
    conceptList.subscribe(value => {
        concepts = value;
    })();

    if (concepts.length === 0) {
        console.error('Concept list is empty. Load data first.');
        return;
    }

    console.log(`Total concepts in list: ${concepts.length}`);

    const conceptMap = new Map(concepts.map(c => [c.CONCEPT_NAME_KEY, { ...c, children: [] }]));

    console.log(`Concept map created with ${conceptMap.size} entries`);

    const rootConcept = conceptMap.get(rootId);

    if (!rootConcept) {
        console.error(`Concept with ID ${rootId} not found.`);
        return;
    }

    let processedNodes = new Set();

    function addChildren(node, depth = 0) {
        if (processedNodes.has(node.CONCEPT_NAME_KEY)) {
            console.warn(`Circular reference detected for node: ${node.CONCEPT_NAME}`);
            return;
        }

        processedNodes.add(node.CONCEPT_NAME_KEY);

        const childrenReferences = (node.CONCEPT_RELTN || '').match(/\{([^}]+)\}/g) || [];
        const children = childrenReferences.map(ref => {
            const childName = ref.slice(1, -1); // Remove curly braces
            const foundChild = concepts.find(c => 
                c.CONCEPT_NAME === childName || c.CONCEPT_NAME_KEY === childName
            );
            return foundChild;
        }).filter(Boolean);

        node.children = children.map(child => {
            const childNode = conceptMap.get(child.CONCEPT_NAME_KEY);
            if (childNode) {
                addChildren(childNode, depth + 1);
                return childNode;
            } else {
                console.warn(`Child node not found in concept map: ${child.CONCEPT_NAME_KEY}`);
                return null;
            }
        }).filter(Boolean);

        processedNodes.delete(node.CONCEPT_NAME_KEY);
    }

    addChildren(rootConcept);
    conceptTree.set(rootConcept);
}