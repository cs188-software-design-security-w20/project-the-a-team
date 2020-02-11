import base64
import json
import os
import pathlib
import secrets
import sys
import unittest

import requests

os.chdir(os.path.dirname(os.path.realpath(sys.argv[0])))

config = json.loads(pathlib.Path('config.json').read_text())
backend_url_base = config['backend_url_base']
cookies = config['cookies']

BROWSER_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'


def transform_taxinfo_output(taxinfo):
    for form_name in ['fw2', 'f1099int', 'f1099b', 'f1099div', 'dependents']:
        taxinfo[form_name] = {form['uuid']: form for form in taxinfo[form_name]}
    return taxinfo


def is_deep_subset(haystack, needle):
    for key, value in needle.items():
        if key not in haystack:
            return False
        if isinstance(value, dict):
            if not is_deep_subset(haystack[key], value):
                return False
        elif haystack[key] != value:
            return False
    return True


class TestTaximus(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        r = requests.get(backend_url_base + '/auth', cookies=cookies)
        if not r.json():
            raise RuntimeError('Authentication failed, check your cookies')

    def test_GET_auth(self):
        r = requests.get(backend_url_base + '/auth')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json(), False)
        r = requests.get(backend_url_base + '/auth', cookies=cookies)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json(), True)

    def test_GET_auth_redirect(self):
        r = requests.get(backend_url_base + '/auth/redirect')
        self.assertEqual(r.status_code, 200)
        self.assertIn('<script>location.href = ', r.text)

    def test_GET_auth_logout(self):
        r = requests.get(backend_url_base + '/auth/logout', cookies=cookies, allow_redirects=False)
        self.assertEqual(r.status_code, 302)
        self.assertEqual(json.loads(base64.b64decode(r.cookies['session']).decode('ascii'))['passport'], {})

    def test_GET_POST_tax(self):
        # TODO: add more test cases
        success_cases = [
            {'lastName': ''},
            {'lastName': None},
            {'fw2': {'11111111-1111-1111-1111-111111111111': {'income': 12.34}}},
        ]

        fail_cases = [
            ({'lastName': 'A' * 256}, 'Last name is too long'),
        ]

        for test_case in success_cases:
            with self.subTest(test_case=test_case):
                r = requests.post(backend_url_base + '/tax', cookies=cookies, json=test_case)
                self.assertEqual(r.status_code, 204)
                r = requests.get(backend_url_base + '/tax', cookies=cookies)
                self.assertEqual(r.status_code, 200)
                self.assertTrue(is_deep_subset(transform_taxinfo_output(r.json()), test_case))

        for test_case in fail_cases:
            data, message = test_case
            with self.subTest(test_case=test_case):
                r = requests.post(backend_url_base + '/tax', cookies=cookies, json=data)
                self.assertEqual(r.status_code, 400)
                self.assertEqual(r.json()['message'], message)

    def test_GET_POST_tax_ignore_invalid_keys(self):
        r = requests.get(backend_url_base + '/tax', cookies=cookies)
        self.assertEqual(r.status_code, 200)
        ret1 = r.json()
        r = requests.post(backend_url_base + '/tax', cookies=cookies, json={'foo': 'bar'})
        self.assertEqual(r.status_code, 204)
        r = requests.get(backend_url_base + '/tax', cookies=cookies)
        self.assertEqual(r.status_code, 200)
        ret2 = r.json()
        self.assertEqual(ret1, ret2)
        rand_string = secrets.token_urlsafe(8)
        r = requests.post(backend_url_base + '/tax', cookies=cookies, json={'foo': 'bar', 'lastName': rand_string})
        self.assertEqual(r.status_code, 204)
        r = requests.get(backend_url_base + '/tax', cookies=cookies)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()['lastName'], rand_string)

    def test_404(self):
        r = requests.get(backend_url_base + '/nope')
        self.assertEqual(r.status_code, 404)
        self.assertEqual(r.json(), {'message': 'Invalid API endpoint or method'})
        r = requests.get(backend_url_base + '/nope', headers={'Accept': BROWSER_ACCEPT}, allow_redirects=False)
        self.assertEqual(r.status_code, 302)
        self.assertIn('Location', r.headers)

    def test_checkLogin(self):
        r = requests.get(backend_url_base + '/tax')
        self.assertEqual(r.status_code, 401)
        self.assertEqual(r.json(), {'message': 'Please login'})
        r = requests.get(backend_url_base + '/tax', headers={'Accept': BROWSER_ACCEPT}, allow_redirects=False)
        self.assertEqual(r.status_code, 302)
        self.assertIn('Location', r.headers)


if __name__ == '__main__':
    unittest.main()
