library (tidyjson)
library(jsonlite)
library (httr)
library(dplyr)
library(readr)

tests <- read_file("/home/anandgavai/ANDI/app/data/tests.json")
prettify(tests)

# convert it into json object
tests %>% as.tbl_json %>%
gather_array %>%
spread_values(tests.id=jstring("id"),tests.label=jstring("label"),tests.value=jstring("value"))%>%
enter_object("children") %>%
gather_array %>% 
spread_values(tests.id=jstring("id"),tests.label=jstring("label"),tests.value=jstring("value")) %>%
enter_object("children")%>%
gather_array %>%
spread_values(tests.id=jstring("id"),tests.label=jstring("label"),tests.value=jstring("value"))%>%
write.csv("teststmp.csv")


