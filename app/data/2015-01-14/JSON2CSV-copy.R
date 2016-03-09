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
spread_values(tests.label=jstring("label"))%>%
enter_object("children") %>%
gather_array %>% 
spread_values(tests.label=jstring("label")) %>%
write.csv("/home/anandgavai/ANDI/app/data/teststmp.csv")  




tests %>% as.tbl_json %>%
  gather_array %>%
  spread_values(tests.label=jstring("label"))%>%
  enter_object("children") %>%
  spread_values(tests.label=jstring("label"))%>%
  gather_array%>%
  spread_values(tests.label=jstring("label"))%>%
  gather_array%>%
  spread_values(tests.label=jstring("label"))%>%
  write.csv("/home/anandgavai/ANDI/app/data/teststmp.csv")  


