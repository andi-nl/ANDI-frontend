library (jsonlite)
library (httr)
library(dplyr)


 tests<-'[{
  "id": 10000,
  "value": "IQTEST",
  "label": "Intelligence tests / premorbid IQ tests",
  "children": [
    {
      "id": 10100,
      "label": "Dutch Adult Reading Test (DART/NART)",
      "value": "DART",
      "children": []
    },
    {
      "id": 10200,
      "value": "IQTEST",
      "label": "Wechsler Adult Intelligence Scale",
      "children": []
    },
    {
      "id": 10300,
      "value": "IQTEST",
      "label": "WAIS-NL (1970)",
      "children": [
        {
          "id": 10310,
          "value": "IQTEST",
          "label": "WAIS_NL_Digitspan",
          "children": []
        },
        {
          "id": 10320,
          "value": "IQTEST",
          "label": "WAIS_NL_Information",
          "children": []
        },
        {
          "id": 10330,
          "value": "IQTEST",
          "label": "WAIS_NL_arithmetic",
          "children": []
        }
      ]
    }
  ]
}]'



# read url and convert to data.frame

multiLevel<-function(inJSON){
    document <- fromJSON(txt=inJSON)
    outJSON<-toJSON(document,pretty=TRUE)
    return(outJSON)
}

