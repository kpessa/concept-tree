import { writable } from 'svelte/store';
import * as d3 from 'd3';

export const conceptData = writable(null);

export async function loadConceptData() {
    try {
        const response = await fetch('/data/concepts_ea.csv');
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
        const processedData = processData(rawData);
        if (!processedData) {
            throw new Error("Failed to process data");
        }
        conceptData.set(processedData);
    } catch (error) {
        console.error('Error in loadConceptData:', error);
        conceptData.set(null);
        throw error;
    }
}

function processData(rawData) {
    const nodeMap = new Map();

    // Create nodes
    rawData.forEach(row => {
        const node = {
            ...row,
            CONCEPT_TYPE_FLAG: parseInt(row.CONCEPT_TYPE_FLAG),
            children: []
        };
        nodeMap.set(node.CONCEPT_NAME_KEY, node);
        nodeMap.set(node.CONCEPT_NAME, node);
    });

    // Create hierarchy
    nodeMap.forEach(node => {
        if (node.CONCEPT_TYPE_FLAG === 2) { // Complex concept
            const childKeys = extractRelatedConcepts(node.CONCEPT_RELTN);
            node.children = childKeys
                .map(key => nodeMap.get(key))
                .filter(Boolean);
        }
    });

    // Find the "EA - ToDo - Alert" concept
    const rootNode = nodeMap.get("EATODOALERT") || nodeMap.get("EA - ToDo - Alert");

    if (!rootNode) {
        console.error("Root node 'EA - ToDo - Alert' not found");
        return null;
    }

    console.log("Root node:", rootNode);
    return rootNode;
}

function extractRelatedConcepts(expression) {
    return expression.match(/\{(.*?)\}/g)?.map(key => key.replace(/[{}]/g, '')) || [];
}