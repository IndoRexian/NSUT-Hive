from zoneinfo import ZoneInfo

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Config(BaseSettings):
    app_name: str = "RMP"
    debug: bool = False
    db_user: str = ""
    db_password: str = ""
    db_name: str = "RMP"
    db_url: str = ""

    APP_SECRET_KEY: str

    FERNET_KEY: bytes

    TZ: ZoneInfo = ZoneInfo("Asia/Kolkata")

    model_config = SettingsConfigDict(env_file=".env")


config = Config()
