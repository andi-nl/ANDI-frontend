import requests
import json
import logging

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.exceptions import SuspiciousOperation

logger = logging.getLogger(__name__)


@login_required
@csrf_exempt
def svg2pdf(request):
    logger.info('Called svg2pdf')

    try:
        parameters = json.loads(request.body.decode('utf-8'))
    except:
        raise SuspiciousOperation('Invalid input for svg2pdf.')

    print(parameters)
