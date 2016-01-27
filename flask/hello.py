import rpy2
from flask import Flask
from flask import request
from flask import json
from numpy import *
import scipy as sp
from pandas import *
from rpy2.robjects.packages import importr
import rpy2.robjects as ro
import pandas.rpy.common as com
import subprocess
import sys


app = Flask(__name__)

@app.route('/')
def run_script():
    ro.r('x=c()')
    ro.r('x[1]=22')
    ro.r('x[2]=44')
    s = str(ro.r['x'])
    return s

@app.route('/demoTestScores',methods=['POST'])
def api_demoTestScores():
    if request.headers['Content-Type']=='application/json':
        return "JSON Object: " + json.dumps(request.json)

if __name__ == '__main__':
    app.debug=True
    app.run()