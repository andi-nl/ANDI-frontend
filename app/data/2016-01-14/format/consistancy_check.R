library (gdata)
library (dplyr)
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
category.short.name <- gsub(" ","_",df$category.short.name)

### Check if the 3rd level exists if yes than construct identifier 
ID<-ifelse(ID3 =="" | ID4 =="",ID<-paste(category.short.name,".",ID1,".",ID2,".",SPSSname,sep=""), ID<-paste(category.short.name,".",ID1,".",ID2,".",ID3,".",ID4,".",SPSSname,sep=""))

### This is my file
df<-cbind(ID, df)

#write.csv(df,file="//home//anandgavai//ANDI//app//data//2016-01-14//format//tests.csv",row.names=FALSE)


### Start construction json object ###

d<-df

options(stringsAsFactors=FALSE)

#y<-d[,c(1,5:14)]
y<-d[,c("ID","lowweb","highweb","lowborder","highborder","SPSS.name","Dataset")]
y$category.short.name<-data.frame(category.short.name=d[,"category.short.name"])
y$category.short.name$ID1<-data.frame(ID1=d[,"ID1"])
y$category.short.name$ID1$ID2<-data.frame(ID2=d[,"ID2"])
y$category.short.name$ID1$ID2$ID3<-data.frame(ID3=d[,"ID3"])
y$category.short.name$ID1$ID2$ID3$ID4<-data.frame(ID4=d[,"ID4"])

y$category<-data.frame(category=d[,"category"])
y$category$Long.name.1<-data.frame(Long.name.1=d[,"Long.name.1"])
y$category$Long.name.1$Long.name.2<-data.frame(Long.name.2=d[,"Long.name.2"])
y$category$Long.name.1$Long.name.2$Long.name.3<-data.frame(Long.name.3=d[,"Long.name.3"])
y$category$Long.name.1$Long.name.2$Long.name.3$Long.name.4<-data.frame(Long.name.4=d[,"Long.name.4"])


write(toJSON(y, pretty = TRUE),file="//home//anandgavai//ANDI//app//data//2016-01-14//format//tests.json")

####################################

df <-df[,1:5]
d

aggregate(foo$Age, by = foo[c('Spp','Cnty')], length)
