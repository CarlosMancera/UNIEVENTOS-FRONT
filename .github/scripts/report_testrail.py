import os
import re
import xml.etree.ElementTree as ET
from testrail_api import TestRailAPI
from datetime import datetime

# Leer variables de entorno de GitHub Actions
USERNAME = os.environ['TESTRAIL_USERNAME']
API_KEY = os.environ['TESTRAIL_API_KEY']
URL = os.environ['TESTRAIL_URL']
PROJECT_ID = os.environ['TESTRAIL_PROJECT_ID']
SUITE_ID = os.environ['TESTRAIL_SUITE_ID']

api = TestRailAPI(URL, username=USERNAME, password=API_KEY)

# Crear nueva ejecución de prueba (Test Run)
run_name = f"CI - Cypress Run {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
run = api.runs.add_run(PROJECT_ID, {
    "suite_id": SUITE_ID,
    "name": run_name,
    "include_all": True
})
run_id = run['id']

# Leer resultados del archivo XML
tree = ET.parse('cypress/results/cypress-report.xml')
root = tree.getroot()

for testsuite in root.findall('testsuite'):
    for testcase in testsuite.findall('testcase'):
        name = testcase.get('name')

        match = re.search(r'C(\d+)', name)
        if not match:
            continue

        case_id = int(match.group(1))
        status_id = 1  # Passed por defecto

        if testcase.find('failure') is not None:
            status_id = 5  # Failed

        api.results.add_result_for_case(run_id, case_id, {
            "status_id": status_id,
            "comment": f"Resultado desde Cypress para {name}"
        })

print(f"✔️ Resultados reportados correctamente al Test Run ID: {run_id}")
