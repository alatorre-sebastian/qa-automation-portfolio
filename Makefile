# Makefile
.PHONY: start-aut stop-aut test-all test-playwright test-cypress test-selenium test-k6

start-aut:
	docker compose up -d
	@echo "Esperando a que la AUT esté disponible..."
	@until curl -s http://localhost:3000 > /dev/null; do sleep 2; done
	@echo "AUT disponible en http://localhost:3000"

stop-aut:
	docker compose down

test-playwright:
	cd tests/playwright && npx playwright test

test-cypress:
	cd tests/cypress && npx cypress run

test-selenium:
	cd tests/selenium && python -m pytest tests/ --html=reports/report.html

test-k6:
	cd tests/k6 && k6 run scripts/load-test.js

test-all: test-playwright test-cypress test-selenium test-k6
