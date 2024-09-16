export const atomicConcept = {
    CONCEPT_NAME: "Active VAP Care Plan",
    CONCEPT_NAME_KEY: "ACTIVEVAPCAREPLAN",
    CONCEPT_TYPE_FLAG: "1",
    CONCEPT_DESC: "Patients with an active care plan for VAP",
    EXPIRE_ON_DISCHARGE: 1,
    MULTIPLE_ENTRY_IND: 0,
    UPDT_DT_TM: "12/02/14"
  };
  
  export const complexConcept = {
    CONCEPT_NAME: "Falls - High Risk or Documented Fall",
    CONCEPT_NAME_KEY: "FALLSHIGHRISKORDOCUMENTEDFALL",
    CONCEPT_TYPE_FLAG: "2",
    CONCEPT_DESC: "Patients with a High Fall Risk Score (based on Morse or Humpty) OR a documented fall",
    CONCEPT_RELTN: "{FALLSHIGHFALLRISK} OR {DOCUMENTEDFALL}.COUNT > 0",
    EXPIRE_ON_DISCHARGE: 0,
    MULTIPLE_ENTRY_IND: 0,
    UPDT_DT_TM: "04/03/15",
    isExpanded: true
  };