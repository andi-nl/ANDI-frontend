import requests
import json

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def compute(request):
    print(type(request.body))
    parameters = json.loads(request.body.decode('utf-8'))

    method_template = '/ocpu/library/andistats/R/{}/json'

    method = parameters.get('method')
    myJSON = json.dumps(parameters.get('input'))
    #myJSON = '{"settings":{"conf":"95","sig":"twoTailed","normative":"2016-01-14","chart":""},"patientScores":[{"id":"e3","age":45,"birthdate":"","testdate":"","sex":"0","education":"3","test":[{"id":"AVLT-total_1_to_5","label":"Total trial 1 to 5","Dataset":"AVLT","SPSS name":"AVLTtotal","highborder":"75.001","highweb":"75","lowborder":"15","lowweb":"0","value":45},{"id":"AVLT-recognition_1_to_5","label":"Recognition 1 to 5","Dataset":"AVLT","SPSS name":"AVLTrecognition","highborder":"30.001","highweb":"30","lowborder":"8","lowweb":"0","value":29}]},{"id":"r4","age":22,"birthdate":"","testdate":"","sex":"1","education":"5","test":[{"id":"AVLT-total_1_to_5","label":"Total trial 1 to 5","Dataset":"AVLT","SPSS name":"AVLTtotal","highborder":"75.001","highweb":"75","lowborder":"15","lowweb":"0","value":70},{"id":"AVLT-recognition_1_to_5","label":"Recognition 1 to 5","Dataset":"AVLT","SPSS name":"AVLTrecognition","highborder":"30.001","highweb":"30","lowborder":"8","lowweb":"0","value":0}]}]}'
    data = {'myJSON': myJSON}

    url = '{}{}'.format(settings.OCPU_HOST, method_template.format(method))

    result = requests.post(url, data=data)

    print(result.text)
    print()
    print(result.content)
    print()
    print(result.status_code)
    #print json.loads(result.content)
    #print result.headers

    if result.status_code == requests.codes.ok:
        dataOut = json.loads(result.content)
        print(len(result.content))
        print(type(result.content))
        print(type(dataOut))
        res = json.loads(dataOut[0])
        for i in res:
            print(i.keys())
        return JsonResponse({'data': res})
    else:
        return JsonResponse({'error': result.text}, safe=False)

    #result.raise_for_status()
