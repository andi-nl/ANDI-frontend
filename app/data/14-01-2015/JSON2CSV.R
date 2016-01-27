library (tidyjson)
library(jsonlite)
library (httr)
library(dplyr)
library(readr)


tests<-'"[
  {
    "id": "1",
    "value": "",
    "label": "Language Tests",
    "children": [
      {
        "id": "1-0",
        "value": "",
        "label": "Boston Naming Test (BNT)",
        "children": []
      },
      {
        "id": "1-1",
        "value": "",
        "label": "Token Test",
        "children": []
      },
      {
        "id": "1-2",
        "value": "",
        "label": "Peabody Picture Vocabulary Test-Third Edition (PPVT-III)",
        "children": []
      }
    ]
  }
]"'


tests <- read_file("/home/anandgavai/ANDI/app/data/tests.json")
prettify(tests)

tests %>%            # Use the %>% pipe operator to pass json through a pipeline 
as.tbl_json %>%   # Parse the JSON and setup a 'tbl_json' object
gather_array %>%  # Gather (stack) the array by index
spread_values(    # Spread (widen) values to widen the data.frame
tests.id = jstring("id"),  # Extract the "name" object as a character column "user.name"
tests.label = jnumber("label")     # Extract the "age" object as a numeric column "user.age"
)

