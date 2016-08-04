import requests
import json

from django.conf import settings
from django.http import JsonResponse


def compute(request):
    method_template = '/ocpu/library/andistats/R/{}/json'

    # TODO: get from request
    method = 'normcomp'
    myJSON = '{"settings":{"conf":"95","sig":"twoTailed","normative":"2016-01-14","chart":""},"patientScores":[{"id":"e3","age":45,"birthdate":"","testdate":"","sex":"0","education":"3","test":[{"id":"AVLT-total_1_to_5","label":"Total trial 1 to 5","Dataset":"AVLT","SPSS name":"AVLTtotal","highborder":"75.001","highweb":"75","lowborder":"15","lowweb":"0","value":45},{"id":"AVLT-recognition_1_to_5","label":"Recognition 1 to 5","Dataset":"AVLT","SPSS name":"AVLTrecognition","highborder":"30.001","highweb":"30","lowborder":"8","lowweb":"0","value":29}]},{"id":"r4","age":22,"birthdate":"","testdate":"","sex":"1","education":"5","test":[{"id":"AVLT-total_1_to_5","label":"Total trial 1 to 5","Dataset":"AVLT","SPSS name":"AVLTtotal","highborder":"75.001","highweb":"75","lowborder":"15","lowweb":"0","value":70},{"id":"AVLT-recognition_1_to_5","label":"Recognition 1 to 5","Dataset":"AVLT","SPSS name":"AVLTrecognition","highborder":"30.001","highweb":"30","lowborder":"8","lowweb":"0","value":0}]}]}'
    data = {'myJSON': myJSON}

    url = '{}{}'.format(settings.OCPU_HOST, method_template.format(method))

    result = requests.post(url, data=data)

    dataOut = json.loads(result.text)
    print len(result.content)
    print type(result.content)
    print type(dataOut)
    res = json.loads(dataOut[0])
    for i in res:
        print i.keys()

    #print result.status_code
    #print json.loads(result.content)
    #print result.headers

    if result.status_code == requests.codes.ok:
        return JsonResponse({'result': res})
    else:
        return JsonResponse({'error': result.text}, safe=False)

    #result.raise_for_status()
