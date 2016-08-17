from django.test import TestCase

from .utils import generate_ellipse_data, _edp


class UtilsTests(TestCase):

    def test__edp(self):
        test1 = 'AVLT-recognition_1_to_5'
        test2 = 'AVLT-total_1_to_5'
        pid = '22'
        x = -3.19
        y = -1.76

        edp = {'id': '22', 'y': -1.76, 'x': -3.19, 'test2': 'AVLT-total_1_to_5', 'test1': 'AVLT-recognition_1_to_5'}

        result = _edp(test1, test2, x, y, pid)

        self.assertEqual(result, edp)

    def test_generate_ellipse_data_pairs_in_correct_order(self):
        ncd = [{
          "multivariatedifference": -8.1007,
          "tails": "twoTailed",
          "testname": "AVLT-delayed_recall_1_to_5",
          "univariatep": "0.000",
          "plotname": "AVLT Delayed recall 1 to 5",
          "multivariateT": 10.3924,
          "univariatedf": 4597,
          "univariateT": -4.33,
          "multivariatedf": "3, 3778",
          "inneredge": -1.9605,
          "longtestname": "Auditory Verbal Learning Test (AVLT) Delayed recall 1 to 5 ",
          "id": "22",
          "univariatedifferences": -3.7317,
          "outeredge": 1.9605,
          "shortestname": "AVLT delayed recall 1 to 5",
          "multivariatep": "0.000"
        }, {
          "multivariatedifference": -8.1007,
          "tails": "twoTailed",
          "testname": "AVLT-total_1_to_5",
          "univariatep": "0.078",
          "plotname": "AVLT Total trial 1 to 5",
          "multivariateT": 10.3924,
          "univariatedf": 5075,
          "univariateT": -1.76,
          "multivariatedf": "3, 3778",
          "inneredge": -1.9604,
          "longtestname": "Auditory Verbal Learning Test (AVLT) Total trial 1 to 5 ",
          "id": "22",
          "univariatedifferences": -1.3565,
          "outeredge": 1.9604,
          "shortestname": "AVLT total 1 to 5",
          "multivariatep": "0.000"
        }]

        ed = [{'test2': 'AVLT-total_1_to_5', 'y': -1.76, 'id': '22', 'x': -4.33, 'test1': 'AVLT-delayed_recall_1_to_5'}]

        result = generate_ellipse_data(ncd)

        self.assertEqual(result, ed)

    def test_generate_ellipse_data_pairs_in_wrong_order(self):
        ncd = [{
          "multivariatedifference": -8.1007,
          "tails": "twoTailed",
          "testname": "AVLT-total_1_to_5",
          "univariatep": "0.078",
          "plotname": "AVLT Total trial 1 to 5",
          "multivariateT": 10.3924,
          "univariatedf": 5075,
          "univariateT": -1.76,
          "multivariatedf": "3, 3778",
          "inneredge": -1.9604,
          "longtestname": "Auditory Verbal Learning Test (AVLT) Total trial 1 to 5 ",
          "id": "22",
          "univariatedifferences": -1.3565,
          "outeredge": 1.9604,
          "shortestname": "AVLT total 1 to 5",
          "multivariatep": "0.000"
        }, {
          "multivariatedifference": -8.1007,
          "tails": "twoTailed",
          "testname": "AVLT-delayed_recall_1_to_5",
          "univariatep": "0.000",
          "plotname": "AVLT Delayed recall 1 to 5",
          "multivariateT": 10.3924,
          "univariatedf": 4597,
          "univariateT": -4.33,
          "multivariatedf": "3, 3778",
          "inneredge": -1.9605,
          "longtestname": "Auditory Verbal Learning Test (AVLT) Delayed recall 1 to 5 ",
          "id": "22",
          "univariatedifferences": -3.7317,
          "outeredge": 1.9605,
          "shortestname": "AVLT delayed recall 1 to 5",
          "multivariatep": "0.000"
        }]

        ed = [{'test2': 'AVLT-total_1_to_5', 'y': -1.76, 'id': '22', 'x': -4.33, 'test1': 'AVLT-delayed_recall_1_to_5'}]

        result = generate_ellipse_data(ncd)

        self.assertEqual(result, ed)
