from loguru import logger


def setup_logging():
    logger.add(
        "aemet.log",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {module}:{function}:{line} | {message}",
        backtrace=True,
        diagnose=True
    )
