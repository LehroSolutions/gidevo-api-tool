import requests
from typing import Optional, Dict, Any

class ApiClient:
    def __init__(self, base_url: str, token: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        if token:
            self.session.headers['Authorization'] = f'Bearer {token}'

    def get(self, path: str) -> Dict[str, Any]:
        response = self.session.get(f'{self.base_url}{path}')
        response.raise_for_status()
        return response.json()

    def post(self, path: str, data: Dict[str, Any]) -> Dict[str, Any]:
        response = self.session.post(f'{self.base_url}{path}', json=data)
        response.raise_for_status()
        return response.json()