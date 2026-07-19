import uuid


def new_id(prefix: str = "") -> str:
    raw = uuid.uuid4().hex[:12].upper()
    return f"{prefix}-{raw}" if prefix else raw


PROJECT_ID = "DC-TIER3-DEMO-001"
REQUIREMENT_UPS_AUTONOMY = "REQ-UPS-001"
SUB_VS019_AUTONOMY = "SUB-VS-019-AUTONOMY"
DEV_UPS_001 = "DEV-UPS-001"
EQUIP_UPS_A = "UPS-A"
PO_441 = "PO-441"
MS_UPS_A_DELIVERY = "MS-UPS-A-DELIVERY"
ACTIVITY_INSTALL = "A-2210"
ACTIVITY_FAT = "A-2190"
TEST_IST = "TEST-IST-UPS-A"
