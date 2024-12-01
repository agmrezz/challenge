from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

# Test data
MOCK_AEMET_RESPONSE = {
    "descripcion": "exito",
    "estado": 200,
    "datos": "https://opendata.aemet.es/mock_data",
    "metadatos": "https://opendata.aemet.es/mock_metadata"
}

MOCK_DATA = [
    {"fhora": "2024-01-01T00:00:00UTC", "temp": 20.5, "pres": 1013.2, "vel": 10.3},
    {"fhora": "2024-01-01T01:00:00UTC", "temp": 21.0, "pres": 1013.0, "vel": 11.0},
]


@pytest.fixture
def mock_requests_get():
    with patch('requests.get') as mock_get:
        def side_effect(url, **kwargs):
            class MockResponse:
                def json(self):
                    return MOCK_AEMET_RESPONSE if "opendata.aemet.es/opendata/api" in url else MOCK_DATA

            return MockResponse()

        mock_get.side_effect = side_effect
        yield mock_get


def test_get_antarctic_station_success(mock_requests_get):
    response = client.get(
        "/antarctic/Meteo Station Gabriel de Castilla",
        params={
            "start_date": "2024-01-01T00:00:00UTC",
            "end_date": "2024-01-01T23:59:59UTC"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all(field in data["2024-01-01T01:00:00+01:00"] for field in ["temp", "pres", "vel"])


def test_invalid_date_format():
    response = client.get(
        "/antarctic/Meteo Station Gabriel de Castilla",
        params={
            "start_date": "2024-01-01",  # Invalid format
            "end_date": "2024-01-02T00:00:00UTC"
        }
    )
    assert response.status_code == 400
    assert "Invalid start date format" in response.json()["detail"]


def test_invalid_date_range():
    response = client.get(
        "/antarctic/Meteo Station Gabriel de Castilla",
        params={
            "start_date": "2024-01-02T00:00:00UTC",
            "end_date": "2024-01-01T00:00:00UTC"  # End before start
        }
    )
    assert response.status_code == 400
    assert "start_date must be before end_date" in response.json()["detail"]


def test_field_filtering(mock_requests_get):
    response = client.get(
        "/antarctic/Meteo Station Gabriel de Castilla",
        params={
            "start_date": "2024-01-01T00:00:00UTC",
            "end_date": "2024-01-01T23:59:59UTC",
            "fields": ["temp", "pres"]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert all(field in data["2024-01-01T01:00:00+01:00"] for field in ["temp", "pres"])
    assert "vel" not in data["2024-01-01T01:00:00+01:00"]


def test_time_aggregation(mock_requests_get):
    response = client.get(
        "/antarctic/Meteo Station Gabriel de Castilla",
        params={
            "start_date": "2024-01-01T00:00:00UTC",
            "end_date": "2024-01-01T23:59:59UTC",
            "resolution": "Daily"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert all(field in data["2024-01-01T00:00:00+01:00"] for field in ["temp", "pres", "vel"])
