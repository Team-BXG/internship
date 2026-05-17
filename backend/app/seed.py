from app.database import init_db, get_db_connection
import datetime

def seed_data():
    init_db()
    conn = get_db_connection()
    c = conn.cursor()
    
    c.execute('''
        INSERT INTO dashboard_stats (
            id, total_suppliers, suppliers_trend, total_beneficiaries, beneficiaries_trend,
            units_distributed, units_trend, active_zones, pending_approvals, pending_trend,
            equipment_issues, issues_trend
        ) VALUES (1, 124, 12.0, 45280, 8.0, 41289, 15.0, 11, 342, -4.0, 28, -6.0)
    ''')
    
    suppliers = [
        ("Solar Solutions Ethiopia PLC", "LIC-2024-001", "Home Solar System", "Abebe Kebede", "+251 911 001 001", "info@solarsolutions.et", "Bahir Dar, Amhara", "Private Limited", 92, "Active"),
        ("SunPower Technologies Ltd", "LIC-2024-002", "Solar Lantern", "Meron Tadesse", "+251 912 002 002", "contact@sunpower.et", "Gondar, Amhara", "Private Limited", 87, "Active"),
        ("Green Energy Amhara", "LIC-2024-003", "Off-grid Solar Grid", "Daniel Yohannes", "+251 913 003 003", "hello@greenenergy.et", "Dessie, Amhara", "Share Company", 79, "Active"),
        ("Amhara Solar Cooperative", "LIC-2024-004", "Institutional Solar", "Hiwot Dereje", "+251 914 004 004", "support@amharasolar.et", "Debre Markos, Amhara", "Cooperative", 45, "Suspended"),
        ("BrightFuture Energy Solutions", "LIC-2024-005", "Home Solar System", "Samuel Getachew", "+251 915 005 005", "info@brightfuture.et", "Bahir Dar, Amhara", "Private Limited", 95, "Active")
    ]
    c.executemany("""
        INSERT INTO suppliers (name, license_number, service_type, contact_person, contact_phone, email, address, company_type, score, status) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, suppliers)

    contractors = [
        ("Amhara Installation Services PLC", "Institution", "Yohannes Tesfaye", "+251 911 100 200", "Bahir Dar, Amhara Region", "Active"),
        ("EthioTech Energy Contractors Ltd", "Off-Grid", "Almaz Hailu", "+251 912 200 300", "Addis Ababa", "Active"),
        ("Rural Power Installations Co.", "Off-Grid", "Dereje Mekasha", "+251 913 300 400", "Gondar, Amhara Region", "Active"),
        ("Solar Install Amhara", "Institution", "Tigist Worku", "+251 914 400 500", "Dessie, Amhara Region", "Inactive")
    ]
    c.executemany("""
        INSERT INTO contractors (name, service_type, contact_person, contact_phone, address, status)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, contractors)

    zones = [("North Gondar",), ("East Gojam",), ("South Wollo",), ("Awi",), ("Wag Hemra",), ("West Gojam",)]
    c.executemany("INSERT INTO zones (name) VALUES (%s)", zones)

    woredas = [
        (1, "Debark"), (1, "Dabat"), 
        (2, "Debre Markos"), (2, "Bichena"),
        (3, "Dessie Zuria"), (3, "Kombolcha"),
        (4, "Dangila"), (4, "Injibara"),
        (5, "Sekota"),
        (6, "Finote Selam"), (6, "Bure")
    ]
    c.executemany("INSERT INTO woredas (zone_id, name) VALUES (%s, %s)", woredas)

    now = datetime.datetime.utcnow()
    activities = [
        ("Dr. Kassahun Tadesse - User Account Created", "User Account Created", "User: Biruk Habtu (WOREDA_ENCODER)", "SUCCESS", (now - datetime.timedelta(hours=1)).strftime('%Y-%m-%d %H:%M:%S')),
        ("Tigist Alemu - Supplier Registered", "Supplier Registered", "Supplier: BrightFuture Energy Solutions", "SUCCESS", (now - datetime.timedelta(hours=2)).strftime('%Y-%m-%d %H:%M:%S')),
        ("Selamawit Girma - Submission Approved", "Submission Approved", "Beneficiary: Abebe Bikila (BEN-001)", "SUCCESS", (now - datetime.timedelta(hours=3)).strftime('%Y-%m-%d %H:%M:%S')),
        ("Mulugeta Bekele - Submission Rejected", "Submission Rejected", "Beneficiary: Sara Worku (BEN-004)", "ERROR", (now - datetime.timedelta(hours=4)).strftime('%Y-%m-%d %H:%M:%S')),
        ("Biruk Hailu - Beneficiary Registered", "Beneficiary Registered", "Beneficiary: Dagne Hailu (BEN-007)", "INFO", (now - datetime.timedelta(hours=5)).strftime('%Y-%m-%d %H:%M:%S'))
    ]
    
    c.executemany('''
        INSERT INTO activity_logs (user, action, details, status, timestamp)
        VALUES (%s, %s, %s, %s, %s)
    ''', activities)
    
    # --------------------------------
    # Seed Agents
    # --------------------------------
    agents = [
        ("Fekadu Assefa", "fekadu@sedms.et", "+251 921 001 001", "AG-001", 1, "Active", 88, 124),
        ("Rahel Solomon", "rahel@sedms.et", "+251 922 002 002", "AG-002", 1, "Active", 76, 89),
        ("Tadesse Girma", "tadesse@sedms.et", "+251 923 003 003", "AG-003", 4, "Active", 91, 156),
        ("Meseret Alemu", "meseret@sedms.et", "+251 924 004 004", "AG-004", 2, "Inactive", 54, 42),
        ("Solomon Bekele", "solomon@sedms.et", "+251 925 005 005", "AG-005", 3, "Active", 85, 108)
    ]
    c.executemany('''
        INSERT INTO agents (name, email, phone, national_id, zone_id, status, performance, served)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ''', agents)

    # --------------------------------
    # Seed Beneficiaries
    # --------------------------------
    beneficiaries = [
        ("Abebe Bikila", "ET-BEN-001", "+251 920 111 001", "Male", "4-6", "North Gondar", "Dabat", "05", "Warka", "Home Solar System", "Home Solar System", "Solar Solutions Ethiopia PLC", "Approved", "{}", (now - datetime.timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S')),
        ("Almaz Tesfaye", "ET-BEN-002", "+251 920 111 002", "Female", "2-4", "North Gondar", "Debark", "02", "Tsehafi", "Home Solar System", "Solar Lantern", "EthioSun Light", "Pending Zone", "{}", (now - datetime.timedelta(days=2)).strftime('%Y-%m-%d %H:%M:%S')),
        ("Tadesse Mengistu", "ET-BEN-003", "+251 920 111 003", "Male", "5+", "Awi", "Dangila", "01", "Addis Alem", "Home Solar System", "Home Solar System", "Sunrise Contractors", "Approved", "{}", (now - datetime.timedelta(days=3)).strftime('%Y-%m-%d %H:%M:%S')),
        ("Sara Worku", "ET-BEN-004", "+251 920 111 004", "Female", "1", "South Wollo", "Dessie Zuria", "03", "Kurkur", "Home Solar System", "Solar Lantern", "Amhara Solar Cooperative", "Rejected", "{}", (now - datetime.timedelta(days=4)).strftime('%Y-%m-%d %H:%M:%S')),
        ("Fatima Hussein", "ET-BEN-005", "+251 920 111 005", "Female", "2-4", "East Gojam", "Debre Markos", "04", "Gudguad", "Home Solar System", "Home Solar System", "Green Energy Amhara", "Pending Woreda", "{}", (now - datetime.timedelta(days=5)).strftime('%Y-%m-%d %H:%M:%S')),
    ]
    c.executemany('''
        INSERT INTO beneficiaries (full_name, national_id, phone, gender, household_size, zone, woreda, kebele, village, survey_type, equipment_type, supplier, status, details_json, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', beneficiaries)

    # --------------------------------
    # Seed Problems
    # --------------------------------
    problems = [
        ("Delayed Solar Panel Delivery", "Logistics", "01", "Dabat", "North Gondar", "Home Solar System", "N/A", "Abebe Bikila", "Encoder_01", "Pending", "High", (now - datetime.timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S')),
        ("Faulty Battery Component", "Hardware", "03", "Kombolcha", "South Wollo", "Solar Lantern", "BAT-001", "Sara Worku", "Encoder_03", "Under Repair", "Medium", (now - datetime.timedelta(days=2)).strftime('%Y-%m-%d %H:%M:%S')),
        ("Beneficiary Address Mismatch", "Data Issue", "02", "Debark", "North Gondar", "Home Solar System", "SYS-912", "Almaz Tesfaye", "Encoder_02", "Pending", "Low", (now - datetime.timedelta(days=2, hours=5)).strftime('%Y-%m-%d %H:%M:%S')),
        ("Inverter Failure", "Hardware", "04", "Debre Markos", "East Gojam", "Institutional Solar", "INV-100", "Fatima Hussein", "Encoder_04", "Open", "High", (now - datetime.timedelta(days=3)).strftime('%Y-%m-%d %H:%M:%S')),
        ("Cable Disconnected", "Hardware", "05", "Dangila", "Awi", "Home Solar System", "CBL-22", "Tadesse Mengistu", "Encoder_05", "Resolved", "Low", (now - datetime.timedelta(days=4)).strftime('%Y-%m-%d %H:%M:%S')),
    ]
    c.executemany('''
        INSERT INTO problems (title, category, kebele, woreda, zone, equipment, serial_number, beneficiary_name, submitted_by, status, urgency, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', problems)

    # --------------------------------
    # Seed Demands
    # --------------------------------
    demands = [
        ("Kebede Tadesse", "ET-DMD-001", "+251 911 345 678", "North Gondar", "Dabat", "05", "Warka", "Male", "No", "Home/Lantern", "3", "No", "Home Solar System", "50W", "{}", "Pending Woreda Review"),
        ("Tigist Mengesha", "ET-DMD-002", "+251 912 345 678", "South Wollo", "Dessie Zuria", "03", "Kurkur", "Female", "Yes", "Home/Lantern", "2", "Yes", "Solar Lantern", "10W", "{}", "Assigned", 1),
        ("Bale Robe Health Post", "ET-DMD-003", "+251 913 345 678", "Awi", "Dangila", "01", "Addis Alem", "Male", "No", "Institution", "N/A", "No", "Institutional Solar", "5000W", "{}", "Pending Woreda Review")
    ]
    c.executemany('''
        INSERT INTO demands (full_name, national_id, phone, zone, woreda, kebele, village, gender, has_disability, service_type, household_size, elderly_count, solar_panel_type, watt_level, details_json, status, assigned_supplier_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', [
        ("Kebede Tadesse", "ET-DMD-001", "+251 911 345 678", "North Gondar", "Dabat", "05", "Warka", "Male", "no", "home_lantern", "3", "No", "Home Solar System", "50W", "{}", "Pending Woreda Review", None),
        ("Tigist Mengesha", "ET-DMD-002", "+251 912 345 678", "South Wollo", "Dessie Zuria", "03", "Kurkur", "Female", "yes", "home_lantern", "2", "Yes", "Solar Lantern", "10W", "{}", "Pending Woreda Review", None),
        ("Bale Robe Health Post", "ET-DMD-003", "+251 913 345 678", "Awi", "Dangila", "01", "Addis Alem", "Male", "no", "institution", "N/A", "No", "Institutional Solar", "5000W", "{}", "Assigned", 1)
    ])

    conn.commit()
    conn.close()
    print("Database seeded successfully with initial dashboard data using MySQL.")

if __name__ == "__main__":
    seed_data()
