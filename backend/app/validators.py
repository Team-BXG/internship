import re
import json
from fastapi import HTTPException

TEXT_RE = re.compile(r"^[a-zA-Z\s\-]+$")
DIGITS_RE = re.compile(r"^\d+$")


def validate_text(value: str, field: str, max_len: int = 30, required: bool = True) -> str:
    if value is None or str(value).strip() == "":
        if required:
            raise HTTPException(status_code=400, detail=f"{field} is required")
        return value
    value = str(value).strip()
    if len(value) > max_len:
        raise HTTPException(status_code=400, detail=f"{field} must be at most {max_len} characters")
    if not TEXT_RE.match(value):
        raise HTTPException(status_code=400, detail=f"{field} can only contain letters, spaces, and hyphens")
    return value


def validate_national_id(value: str, required: bool = True) -> str:
    if value is None or str(value).strip() == "":
        if required:
            raise HTTPException(status_code=400, detail="National ID is required")
        return value
    value = str(value).strip()
    if not DIGITS_RE.match(value) or len(value) != 12:
        raise HTTPException(status_code=400, detail="National ID must be exactly 12 digits")
    return value


def validate_phone(value: str, required: bool = True) -> str:
    if value is None or str(value).strip() == "":
        if required:
            raise HTTPException(status_code=400, detail="Phone number is required")
        return value
    value = str(value).strip()
    if not re.match(r"^(\+251\d{9}|0[79]\d{8})$", value):
        raise HTTPException(
            status_code=400,
            detail="Invalid Ethiopian phone format (e.g. 09xxxxxxxx or +2519xxxxxxxx)",
        )
    return value


def validate_non_negative_number(value, field: str, required: bool = False):
    if value is None or str(value).strip() == "":
        if required:
            raise HTTPException(status_code=400, detail=f"{field} is required")
        return value
    text = str(value).strip()
    if not DIGITS_RE.match(text):
        raise HTTPException(status_code=400, detail=f"{field} must be a non-negative number")
    if int(text) < 0:
        raise HTTPException(status_code=400, detail=f"{field} cannot be negative")
    return text


def validate_status(value: str, allowed: list[str], field: str = "status") -> str:
    if value not in allowed:
        raise HTTPException(status_code=400, detail=f"Invalid {field}. Allowed: {', '.join(allowed)}")
    return value


def parse_details_json(details_json: str | None) -> dict:
    if not details_json:
        return {}
    try:
        return json.loads(details_json)
    except json.JSONDecodeError:
        return {}


def validate_beneficiary_payload(data):
    data.full_name = validate_text(data.full_name, "Full name")
    if data.national_id and data.national_id != '-':
        data.national_id = validate_national_id(data.national_id)
    if data.phone:
        data.phone = validate_phone(data.phone)
    if data.village:
        data.village = validate_text(data.village, "Village", required=False)
    data.kebele = validate_non_negative_number(data.kebele, "Kebele", required=True)
    if data.status:
        validate_status(data.status, ["Pending", "Approved", "Correction Needed", "Assigned", "Beneficiary", "Rejected"])
    return data


def validate_demand_payload(data):
    data.full_name = validate_text(data.full_name, "Full name")
    if data.national_id and data.national_id != '-':
        data.national_id = validate_national_id(data.national_id)
    if data.phone:
        data.phone = validate_phone(data.phone)
    if data.village:
        data.village = validate_text(data.village, "Village", required=False)
    data.kebele = validate_non_negative_number(data.kebele, "Kebele", required=True)
    if data.status:
        validate_status(data.status, ["Pending", "Approved", "Correction Needed", "Assigned", "Beneficiary", "Rejected"])
    return data


def validate_problem_payload(data):
    data.beneficiary_name = validate_text(data.beneficiary_name, "Beneficiary name")
    data.kebele = validate_non_negative_number(data.kebele, "Kebele", required=True)
    if data.status:
        validate_status(data.status, ["Open", "Approved", "Seen", "Fixed", "Correction Needed"])
    allowed_levels = [
        "Functional",
        "Partially functional but in need of repair",
        "Not functional",
        "Abandoned or no longer exists",
    ]
    if data.title and data.title not in allowed_levels and not data.title.startswith("Issue"):
        validate_text(data.title, "Problem level", max_len=60)
    return data


def validate_supplier_payload(data):
    data.name = validate_text(data.name, "Company name")
    data.contact_person = validate_text(data.contact_person, "Contact person")
    data.contact_phone = validate_phone(data.contact_phone)
    data.address = validate_text(data.address, "Address", max_len=60)
    return data


def validate_contractor_payload(data):
    data.name = validate_text(data.name, "Contractor name")
    data.contact_person = validate_text(data.contact_person, "Contact person")
    data.contact_phone = validate_phone(data.contact_phone)
    data.address = validate_text(data.address, "Address", max_len=60)
    return data


def validate_agent_payload(data):
    data.name = validate_text(data.name, "Agent name")
    data.phone = validate_phone(data.phone)
    data.national_id = validate_national_id(data.national_id)
    return data
