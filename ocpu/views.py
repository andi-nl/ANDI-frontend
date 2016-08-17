import requests
import json
import logging

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .utils import generate_ellipse_data

logger = logging.getLogger(__name__)


@csrf_exempt
def compute(request):
    logger.info('Called compute')

    parameters = json.loads(request.body.decode('utf-8'))

    method_template = '/ocpu/library/andistats/R/{}/json'

    method = parameters.get('method')
    myJSON = json.dumps(parameters.get('input'))
    tests = parameters.get('input').get('patientScores')[0].get('test')
    tests = [t.get('id') for t in tests]
    #myJSON = '{"settings":{"conf":"95","sig":"twoTailed","normative":"2016-01-14","chart":""},"patientScores":[{"id":"e3","age":45,"birthdate":"","testdate":"","sex":"0","education":"3","test":[{"id":"AVLT-total_1_to_5","label":"Total trial 1 to 5","Dataset":"AVLT","SPSS name":"AVLTtotal","highborder":"75.001","highweb":"75","lowborder":"15","lowweb":"0","value":45},{"id":"AVLT-recognition_1_to_5","label":"Recognition 1 to 5","Dataset":"AVLT","SPSS name":"AVLTrecognition","highborder":"30.001","highweb":"30","lowborder":"8","lowweb":"0","value":29}]},{"id":"r4","age":22,"birthdate":"","testdate":"","sex":"1","education":"5","test":[{"id":"AVLT-total_1_to_5","label":"Total trial 1 to 5","Dataset":"AVLT","SPSS name":"AVLTtotal","highborder":"75.001","highweb":"75","lowborder":"15","lowweb":"0","value":70},{"id":"AVLT-recognition_1_to_5","label":"Recognition 1 to 5","Dataset":"AVLT","SPSS name":"AVLTrecognition","highborder":"30.001","highweb":"30","lowborder":"8","lowweb":"0","value":0}]}]}'
    data = {'myJSON': myJSON}

    url = 'http://{}:{}{}'.format(settings.OCPU_HOST, settings.OCPU_PORT,
                                  method_template.format(method))

    logger.info('ocpu url: {}'.format(url))

    try:
        result = requests.post(url, data=data)
    except Exception as e:
        logger.error(str(e))
        return JsonResponse({'error': 'Error getting results from ocpu ({}).'.format(url)})

    logger.info('status code of request to andi ocpu: {}'.format(result.status_code))

    if result.status_code == requests.codes.ok:
        # Because the result returned by andi ocpu is a string in a list
        # (['string']), we need to json.loads twice to get the actual json
        # object out.
        dataOut = json.loads(result.content.decode('utf-8'))
        res = json.loads(dataOut[0])

        ellipse_data = generate_ellipse_data(res)

        return JsonResponse({'data': res,
                             'ellipse': ellipse_data,
                             'tests': tests})
    else:
        logger.error(result.text)
        return JsonResponse({'error': result.text})

    #result.raise_for_status()
