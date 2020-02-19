import base64
import copy
import json
import math
import os
import pathlib
import random
import string
import sys
import unittest
import uuid

import requests
from requests_futures.sessions import FuturesSession

os.chdir(os.path.dirname(os.path.realpath(sys.argv[0])))

config = json.loads(pathlib.Path('config.json').read_text())
backend_url_base = config['backend_url_base']
cookies = config['cookies']
num_requests = config['num_requests']

BROWSER_ACCEPT = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
MAX_MONEY = 90071992547409.9
MAX_STRING = 255


rnd = random.SystemRandom()


def transform_taxinfo_output(taxinfo):
    result = copy.deepcopy(taxinfo)
    for form_name in ['fw2', 'f1099int', 'f1099b', 'f1099div', 'dependents']:
        result[form_name] = {form['uuid']: form for form in taxinfo[form_name]}
    return result


def is_deep_subset(haystack, needle, *, float_tolerance=False):
    for key, value in needle.items():
        if key not in haystack:
            return False
        if isinstance(value, dict):
            if not is_deep_subset(haystack[key], value):
                return False
        elif float_tolerance and isinstance(haystack[key], float) and isinstance(value, float):
            if not math.isclose(haystack[key], value):
                return False
        elif haystack[key] != value:
            return False
    return True


def uuid_lower(taxinfo):
    result = copy.deepcopy(taxinfo)
    for form_name in ['fw2', 'f1099int', 'f1099b', 'f1099div', 'dependents']:
        result[form_name] = {key.lower(): value for key, value in taxinfo.get(form_name, {}).items()}
    return result


def random_string(length=32):
    return ''.join(rnd.choice(string.printable) for _ in range(length))


def random_digits(length):
    return ''.join(rnd.choice(string.digits) for _ in range(length))


def random_money(scale=MAX_MONEY):
    return round(rnd.uniform(-scale, scale), 2)


def random_two_different(rand_func, *args, **kwargs):
    while True:
        rand_value1 = rand_func(*args, **kwargs)
        rand_value2 = rand_func(*args, **kwargs)
        if rand_value1 != rand_value2:
            return (rand_value1, rand_value2)


request_old = requests.api.request


def request_with_retry(*args, **kwargs):
    while True:
        r = request_old(*args, **kwargs)
        if r.status_code != 429:
            return r


def patch_requests_with_retry():
    requests.api.request = request_with_retry


def unpatch_requests_with_retry():
    requests.api.request = request_old


