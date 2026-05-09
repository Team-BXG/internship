from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class SupplierResponse(BaseModel):
    id: int
    name: str
    license_number: Optional[str] = None
    service_type: Optional[str] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    company_type: Optional[str] = None
    score: Optional[int] = 0
    status: Optional[str] = 'Active'

class SupplierCreate(BaseModel):
    name: str
    contact_person: str
    contact_phone: str
    license_number: str
    email: str
    address: str
    service_type: str
    company_type: Optional[str] = "Private Limited"

class SupplierDetailsResponse(SupplierResponse):
    coverage_zones: List[str] = []
    coverage_woredas: List[str] = []

class ContractorCreate(BaseModel):
    name: str
    service_type: str
    contact_person: str
    contact_phone: str
    address: str

class ContractorResponse(BaseModel):
    id: str
    name: str
    service_type: str
    contact_person: str
    contact_phone: str
    address: str
    status: str
    registered_date: str

class ZoneResponse(BaseModel):
    id: int
    name: str

class WoredaResponse(BaseModel):
    id: int
    zone_id: int
    name: str

class AreaOptionsResponse(BaseModel):
    suppliers: List[SupplierResponse]
    zones: List[ZoneResponse]
    woredas: List[WoredaResponse]

class AreaAssignmentCreate(BaseModel):
    supplier_id: int
    zone_id: int
    woreda_id: int
    kebele: str

class AgentCreate(BaseModel):
    name: str
    email: str
    phone: str
    national_id: str
    zone_id: int

class AgentResponse(AgentCreate):
    id: int
    status: str
    performance: int
    served: int
    zone_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class BeneficiaryCreate(BaseModel):
    full_name: str
    national_id: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    household_size: Optional[str] = None
    zone: str
    woreda: str
    kebele: str
    village: Optional[str] = None
    survey_type: str
    equipment_type: str
    supplier: Optional[str] = None
    details_json: Optional[str] = None
    status: Optional[str] = 'Pending Woreda'

class DemandCreate(BaseModel):
    full_name: str
    national_id: Optional[str] = None
    phone: Optional[str] = None
    zone: str
    woreda: str
    kebele: str
    village: Optional[str] = None
    gender: str
    has_disability: str
    service_type: str
    household_size: Optional[str] = None
    elderly_count: Optional[str] = None
    solar_panel_type: str
    watt_level: str
    details_json: Optional[str] = None
    status: Optional[str] = 'Pending Woreda Review'

class ProblemCreate(BaseModel):
    equipment: str
    title: str
    category: str
    zone: str
    woreda: str
    kebele: str
    urgency: str
    beneficiary_name: str
    submitted_by: str
    status: Optional[str] = 'Open'
    details_json: Optional[str] = None

class BeneficiaryStatusUpdate(BaseModel):
    status: str

class ProblemStatusUpdate(BaseModel):
    status: str

class DemandAssignSupplier(BaseModel):
    supplier_id: int


class DashboardStatsResponse(BaseModel):
    total_suppliers: int
    suppliers_trend: float
    registered_contractors: int
    contractors_trend: float
    total_beneficiaries: int
    beneficiaries_trend: float
    units_distributed: int
    units_trend: float
    active_zones: int
    pending_approvals: int
    pending_trend: float
    functional_systems: int
    functional_trend: float
    non_functional_systems: int
    non_functional_trend: float

    class Config:
        from_attributes = True

class ActivityLogResponse(BaseModel):
    id: int
    user: str
    action: str
    details: str
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True

class ChartDataPoint(BaseModel):
    month: str
    units_distributed: int
    beneficiaries: int

class EquipmentTypeData(BaseModel):
    name: str
    value: float

class BeneficiariesByZone(BaseModel):
    zone: str
    beneficiaries: int

class SupplierPerformance(BaseModel):
    supplier: str
    score: float

class FunctionalStatusData(BaseModel):
    name: str
    value: int

class DashboardDataResponse(BaseModel):
    stats: DashboardStatsResponse
    distribution_trend: List[ChartDataPoint]
    equipment_type: List[EquipmentTypeData]
    beneficiaries_by_zone: List[BeneficiariesByZone]
    supplier_performance: List[SupplierPerformance]
    functional_status: List[FunctionalStatusData]
    recent_activity: List[ActivityLogResponse]
