export interface Concept {
  CONCEPT_NAME_KEY: string;
  CONCEPT_NAME: string;
  CONCEPT_DESC: string;
  CONCEPT_TYPE_FLAG: number;
  CONCEPT_RELTN: string;
  children: Concept[];
  // Add any other properties that a concept might have
}