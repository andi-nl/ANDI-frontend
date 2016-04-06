
########## THIS PART NEEDS TO BE COMMENTED OUT FOR THE WEBSITE ###########
#input
setwd("//home//anandgavai//ANDI//flask")
library(jsonlite)
library(lubridate)
library(readr)
library(tidyjson)

#outputJSON <- toJSON(5)
 
myJSON<-fromJSON("myJSON.json")
 
#  myJSON<-'{
#  "0": {
#    "id": "1",
#    "age": "2016-03-31T22:00:00.000Z",
#    "sex": "0",
#    "education": "1",
#    "test": [
#      {
#        "id": "RAPM-shortform_12_item",
#        "label": "12_item_short_form",
#        "value": 12
#      },
#      {
#        "id": "DART-raw_score",
#        "label": "raw_score",
#        "value": 14
#      }
#      ]
#  },
#  "1": {
#    "id": "2",
#    "age": "2016-04-01T22:00:00.000Z",
#    "sex": "1",
#    "education": "2",
#    "test": [
#      {
#        "id": "RAPM-shortform_12_item",
#        "label": "12_item_short_form",
#        "value": 13
#      },
#      {
#        "id": "DART-raw_score",
#        "label": "raw_score",
#        "value": 15
#      }
#      ]
#  },
#  "conf": "95",
#  "sig": "twoTailed",
#  "nomative": "2015-01-14"
#  }'
 


myFunc<-function(myJSON){
      ##########################################################################
     no.patients <- length(head(myJSON,-3))
     mydata <- NULL
     for( i in 1:(no.patients) ){
       demos <- unlist(head(myJSON[[i]],4))
       testinfo <- myJSON[[i]][5][[1]]
       mydata <- rbind( mydata, cbind( matrix(rep(demos, nrow(testinfo)), nrow(testinfo), byrow = T), testinfo))
     }
     
     colnames( mydata) <- c("patid", "date", "sex", "edu", "uniqueid", "label", "score")
     mydata$age <- as.period(interval(now(), ymd(substring(mydata$date,1,10))))$year
     mydata$edu <- as.numeric(mydata$edu)
     mydata$conf <- myJSON$conf
     mydata$sig <- myJSON$sig
     mydata$nomative <- myJSON$nomative
     whichtests <- unique(mydata$uniqueid)
     
     # defaultvalues
     load("//home//anandgavai//ANDI//flask//Everythingyouneed.RData")
     
     ANDImetadata <- read.csv("//home//anandgavai//ANDI//flask//metadataforMMNCandpatientwithuniqueids.csv")
     uniqueIDs <- ANDImetadata$uniqueids
     
     
     covariancemat <- est.cov.matrix.total
     covariancemat <- diag(1, length(uniqueIDs))
     
     # selection of appropriate sections of matrices and vectors, given which tests the patient has completed
     # and applying the same transformations to the patient data that were applied to the control data
     whichtestindexes <- match(whichtests,uniqueIDs)
     whichtestnames <- uniqueIDs[whichtestindexes]
     outputJSON <- toJSON(whichtestindexes)
     return(toJSON(whichtestindexes))
     #return(myJSON)
 }
 

