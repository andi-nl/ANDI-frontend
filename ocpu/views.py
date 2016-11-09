
import json
import logging

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.exceptions import SuspiciousOperation

from .utils import do_normcomp, do_calccomposite

logger = logging.getLogger(__name__)


@login_required
@csrf_exempt
def compute(request):
    logger.info('Called compute')

    try:
        parameters = json.loads(request.body.decode('utf-8'))
    except:
        raise SuspiciousOperation('Invalid input for ocpu.')

    method = parameters.get('method')

    if method == 'normcomp':
        return do_normcomp(parameters)
    elif method == 'calccomposite':
        return do_calccomposite(parameters)
    else:
        msg = 'ocpu called with "{}"; method not implemented'.format(method)
        logger.error(msg)
        return JsonResponse({'error': 'method "{}" not implemented in ocpu.'})
