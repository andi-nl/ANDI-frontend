import requests
import json

from django.http import JsonResponse


def compute(request):
    ocpuPath = 'https://public.opencpu.org/ocpu/library'

    result = requests.post(ocpuPath+'/base/R/mean/json', data={"x": '[1,2,3,4]'})

    print result.status_code
    print result.content
    #print result.headers

    if result.status_code == requests.codes.ok:
        return JsonResponse({'result': json.loads(result.content)})
    else:
        return JsonResponse(result.text, safe=False)

    #result.raise_for_status()
