library (gdata)
library (dplyr)
library (jsonlite)


df = read.xls ("//home//anandgavai//ANDI//app//data//2016-01-14//format//ANDI_betaTemplate_0303.xlsx", sheet = 1, header = TRUE)

#Step1:
# count number of rows
dimen<-dim(df)[1]

#Step2:
# count unique combination of ID1, ID2, ID3
IDCheck<-dim(unique(df[,c("category.short.name",'ID1','ID2','ID3')]))[1]


#Step 3:
#Check for special characters in a column

## if Step1 match with Step2 the columns are unique else raise a flag
if(dimen==IDCheck){
  print ("SUCCESS: catetory.short.name,ID1, ID2, ID3 and SPSSname are unique")
}else{
  print("ERROR: Check category.short.name, ID1, ID2, ID3 and SPSSnames as the do not seem consistant !!")
}


### Now Replace all spaces with "_" to create an identifier concatinating ID1, ID2, ID3 and catenory shortname
category.short.name <- gsub(" ","_",df$category.short.name)
ID1<-gsub(" ","_",df$ID1)
ID2<-gsub(" ","_",df$ID2)
ID3<-gsub(" ","_",df$ID3)
category.short.name <- gsub(" ","_",df$category.short.name)

### Check if the 3rd level exists if yes than construct identifier 
ID<-ifelse(ID3 =="",ID<-paste(category.short.name,".",ID1,".",ID2,sep=""), ID<-paste(category.short.name,".",ID1,".",ID2,".",ID3,sep=""))

### This is my file
df<-cbind(ID, df)

write.csv(df,file="df.csv",row.names=FALSE)


### Start construction json object ###

d<-df
colnames(d)[2]<-"category"

options(stringsAsFactors=FALSE)

y<-d[,c(1,6:15)]
y$category<-data.frame(category=d[,2])
y$category$ID1<-data.frame(ID1=d[,3])
y$category$ID1$ID2<-data.frame(ID2=d[,4])
y$category$ID1$ID2$ID3<-data.frame(ID3=d[,5])
write(toJSON(y, pretty = TRUE),file="tests.json")



