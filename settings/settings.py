from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Settings class that reads env files

    Attributes:
        aemet_jwt (str): The "API Key" for AEMET.
        aemet_base_url (str): The base URL for AEMET API. Defaults to "https://opendata.aemet.es/opendata/api".
    """

    # API Configuration
    aemet_jwt: str
    aemet_base_url: str = "https://opendata.aemet.es/opendata/api"

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache()
def get_settings() -> Settings:
    return Settings()
