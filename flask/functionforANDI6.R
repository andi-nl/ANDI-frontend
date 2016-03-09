#input
#setwd("C:/Users/jagelin1/Documents/Nan/Non-normality2/RuntheMMNCmodel")
#library(jsonlite)
#print(ls())
#mydata <- fromJSON("2patients.json")

id <- mydata$patients['id']
Npatients <- length(id[,1])
age <- as.numeric(unlist(mydata$patients['age']))
sex <- as.numeric(unlist(mydata$patients['sex']))
edu <- as.numeric(unlist(mydata$patients['education']))

whichtests <- numeric()
patientscores <- numeric()
for( i in 1:Npatients){
  patientscores <- cbind( patientscores, mydata$patients$test[[i]]$score)
  whichtests  <- rbind( whichtests, mydata$patients$test[[i]]$id)
}

whichtests <- whichtests[1,]
patientscores <- matrix(as.numeric(patientscores), nrow = Npatients, byrow = T)
tailed <- mydata$sig
widthconfint <- as.numeric(mydata$conf)

# defaultvalues
testnames <- c("AVLTtotal","LF_totalletter123","TMTa","TMTb")
testIDs <- c("2-1-5","6-1-3","5-0-0","5-0-1")######
load("Everythingyouneed(andnotmuchmore).RData")
covariancemat <- est.cov.matrix.total

# selection of appropriate sections of matrices and vectors, given which tests the patient has completed
# and applying the same transformations to the patient data that were applied to the control data
whichtestindexes <- match(whichtests,testIDs)
whichtestnames <- testnames[whichtestindexes]

powertransform.selection <- metadata$mybestpowertransform[whichtestindexes]
standardizing.means.selection <- metadata$mymean.transformedscores[whichtestindexes]
standardizing.sds.selection <- metadata$mysd.transformedscores[whichtestindexes]

transformed.patientscores <- patientscores^powertransform.selection
transformed.patientscores[powertransform.selection < 0] <- transformed.patientscores[powertransform.selection < 0] * -1
transformed.patientscores.standardized <- ( transformed.patientscores - standardizing.means.selection) / standardizing.sds.selection 
# 
 C <- covariancemat[whichtestindexes, whichtestindexes]
 inv.C <- solve(C)
age.centered <- age - 65
#
pred.y <- matrix( NA, Npatients, 4)
tstatistics <- matrix( NA, Npatients, length(whichtests) )
Tsquared <- matrix( NA, Npatients)
for( i in 1:Npatients){
pred.y[i,] <- t( t(c(1,sex[i],age.centered[i],edu[i],sex[i]*age.centered[i],sex[i]*edu[i],age.centered[i]*edu[i],sex[i]*age.centered[i]*edu[i]) %x% diag(1,4)) %*% Beta)

names(pred.y) <- testnames
pred.y.selection <- pred.y[i,whichtestindexes]

est.n <- myNspertest[whichtestindexes]
min.est.n <- min(est.n)
dfs <- est.n - 1
g <- ( min.est.n  + 1 ) / min.est.n 

# 
# 
# 
# output
Tsquared[i] <- ( 1 / g ) * ( ( min.est.n - P ) / ( ( min.est.n - 1 ) * P ) ) * t( pred.y.selection - transformed.patientscores.standardized[i,] ) %*% inv.C %*% ( pred.y.selection - transformed.patientscores.standardized[i,] )

tstatistics[i,] <- ((transformed.patientscores.standardized[i,] - pred.y.selection) / ( sqrt(diag(C)) / sqrt(est.n))) * (1 / sqrt(est.n + 1))

}
if( tailed == "twotailed"){
  inneredge <- qt( (1 - ( widthconfint / 100)) / 2, dfs)
  outeredge <- abs( qt( (1 - ( widthconfint / 100)) / 2, dfs))
  }

# 
# covariancemat

 myoutputdataframe <- data.frame( key = id, values = matrix(c(1,-.5),2,1), mean = 0)
 myoutputdata <- toJSON( myoutputdataframe)