class TestTaximus(unittest.TestCase):
    @classmethod
    def boolean_success_cases(cls):
        yield from [True, False, None]

    @classmethod
    def boolean_fail_cases(cls):
        yield from [
            (1, 'should be boolean'),
            (1.1, 'should be boolean'),
            ('', 'should be boolean'),
            ([], 'should be boolean'),
            ({}, 'should be boolean'),
        ]

    @classmethod
    def money_success_cases(cls):
        yield random_money()
        yield random_money(10e9)
        yield random_money(10e7)
        yield random_money(10e5)
        yield random_money(10e3)
        yield int(random_money())
        yield int(random_money(10e9))
        yield int(random_money(10e7))
        yield int(random_money(10e5))
        yield int(random_money(10e3))
        yield -MAX_MONEY
        yield MAX_MONEY
        yield None

    @classmethod
    def money_fail_cases(cls):
        yield from [
            (False, 'should be a number'),
            ('', 'should be a number'),
            ([], 'should be a number'),
            ({}, 'should be a number'),
            (MAX_MONEY + 0.02, 'out of range'),
            (-MAX_MONEY - 0.02, 'out of range'),
        ]

    @classmethod
    def string_success_cases(cls):
        yield from ['', '\'"', 'A' * MAX_STRING, None]
        yield random_string()

    @classmethod
    def string_fail_cases(cls):
        yield from [
            (False, 'should be string'),
            (1, 'should be string'),
            (1.1, 'should be string'),
            ([], 'should be string'),
            ({}, 'should be string'),
            ('A' * (MAX_STRING + 1), 'is too long'),
        ]

    @classmethod
    def object_fail_cases(cls):
        yield from [
            (None, 'should be an object'),
            (False, 'should be an object'),
            (1, 'should be an object'),
            (1.1, 'should be an object'),
            ('', 'should be an object'),
            ([], 'should be an object'),
        ]

    @classmethod
    def object_value_fail_cases(cls):
        yield from [
            (False, 'should be an object or null'),
            (1, 'should be an object or null'),
            (1.1, 'should be an object or null'),
            ('', 'should be an object or null'),
            ([], 'should be an object or null'),
        ]

    @classmethod
    def uuid_success_cases(cls):
        yield str(uuid.uuid4())
        yield str(uuid.uuid4()).upper()

    @classmethod
    def uuid_fail_cases(cls):
        yield from [
            ('', 'is not valid UUID'),
            ('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'is not valid UUID'),
        ]

    @classmethod
    def ssn_success_cases(cls):
        yield from ['', None]
        yield random_digits(9)

    @classmethod
    def ssn_fail_cases(cls):
        yield from [
            (False, 'should be string'),
            (1, 'should be string'),
            (1.1, 'should be string'),
            ([], 'should be string'),
            ({}, 'should be string'),
            ('nopenopex', 'should be 9 digits'),
        ]

    @classmethod
    def bank_account_success_cases(cls):
        yield from ['', None]
        yield random_digits(9)
        yield random_digits(17)

    @classmethod
    def bank_account_fail_cases(cls):
        yield from [
            (False, 'should be string'),
            (1, 'should be string'),
            (1.1, 'should be string'),
            ([], 'should be string'),
            ({}, 'should be string'),
            ('nope', 'should only contain digits'),
            (random_digits(18), 'is too long'),
        ]

    @classmethod
    def bank_routing_success_cases(cls):
        yield from ['', None]
        yield random_digits(8)
        yield random_digits(9)

    @classmethod
    def bank_routing_fail_cases(cls):
        yield from [
            (False, 'should be string'),
            (1, 'should be string'),
            (1.1, 'should be string'),
            ([], 'should be string'),
            ({}, 'should be string'),
            ('nope', 'should only contain digits'),
            (random_digits(10), 'is too long'),
        ]

    @classmethod
    def setUpClass(cls):
        r = requests.get(backend_url_base + '/auth', cookies=cookies)
        if not r.json():
            raise RuntimeError('Authentication failed, check your cookies')

    def setUp(self):
        patch_requests_with_retry()

    def tearDown(self):
        r = requests.delete(backend_url_base + '/tax', cookies=cookies)
        self.assertEqual(r.status_code, 204)
        unpatch_requests_with_retry()

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

    def test_POST_tax(self):
        success_cases = []

        for sc in self.string_success_cases():
            success_cases.append({'lastName': sc})
        for sc in self.string_success_cases():
            success_cases.append({'firstName': sc})
        for sc in self.string_success_cases():
            success_cases.append({'middleName': sc})
        for sc in self.ssn_success_cases():
            success_cases.append({'ssn': sc})
        for sc in self.string_success_cases():
            success_cases.append({'spouseName': sc})
        for sc in self.ssn_success_cases():
            success_cases.append({'spouseSSN': sc})
        for sc in self.string_success_cases():
            success_cases.append({'addr1': sc})
        for sc in self.string_success_cases():
            success_cases.append({'addr2': sc})
        for sc in self.string_success_cases():
            success_cases.append({'addr3': sc})
        for sc in self.bank_account_success_cases():
            success_cases.append({'bankAccount': sc})
        for sc in self.bank_routing_success_cases():
            success_cases.append({'bankRouting': sc})
        for sc in self.boolean_success_cases():
            success_cases.append({'bankIsChecking': sc})
        for sc in self.uuid_success_cases():
            success_cases.append({'fw2': {sc: {}}})
        for sc in self.uuid_success_cases():
            success_cases.append({'f1099int': {sc: {}}})
        for sc in self.uuid_success_cases():
            success_cases.append({'f1099b': {sc: {}}})
        for sc in self.uuid_success_cases():
            success_cases.append({'f1099div': {sc: {}}})
        for sc in self.uuid_success_cases():
            success_cases.append({'dependents': {sc: {}}})
        for sc in self.string_success_cases():
            success_cases.append({'fw2': {str(uuid.uuid4()): {'employer': sc}}})
        for sc in self.money_success_cases():
            success_cases.append({'fw2': {str(uuid.uuid4()): {'income': sc}}})
        for sc in self.money_success_cases():
            success_cases.append({'fw2': {str(uuid.uuid4()): {'taxWithheld': sc}}})
        for sc in self.string_success_cases():
            success_cases.append({'f1099int': {str(uuid.uuid4()): {'payer': sc}}})
        for sc in self.money_success_cases():
            success_cases.append({'f1099int': {str(uuid.uuid4()): {'income': sc}}})
        for sc in self.money_success_cases():
            success_cases.append({'f1099int': {str(uuid.uuid4()): {'usSavingTreasInterest': sc}}})
        for sc in self.money_success_cases():
            success_cases.append({'f1099int': {str(uuid.uuid4()): {'taxWithheld': sc}}})
        for sc in self.money_success_cases():
            success_cases.append({'f1099int': {str(uuid.uuid4()): {'taxExemptInterest': sc}}})
        for sc in self.string_success_cases():
            success_cases.append({'f1099b': {str(uuid.uuid4()): {'desc': sc}}})
        for sc in self.money_success_cases():
            success_cases.append({'f1099b': {str(uuid.uuid4()): {'proceeds': sc}}})
        for sc in self.money_success_cases():
            success_cases.append({'f1099b': {str(uuid.uuid4()): {'basis': sc}}})
        for sc in self.boolean_success_cases():
            success_cases.append({'f1099b': {str(uuid.uuid4()): {'isLongTerm': sc}}})
        for sc in self.money_success_cases():
            success_cases.append({'f1099b': {str(uuid.uuid4()): {'taxWithheld': sc}}})
        for sc in self.string_success_cases():
            success_cases.append({'f1099div': {str(uuid.uuid4()): {'payer': sc}}})
        for sc in self.money_success_cases():
            success_cases.append({'f1099div': {str(uuid.uuid4()): {'ordDividends': sc}}})
        for sc in self.money_success_cases():
            success_cases.append({'f1099div': {str(uuid.uuid4()): {'qualDividends': sc}}})
        for sc in self.money_success_cases():
            success_cases.append({'f1099div': {str(uuid.uuid4()): {'taxWithheld': sc}}})
        for sc in self.money_success_cases():
            success_cases.append({'f1099div': {str(uuid.uuid4()): {'exemptInterestDiv': sc}}})
        for sc in self.string_success_cases():
            success_cases.append({'dependents': {str(uuid.uuid4()): {'name': sc}}})
        for sc in self.ssn_success_cases():
            success_cases.append({'dependents': {str(uuid.uuid4()): {'ssn': sc}}})
        for sc in self.string_success_cases():
            success_cases.append({'dependents': {str(uuid.uuid4()): {'relation': sc}}})
        for sc in self.boolean_success_cases():
            success_cases.append({'dependents': {str(uuid.uuid4()): {'childCredit': sc}}})

        rand_uuid1 = str(uuid.uuid4())
        rand_uuid2 = str(uuid.uuid4())
        success_cases.append({
            "lastName": random_string(),
            "firstName": random_string(),
            "middleName": random_string(),
            "ssn": random_digits(9),
            "spouseName": random_string(),
            "addr1": random_string(),
            "addr2": None,
            "addr3": random_string(),
            "bankAccount": random_digits(9),
            "bankRouting": random_digits(9),
            "bankIsChecking": None,
            "fw2": {
                rand_uuid1: {
                    "employer": random_string(),
                    "income": None,
                    "taxWithheld": random_money()
                }
            },
            "f1099int": {
                rand_uuid2: {
                    "payer": None,
                    "usSavingTreasInterest": random_money(10e9),
                    "taxWithheld": random_money(10e7),
                    "taxExemptInterest": None
                }
            },
            "f1099b": {
                rand_uuid1: {
                    "desc": random_string(),
                    "proceeds": None,
                    "basis": random_money(),
                    "isLongTerm": True,
                    "taxWithheld": random_money()
                }
            },
            "f1099div": {
                rand_uuid2.upper(): {
                    "payer": "",
                    "ordDividends": random_money(),
                    "qualDividends": random_money(10e5),
                    "taxWithheld": random_money(),
                    "exemptInterestDiv": random_money(10e3)
                }
            },
            "dependents": {
                rand_uuid1.upper(): {
                    "name": random_string(),
                    "ssn": None,
                    "relation": "",
                    "childCredit": False
                }
            }
        })

        fail_cases = []

        for fc in self.string_fail_cases():
            fail_cases.append(({'lastName': fc[0]}, 'Last name {}'.format(fc[1])))
        for fc in self.string_fail_cases():
            fail_cases.append(({'firstName': fc[0]}, 'First name {}'.format(fc[1])))
        for fc in self.string_fail_cases():
            fail_cases.append(({'middleName': fc[0]}, 'Middle name {}'.format(fc[1])))
        for fc in self.ssn_fail_cases():
            fail_cases.append(({'ssn': fc[0]}, 'SSN {}'.format(fc[1])))
        for fc in self.string_fail_cases():
            fail_cases.append(({'spouseName': fc[0]}, 'Spouse name {}'.format(fc[1])))
        for fc in self.ssn_fail_cases():
            fail_cases.append(({'spouseSSN': fc[0]}, 'Spouse SSN {}'.format(fc[1])))
        for fc in self.string_fail_cases():
            fail_cases.append(({'addr1': fc[0]}, 'Address 1 {}'.format(fc[1])))
        for fc in self.string_fail_cases():
            fail_cases.append(({'addr2': fc[0]}, 'Address 2 {}'.format(fc[1])))
        for fc in self.string_fail_cases():
            fail_cases.append(({'addr3': fc[0]}, 'Address 3 {}'.format(fc[1])))
        for fc in self.bank_account_fail_cases():
            fail_cases.append(({'bankAccount': fc[0]}, 'Bank account {}'.format(fc[1])))
        for fc in self.bank_routing_fail_cases():
            fail_cases.append(({'bankRouting': fc[0]}, 'Bank routing {}'.format(fc[1])))
        for fc in self.boolean_fail_cases():
            fail_cases.append(({'bankIsChecking': fc[0]}, 'Bank is checking {}'.format(fc[1])))
        for fc in self.object_fail_cases():
            fail_cases.append(({'fw2': fc[0]}, 'Fw2 {}'.format(fc[1])))
        for fc in self.object_fail_cases():
            fail_cases.append(({'f1099int': fc[0]}, 'F1099int {}'.format(fc[1])))
        for fc in self.object_fail_cases():
            fail_cases.append(({'f1099b': fc[0]}, 'F1099b {}'.format(fc[1])))
        for fc in self.object_fail_cases():
            fail_cases.append(({'f1099div': fc[0]}, 'F1099div {}'.format(fc[1])))
        for fc in self.object_fail_cases():
            fail_cases.append(({'dependents': fc[0]}, 'Dependents {}'.format(fc[1])))
        for fc in self.uuid_fail_cases():
            fail_cases.append(({'fw2': {fc[0]: {}}}, 'Fw2 key {}'.format(fc[1])))
        for fc in self.uuid_fail_cases():
            fail_cases.append(({'f1099int': {fc[0]: {}}}, 'F1099int key {}'.format(fc[1])))
        for fc in self.uuid_fail_cases():
            fail_cases.append(({'f1099b': {fc[0]: {}}}, 'F1099b key {}'.format(fc[1])))
        for fc in self.uuid_fail_cases():
            fail_cases.append(({'f1099div': {fc[0]: {}}}, 'F1099div key {}'.format(fc[1])))
        for fc in self.uuid_fail_cases():
            fail_cases.append(({'dependents': {fc[0]: {}}}, 'Dependents key {}'.format(fc[1])))
        for fc in self.object_value_fail_cases():
            fail_cases.append(({'fw2': {str(uuid.uuid4()): fc[0]}}, 'Fw2 value {}'.format(fc[1])))
        for fc in self.object_value_fail_cases():
            fail_cases.append(({'f1099int': {str(uuid.uuid4()): fc[0]}}, 'F1099int value {}'.format(fc[1])))
        for fc in self.object_value_fail_cases():
            fail_cases.append(({'f1099b': {str(uuid.uuid4()): fc[0]}}, 'F1099b value {}'.format(fc[1])))
        for fc in self.object_value_fail_cases():
            fail_cases.append(({'f1099div': {str(uuid.uuid4()): fc[0]}}, 'F1099div value {}'.format(fc[1])))
        for fc in self.object_value_fail_cases():
            fail_cases.append(({'dependents': {str(uuid.uuid4()): fc[0]}}, 'Dependents value {}'.format(fc[1])))
        for fc in self.string_fail_cases():
            fail_cases.append(({'fw2': {str(uuid.uuid4()): {'employer': fc[0]}}}, 'Fw2 employer {}'.format(fc[1])))
        for fc in self.money_fail_cases():
            fail_cases.append(({'fw2': {str(uuid.uuid4()): {'income': fc[0]}}}, 'Fw2 income {}'.format(fc[1])))
        for fc in self.money_fail_cases():
            fail_cases.append(({'fw2': {str(uuid.uuid4()): {'taxWithheld': fc[0]}}}, 'Fw2 tax withheld {}'.format(fc[1])))
        for fc in self.string_fail_cases():
            fail_cases.append(({'f1099int': {str(uuid.uuid4()): {'payer': fc[0]}}}, 'F1099int payer {}'.format(fc[1])))
        for fc in self.money_fail_cases():
            fail_cases.append(({'f1099int': {str(uuid.uuid4()): {'income': fc[0]}}}, 'F1099int income {}'.format(fc[1])))
        for fc in self.money_fail_cases():
            fail_cases.append(({'f1099int': {str(uuid.uuid4()): {'usSavingTreasInterest': fc[0]}}}, 'F1099int Interest on U.S. Savings Bonds and Treas. obligations {}'.format(fc[1])))
        for fc in self.money_fail_cases():
            fail_cases.append(({'f1099int': {str(uuid.uuid4()): {'taxWithheld': fc[0]}}}, 'F1099int tax withheld {}'.format(fc[1])))
        for fc in self.money_fail_cases():
            fail_cases.append(({'f1099int': {str(uuid.uuid4()): {'taxExemptInterest': fc[0]}}}, 'F1099int tax-exempt interest {}'.format(fc[1])))
        for fc in self.string_fail_cases():
            fail_cases.append(({'f1099b': {str(uuid.uuid4()): {'desc': fc[0]}}}, 'F1099b desc {}'.format(fc[1])))
        for fc in self.money_fail_cases():
            fail_cases.append(({'f1099b': {str(uuid.uuid4()): {'proceeds': fc[0]}}}, 'F1099b proceeds {}'.format(fc[1])))
        for fc in self.money_fail_cases():
            fail_cases.append(({'f1099b': {str(uuid.uuid4()): {'basis': fc[0]}}}, 'F1099b basis {}'.format(fc[1])))
        for fc in self.boolean_fail_cases():
            fail_cases.append(({'f1099b': {str(uuid.uuid4()): {'isLongTerm': fc[0]}}}, 'F1099b is long term {}'.format(fc[1])))
        for fc in self.money_fail_cases():
            fail_cases.append(({'f1099b': {str(uuid.uuid4()): {'taxWithheld': fc[0]}}}, 'F1099b tax withheld {}'.format(fc[1])))
        for fc in self.string_fail_cases():
            fail_cases.append(({'f1099div': {str(uuid.uuid4()): {'payer': fc[0]}}}, 'F1099div payer {}'.format(fc[1])))
        for fc in self.money_fail_cases():
            fail_cases.append(({'f1099div': {str(uuid.uuid4()): {'ordDividends': fc[0]}}}, 'F1099div ord dividends {}'.format(fc[1])))
        for fc in self.money_fail_cases():
            fail_cases.append(({'f1099div': {str(uuid.uuid4()): {'qualDividends': fc[0]}}}, 'F1099div qual dividends {}'.format(fc[1])))
        for fc in self.money_fail_cases():
            fail_cases.append(({'f1099div': {str(uuid.uuid4()): {'taxWithheld': fc[0]}}}, 'F1099div tax withheld {}'.format(fc[1])))
        for fc in self.money_fail_cases():
            fail_cases.append(({'f1099div': {str(uuid.uuid4()): {'exemptInterestDiv': fc[0]}}}, 'F1099div exempt interest div {}'.format(fc[1])))
        for fc in self.string_fail_cases():
            fail_cases.append(({'dependents': {str(uuid.uuid4()): {'name': fc[0]}}}, 'Dependents name {}'.format(fc[1])))
        for fc in self.ssn_fail_cases():
            fail_cases.append(({'dependents': {str(uuid.uuid4()): {'ssn': fc[0]}}}, 'Dependents SSN {}'.format(fc[1])))
        for fc in self.string_fail_cases():
            fail_cases.append(({'dependents': {str(uuid.uuid4()): {'relation': fc[0]}}}, 'Dependents relation {}'.format(fc[1])))
        for fc in self.boolean_fail_cases():
            fail_cases.append(({'dependents': {str(uuid.uuid4()): {'childCredit': fc[0]}}}, 'Dependents child credit {}'.format(fc[1])))

        for test_case in success_cases:
            with self.subTest(test_case=test_case):
                self.setUp()
                r = requests.post(backend_url_base + '/tax', cookies=cookies, json=test_case)
                self.assertEqual(r.status_code, 204)
                r = requests.get(backend_url_base + '/tax', cookies=cookies)
                self.assertEqual(r.status_code, 200)
                result = transform_taxinfo_output(r.json())
                expected = uuid_lower(test_case)
                self.assertTrue(is_deep_subset(result, expected, float_tolerance=True))
                self.tearDown()

        for test_case in fail_cases:
            data, message = test_case
            with self.subTest(test_case=test_case):
                self.setUp()
                r = requests.post(backend_url_base + '/tax', cookies=cookies, json=data)
                self.assertEqual(r.status_code, 400)
                self.assertEqual(r.json()['message'], message)
                self.tearDown()

        with self.subTest(test_case='ignore_invalid_keys'):
            self.setUp()
            r = requests.get(backend_url_base + '/tax', cookies=cookies)
            self.assertEqual(r.status_code, 200)
            ret1 = r.json()
            r = requests.post(backend_url_base + '/tax', cookies=cookies, json={'foo': 'bar'})
            self.assertEqual(r.status_code, 204)
            r = requests.get(backend_url_base + '/tax', cookies=cookies)
            self.assertEqual(r.status_code, 200)
            ret2 = r.json()
            self.assertEqual(ret1, ret2)
            rand_string = random_string()
            r = requests.post(backend_url_base + '/tax', cookies=cookies, json={'foo': 'bar', 'lastName': rand_string})
            self.assertEqual(r.status_code, 204)
            r = requests.get(backend_url_base + '/tax', cookies=cookies)
            self.assertEqual(r.status_code, 200)
            self.assertEqual(r.json()['lastName'], rand_string)
            self.tearDown()

        with self.subTest(test_case='update_object'):
            self.setUp()
            rand_uuid = str(uuid.uuid4())
            rand_string1, rand_string2 = random_two_different(random_string)
            r = requests.post(backend_url_base + '/tax', cookies=cookies, json={'fw2': {rand_uuid: {'employer': rand_string1}}})
            self.assertEqual(r.status_code, 204)
            r = requests.get(backend_url_base + '/tax', cookies=cookies)
            self.assertEqual(r.status_code, 200)
            self.assertEqual([item for item in r.json()['fw2'] if item['uuid'] == rand_uuid][0]['employer'], rand_string1)
            r = requests.post(backend_url_base + '/tax', cookies=cookies, json={'fw2': {rand_uuid: {'employer': rand_string2}}})
            self.assertEqual(r.status_code, 204)
            r = requests.get(backend_url_base + '/tax', cookies=cookies)
            self.assertEqual(r.status_code, 200)
            self.assertEqual([item for item in r.json()['fw2'] if item['uuid'] == rand_uuid][0]['employer'], rand_string2)
            self.tearDown()

        with self.subTest(test_case='undefined_does_not_change_value'):
            self.setUp()
            rand_string1, rand_string2 = random_two_different(random_string)
            r = requests.post(backend_url_base + '/tax', cookies=cookies, json={'addr1': rand_string1})
            self.assertEqual(r.status_code, 204)
            r = requests.get(backend_url_base + '/tax', cookies=cookies)
            self.assertEqual(r.status_code, 200)
            ret1 = r.json()
            r = requests.post(backend_url_base + '/tax', cookies=cookies, json={'addr2': rand_string2})
            self.assertEqual(r.status_code, 204)
            r = requests.get(backend_url_base + '/tax', cookies=cookies)
            self.assertEqual(r.status_code, 200)
            ret2 = r.json()
            self.assertEqual(ret1['addr1'], rand_string1)
            self.assertEqual(ret1['addr1'], ret2['addr1'])
            self.assertEqual(ret2['addr2'], rand_string2)
            self.tearDown()

        with self.subTest(test_case='null_subitem_deletion'):
            for form_name in ['fw2', 'f1099int', 'f1099b', 'f1099div', 'dependents']:
                self.setUp()
                rand_uuid = str(uuid.uuid4())
                r = requests.post(backend_url_base + '/tax', cookies=cookies, json={form_name: {rand_uuid: {}}})
                self.assertEqual(r.status_code, 204)
                r = requests.get(backend_url_base + '/tax', cookies=cookies)
                self.assertEqual(r.status_code, 200)
                self.assertEqual(sum(item['uuid'] == rand_uuid for item in r.json()[form_name]), 1)
                r = requests.post(backend_url_base + '/tax', cookies=cookies, json={form_name: {rand_uuid: None}})
                self.assertEqual(r.status_code, 204)
                r = requests.get(backend_url_base + '/tax', cookies=cookies)
                self.assertEqual(r.status_code, 200)
                self.assertEqual(sum(item['uuid'] == rand_uuid for item in r.json()[form_name]), 0)
                self.tearDown()

    def test_prototype_pollution(self):
        r = requests.post(backend_url_base + '/tax', cookies=cookies, json={
            'constructor': {},
            '__proto__': {
                'toString': {}
            },
            'toString': {}
        })
        self.assertEqual(r.status_code, 204)

    def test_pdf(self):
        rand_account1, rand_account2 = random_two_different(random_digits, 9)
        r = requests.post(backend_url_base + '/tax', cookies=cookies, json={'bankAccount': rand_account1})
        self.assertEqual(r.status_code, 204)
        r = requests.get(backend_url_base + '/tax/pdf', cookies=cookies)
        pdf1 = r.content
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.headers['Content-Type'], 'application/pdf')
        self.assertEqual(pdf1[:4], b'%PDF')
        r = requests.get(backend_url_base + '/tax/pdf', cookies=cookies)
        pdf2 = r.content
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.headers['Content-Type'], 'application/pdf')
        self.assertEqual(pdf2[:4], b'%PDF')
        self.assertEqual(pdf1, pdf2)
        r = requests.post(backend_url_base + '/tax', cookies=cookies, json={'bankAccount': rand_account2})
        self.assertEqual(r.status_code, 204)
        r = requests.get(backend_url_base + '/tax/pdf', cookies=cookies)
        pdf3 = r.content
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.headers['Content-Type'], 'application/pdf')
        self.assertEqual(pdf3[:4], b'%PDF')
        self.assertNotEqual(pdf1, pdf3)
        self.assertNotEqual(pdf2, pdf3)

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

    def test_request_limit(self):
        unpatch_requests_with_retry()
        session = FuturesSession()
        rs = [session.get(backend_url_base + '/tax') for _ in range(num_requests)]
        rs = [r.result() for r in rs]
        self.assertTrue(any(r.status_code == 429 for r in rs))
        self.assertTrue(any(r.json() == {'message': 'Too many requests, please try again later.'} for r in rs))

    def test_POST_tax_size_limit(self):
        r = requests.post(backend_url_base + '/tax', cookies=cookies, json='A' * 1048577)
        self.assertEqual(r.status_code, 413)
        r = requests.post(backend_url_base + '/tax', cookies=cookies, json='A' * 10000)
        self.assertNotEqual(r.status_code, 413)

    def test_POST_tax_subitem_limit(self):
        max_subitem = 20
        for form_name in ['fw2', 'f1099int', 'f1099b', 'f1099div', 'dependents']:
            self.setUp()
            for i in range(max_subitem):
                form_uuid = '11111111-1111-1111-1111-{}'.format(111111111111 + i)
                r = requests.post(backend_url_base + '/tax', cookies=cookies, json={form_name: {form_uuid: {}}})
                self.assertEqual(r.status_code, 204)
            form_uuid = '11111111-1111-1111-1111-000000000000'
            r = requests.post(backend_url_base + '/tax', cookies=cookies, json={form_name: {form_uuid: {}}})
            self.assertEqual(r.status_code, 400)
            self.assertEqual(r.json()['message'], 'You cannot have more than {} {}'.format(max_subitem, form_name))
            self.tearDown()
        for form_name in ['fw2', 'f1099int', 'f1099b', 'f1099div', 'dependents']:
            self.setUp()
            r = requests.post(backend_url_base + '/tax', cookies=cookies, json={form_name: {
                '11111111-1111-1111-1111-{}'.format(111111111111 + i): {} for i in range(max_subitem + 1)
            }})
            self.assertEqual(r.status_code, 400)
            self.assertEqual(r.json()['message'], 'You cannot create or update more than {} {}'.format(max_subitem, form_name))
            self.tearDown()
        for form_name in ['fw2', 'f1099int', 'f1099b', 'f1099div', 'dependents']:
            self.setUp()
            r = requests.post(backend_url_base + '/tax', cookies=cookies, json={form_name: {
                '11111111-1111-1111-1111-{}'.format(111111111111 + i): None for i in range(max_subitem + 1)
            }})
            self.assertEqual(r.status_code, 400)
            self.assertEqual(r.json()['message'], 'You cannot delete more than {} {}'.format(max_subitem, form_name))
            self.tearDown()
        for form_name in ['fw2', 'f1099int', 'f1099b', 'f1099div', 'dependents']:
            self.setUp()
            r = requests.post(backend_url_base + '/tax', cookies=cookies, json={form_name: {
                '11111111-1111-1111-1111-{}'.format(111111111111 + i): {} for i in range(max_subitem)
            }})
            self.assertEqual(r.status_code, 204)
            r = requests.post(backend_url_base + '/tax', cookies=cookies, json={form_name: {
                **{
                    '11111111-1111-1111-1111-{}'.format(111111111111 + i): None for i in range(max_subitem // 2)
                }, **{
                    '21111111-1111-1111-1111-{}'.format(111111111111 + i): {} for i in range(max_subitem // 2)
                }
            }})
            self.assertEqual(r.status_code, 204)
            self.tearDown()


if __name__ == '__main__':
    unittest.main()
