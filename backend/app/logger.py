import logging
import sys
import os

# Create a logger object
logger = logging.getLogger("sedms_app")
logger.setLevel(logging.INFO)

# Formatter for log messages
formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# 1. Console Handler (Outputs to terminal)
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# 2. File Handler (Saves to a local file in the backend directory)
log_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "system.log")
file_handler = logging.FileHandler(log_file_path)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# 3. Better Stack (Logtail) Handler Setup
source_token = os.environ.get("LOGTAIL_SOURCE_TOKEN")
if source_token:
    try:
        from logtail import LogtailHandler
        handler = LogtailHandler(source_token=source_token)
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.info("Logtail Better Stack Integration Activated!")
    except ImportError:
        logger.warning("Logtail token found, but logtail-python is not installed.")

def get_logger():
    return logger
