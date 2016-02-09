# # #input
# #library(jsonlite)

# #mydata <- fromJSON("2patients.json")

# # 
  id <- mydata$patients['id']
  Npatients <- length(id[,1])
  age <- mydata$patients['age']
  sex <- mydata$patients['sex']
  edu <- mydata$patients['education']

  whichtests <- numeric()
  patientscores <- numeric()
  for( i in 1:Npatients){
    patientscores <- rbind( patientscores, mydata$patients$test[[i]]$score)
    whichtests  <- rbind( whichtests, mydata$patients$test[[i]]$id)
  }
  patientscores <- as.numeric(patientscores)
  tailed <- mydata$sig
  widthconfint <- as.numeric(mydata$conf)
 
  # defaultvalues
  testnames <- c("AVLTtotal","LF_totalletter123","TMTa","TMTb")
  testIDs <- c("2-1-5","6-1-3","5-0-0","5-0-1")######
  load("/home/anandgavai/ANDI/flask/Everythingyouneed(andnotmuchmore).RData")
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
 
C <- covariancemat[whichtestindexes, whichtestindexes]
  inv.C <- solve(C)
  #age.centered <- age - 65
 
  #pred.y <- (t(c(1,sex,age.centered,edu,sex*age.centered,sex*edu,age.centered*edu,sex*age.centered*edu)) %x% diag(1,4)) %*% Beta
  #names(pred.y) <- testnames
  #pred.y.selection <- pred.y[whichtestindexes]
 
#  est.n <- myNspertest[whichtestindexes]
#  min.est.n <- min(est.n)
#  dfs <- est.n - 1
#  g <- ( min.est.n  + 1 ) / min.est.n 
 
 
 
 
#  # output
#  Tsquared <- ( 1 / g ) * ( ( min.est.n - P ) / ( ( min.est.n - 1 ) * P ) ) * t( pred.y.selection - transformed.patientscores.standardized ) %*% inv.C %*% ( pred.y.selection - transformed.patientscores.standardized )
 
#  tstatistics <- ((transformed.patientscores.standardized - pred.y.selection) / ( sqrt(diag(C)) / sqrt(est.n))) * (1 / sqrt(est.n + 1))
 
#  if( tailed == "twotailed"){
#    inneredge <- qt( (1 - ( widthconfint / 100)) / 2, dfs)
#    outeredge <- abs( qt( (1 - ( widthconfint / 100)) / 2, dfs))
#    }
 
#  # 
#  # covariancemat

# myoutputdataframe <- data.frame( tstats = 5)
# myoutputdata <- toJSON( myoutputdataframe)
