import os
import re
import xml.etree.ElementTree as ET
from testrail_api import TestRailAPI
from datetime import datetime

# Leer variables de entorno de GitHub Actions
EMAIL = os.environ.get('TESTRAIL_USERNAME') or os.environ.get('TESTRAIL_EMAIL')
API_KEY = os.environ['TESTRAIL_API_KEY']
URL = os.environ['TESTRAIL_URL']
PROJECT_ID = os.environ['TESTRAIL_PROJECT_ID']
SUITE_ID = os.environ['TESTRAIL_SUITE_ID']

# Validar que las variables críticas existan
required_vars = {
    'TESTRAIL_USERNAME or TESTRAIL_EMAIL': EMAIL,
    'TESTRAIL_API_KEY': API_KEY,
    'TESTRAIL_URL': URL,
    'TESTRAIL_PROJECT_ID': PROJECT_ID,
    'TESTRAIL_SUITE_ID': SUITE_ID
}

for var, value in required_vars.items():
    if not value:
        raise Exception(f"❌ Falta la variable de entorno requerida: {var}")

# ✅ IMPORTANTE: usar email=... en lugar de username=
api = TestRailAPI(URL, email=EMAIL, password=API_KEY)

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

# Procesar resultados por test case
reported_cases = 0
for testsuite in root.findall('testsuite'):
    for testcase in testsuite.findall('testcase'):
        name = testcase.get('name')

        match = re.search(r'C(\d+)', name)
        if not match:
            continue

        case_id = int(match.group(1))
        status_id = 1  # Passed

        if testcase.find('failure') is not None:
            status_id = 5  # Failed

        api.results.add_result_for_case(run_id, case_id, {
            "status_id": status_id,
            "comment": f"Resultado desde Cypress para {name}"
        })
        reported_cases += 1

print(f"✔️ {reported_cases} resultados reportados correctamente al Test Run ID: {run_id}")
