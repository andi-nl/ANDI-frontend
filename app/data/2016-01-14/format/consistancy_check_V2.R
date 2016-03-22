library (gdata)
library (dplyr)
require(RJSONIO)
library (jsonlite)


#df = read.xls ("//home//anandgavai//ANDI//app//data//2016-01-14//format//ANDI_betaTemplate_0303.xlsx", sheet = 1, header = TRUE)
df = read.csv ("//home//anandgavai//ANDI//app//data//2016-01-14//format//ANDI_betaTemplate_11_03_16.csv", header = TRUE)


#Step1:
# count number of rows
dimen<-dim(df)[1]

#Step2:

# count unique combination of ID1, ID2, ID3
IDCheck<-dim(unique(df[,c('category.short.name','ID1','ID2','ID3','ID4','SPSS.name')]))[1]


#Step 3:
#Check for special characters in a column

## if Step1 match with Step2 the columns are unique else raise a flag
if(dimen==IDCheck){
  print ("SUCCESS: catetory.short.name,ID1, ID2, ID3, ID4  and SPSSname are unique")
}else{
  print("ERROR: Check category.short.name, ID1, ID2, ID3, ID4 and SPSSnames as the do not seem consistant !!")
}


### Now Replace all spaces with "_" to create an identifier concatinating ID1, ID2, ID3 and catenory shortname
category.short.name <- gsub(" ","_",df$category.short.name)
ID1<-gsub(" ","_",df$ID1)
ID2<-gsub(" ","_",df$ID2)
ID3<-gsub(" ","_",df$ID3)
ID4<-gsub(" ","_",df$ID4)
SPSSname<-gsub(" ","_",df$SPSS.name)

### This is my file
df<-cbind(ID, df)
d <-df[,1:3]




MyData<-read.csv ("//home//anandgavai//ANDI//app//data//2016-01-14//format//MyData.csv", header = TRUE)
MyData<-d

makeList<-function(x){
#  if(ncol(x)>2){
    listSplit<-split(x[,2:3],x[1],drop=T)
    lapply(
      names(listSplit),function(y){
        list(data.frame(id="",value="",label=c(y)),children=data.frame(id="",value="",label="",makeList(listSplit[[y]])))
        })
    
#  }
#  else{
   lapply(seq(nrow(x[1])),function(y){
      #list(id="",value="",label=y,children=list(id="",value="",label=x[,1][y],makeList(listSplit[[y]])))
     browser()
      list(label=x[,1][y])
     })
#  }
}

jsonOut<-toJSON(makeList(MyData))
cat(jsonOut)

write(jsonOut,"//home//anandgavai//ANDI//app//data//2016-01-14//format//MyData.json")



























list1<-split(subset(MyData,select=c(-category.short.name)),MyData$category.short.name)



list2<-lapply(list1,function(x){
    split(subset(x,select=c(-ID1)),x$ID1,drop=TRUE)
  })


list3<-lapply(list2,function(x){
          lapply(x,function(y){
              split(subset(y,select=c(-ID2)),y$ID2,drop=TRUE)
          })
  })



jsonOut<-toJSON(list(MyData=list3))


jsonOut1<-gsub('([^\n]*?): \\{\n "Percentage"','\\{"name":\\1,"Percentage"',jsonOut)
jsonOut2<-gsub('"([^"]*?)": \\{','"name":"\\1","children":\\{',jsonOut1)







