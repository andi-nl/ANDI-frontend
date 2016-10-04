"""Utility functions for ocpu views"""
import os
import pandas as pd
from itertools import combinations

from django.conf import settings


def _edp(t1, t2, x, y, p):
    """Returns ellipse data point"""
    return {'test1': t1,
            'test2': t2,
            'x': x,
            'y': y,
            'id': p}


def generate_ellipse_data(normcomp_data):
    """Generate data for the ellipses plot"""
    csv = os.path.join(settings.BASE_DIR, 'static/app/data/ellipseparams.csv')
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
            if patient2test[p].get(t1) and patient2test[p].get(t2):
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
