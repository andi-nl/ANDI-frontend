"""Utility functions for ocpu views"""

from itertools import combinations


def _edp(t1, t2, x, y, p):
    """Returns ellipse data point"""
    return {'test1': t1,
            'test2': t2,
            'x': x,
            'y': y,
            'id': p}


def generate_ellipse_data(normcomp_data):
    """Generate data for the ellipses plot"""
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
            edp = _edp(t1, t2, patient2test[p][t1], patient2test[p][t2], p)
            ellipse_data.append(edp)

    return ellipse_data
