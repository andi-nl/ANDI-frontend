import json
import logging
import cairosvg

from django.http import HttpResponse
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
        svg = parameters['svg']
    except:
        raise SuspiciousOperation('Invalid input for svg2pdf.')

    response = HttpResponse(content_type='application/pdf')
    response.write(cairosvg.svg2pdf(bytestring=svg))
    response['Content-Disposition'] = 'attachment; filename=graph.pdf'
    return response
