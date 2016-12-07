"""Utility functions for ocpu views"""
import os
import json
import requests
import logging
import pandas as pd
from itertools import combinations

from django.conf import settings
from django.http import JsonResponse

logger = logging.getLogger(__name__)


def _edp(t1, t2, x, y, p):
    """Returns ellipse data point"""
    return {'test1': t1,
            'test2': t2,
            'x': x,
            'y': y,
            'id': p}


def generate_ellipse_data(normcomp_data, normcomp_settings):
    """Generate data for the ellipses plot"""
    ep_file = 'static/app/data/{}/ellipseparams{}.csv'.format(
        normcomp_settings.get('normative'), normcomp_settings.get('conf'))
    csv = os.path.join(settings.BASE_DIR, ep_file)
    df = pd.read_csv(csv)
    test_pairs = [pair for pair in zip(list(df['test1']), list(df['test2']))]

    tests = [t['testname'] for t in normcomp_data]
    tests = set(tests)

    patient2test = {}
    for d in normcomp_data:
        if d['id'] not in patient2test.keys():
            patient2test[d['id']] = {}
        patient2test[d['id']][d['testname']] = d['univariateT']

    patients = set([p['id'] for p in normcomp_data])

    ellipse_data = []
    for (t1, t2) in combinations(tests, 2):
        for p in patients:
            if t1 in patient2test[p].keys() and t2 in patient2test[p].keys():
                if (t1, t2) in test_pairs:
                    edp = _edp(t1, t2, patient2test[p][t1], patient2test[p][t2], p)
                else:
                    edp = _edp(t2, t1, patient2test[p][t2], patient2test[p][t1], p)
                ellipse_data.append(edp)

    return ellipse_data


def generate_tests_data(normcomp_data):
    tests_data = {}
    for d in normcomp_data:
        tests_data[d['plotname']] = d

    return list(tests_data.values())


def do_normcomp(parameters):
    method = parameters.get('method')
    input_data = parameters.get('input')
    myJSON = json.dumps(input_data)

    if method == 'null' or myJSON == 'null':
        return JsonResponse({'error': 'Invalid input for ocpu.'})

    tests = input_data.get('patientScores')[0].get('test')
    tests = [t.get('id') for t in tests]
    #myJSON = '{"settings":{"conf":"95","sig":"twoTailed","normative":"2016-01-14","chart":""},"patientScores":[{"id":"e3","age":45,"birthdate":"","testdate":"","sex":"0","education":"3","test":[{"id":"AVLT-total_1_to_5","label":"Total trial 1 to 5","Dataset":"AVLT","SPSS name":"AVLTtotal","highborder":"75.001","highweb":"75","lowborder":"15","lowweb":"0","value":45},{"id":"AVLT-recognition_1_to_5","label":"Recognition 1 to 5","Dataset":"AVLT","SPSS name":"AVLTrecognition","highborder":"30.001","highweb":"30","lowborder":"8","lowweb":"0","value":29}]},{"id":"r4","age":22,"birthdate":"","testdate":"","sex":"1","education":"5","test":[{"id":"AVLT-total_1_to_5","label":"Total trial 1 to 5","Dataset":"AVLT","SPSS name":"AVLTtotal","highborder":"75.001","highweb":"75","lowborder":"15","lowweb":"0","value":70},{"id":"AVLT-recognition_1_to_5","label":"Recognition 1 to 5","Dataset":"AVLT","SPSS name":"AVLTrecognition","highborder":"30.001","highweb":"30","lowborder":"8","lowweb":"0","value":0}]}]}'
    data = {'myJSON': myJSON}

    res = _ocpu_request(method, data)
    if 'error' in res.keys():
        return JsonResponse(res)

    res = res['data']

    tests_data = generate_tests_data(res)

    ellipse_data = generate_ellipse_data(res, input_data.get('settings'))

    return JsonResponse({'data': res,
                         'ellipse': ellipse_data,
                         'tests': tests,
                         'testsData': tests_data,
                         'input': input_data})


def do_calccomposite(parameters):
    method = parameters.get('method')
    data = {'inputfile': json.dumps(parameters.get('input'))}

    res = _ocpu_request(method, data)
    if 'error' in res.keys():
        return JsonResponse(res)

    res = res['data'][0]
    return JsonResponse({'data': res})


def _ocpu_request(method, data):
    method_template = '/ocpu/library/andistats/R/{}/json'
    url = 'http://{}:{}{}'.format(settings.OCPU_HOST, settings.OCPU_PORT,
                                  method_template.format(method))

    logger.info('ocpu url: {}'.format(url))

    try:
        result = requests.post(url, data=data)
    except Exception as e:
        logger.error(str(e))
        return {'error': 'Error getting results from ocpu ({}).'.format(url)}

    logger.info('status code of request to andi ocpu: {}'.format(result.status_code))

    if result.status_code == requests.codes.ok:
        # Because the result returned by andi ocpu is a string in a list
        # (['string']), we need to json.loads twice to get the actual json
        # object out.
        dataOut = json.loads(result.content.decode('utf-8'))
        res = json.loads(dataOut[0])
    else:
        logger.error(result.text)
        return {'error': result.text}

    return {'data': res}
