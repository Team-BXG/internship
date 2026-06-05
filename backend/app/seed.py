from app.database import init_db, get_db_connection
import datetime
import hashlib

def hash_pw(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()

# Complete verified Amhara administrative dataset from GADM
ZONES_DATA = [
    "Awi Zone", "Argoba Special Woreda", "Bahir Dar Special Zone", 
    "South Gondar", "South Wollo", "West Gojjam", "East Gojjam", 
    "North Shewa", "Oromia Special Zone", "North Gondar", "North Wollo", "Wag Himra"
]

WOREDAS_DATA = [
    # (Zone, Woreda, Code, Longitude, Latitude)
    ("Awi Zone", "Ankasha", "30903", 36.785278, 10.758239),
    ("Awi Zone", "Banja", "30902", 36.910620, 10.966241),
    ("Awi Zone", "Dangila", "30901", 36.776399, 11.226415),
    ("Awi Zone", "FagtaLakoma", "30905", 36.893989, 11.079130),
    ("Awi Zone", "GuagusaShikudad", "30907", 37.023622, 10.824033),
    ("Awi Zone", "Guangua", "30904", 36.500426, 10.778247),
    ("Awi Zone", "Jawi", "30906", 36.405001, 11.711684),
    ("Argoba Special Woreda", "Argoba", "31201", 39.981844, 10.931352),
    ("Bahir Dar Special Zone", "BahirDar", "31101", 37.393205, 11.585978),
    ("South Gondar", "Dera", "30209", 37.669812, 11.607428),
    ("South Gondar", "EastEsite", "30208", 38.075484, 11.494730),
    ("South Gondar", "Ebenat", "30201", 38.235687, 12.189146),
    ("South Gondar", "Farta", "30204", 38.069159, 11.840889),
    ("South Gondar", "Fogera", "30203", 37.765974, 11.882648),
    ("South Gondar", "LayGayint", "30205", 38.431500, 11.846199),
    ("South Gondar", "LiboKemkem", "30202", 37.780984, 12.146429),
    ("South Gondar", "Simada", "30207", 38.368358, 11.333371),
    ("South Gondar", "TachGayint", "30206", 38.559262, 11.559864),
    ("South Gondar", "WestEsite", "30211", 37.925016, 11.382530),
    ("South Wollo", "Albuko", "30408", 39.613383, 10.814758),
    ("South Wollo", "Ambasel", "30404", 39.491308, 11.500443),
    ("South Wollo", "Debresina", "30412", 38.691938, 10.745628),
    ("South Wollo", "DessieZuria", "30409", 39.526004, 11.060819),
    ("South Wollo", "Jama", "30414", 39.259868, 10.403818),
    ("South Wollo", "Kalu", "30407", 39.836211, 11.063233),
    ("South Wollo", "Kelela", "30413", 38.997653, 10.544025),
    ("South Wollo", "Kutaber", "30403", 39.462066, 11.275537),
    ("South Wollo", "Legambo", "30410", 39.154877, 10.849496),
    ("South Wollo", "Legehida", "30420", 39.285027, 10.703936),
    ("South Wollo", "MehalSayint", "30419", 38.641708, 10.930958),
    ("South Wollo", "Mekdela", "30401", 38.929609, 11.242386),
    ("South Wollo", "Sayint", "30411", 38.779389, 11.064945),
    ("South Wollo", "Tenta", "30402", 39.222966, 11.221981),
    ("South Wollo", "Thehulederie", "30405", 39.690656, 11.313937),
    ("South Wollo", "Wegde", "30416", 38.677621, 10.533789),
    ("South Wollo", "WereIlu", "30415", 39.452580, 10.696158),
    ("South Wollo", "Worebabu", "30406", 39.891602, 11.430235),
    ("West Gojjam", "BahirDarZuria", "30702", 37.324570, 11.858110),
    ("West Gojjam", "Bure", "30710", 37.047667, 10.538598),
    ("West Gojjam", "DebubAchefer", "30713", 36.818276, 11.473831),
    ("West Gojjam", "DegaDamot", "30707", 37.608292, 10.850153),
    ("West Gojjam", "Dembecha", "30708", 37.354093, 10.521139),
    ("West Gojjam", "JabiTehnan", "30709", 37.272718, 10.697822),
    ("West Gojjam", "Mecha", "30704", 37.158317, 11.332520),
    ("West Gojjam", "Quarit", "30706", 37.438120, 10.970881),
    ("West Gojjam", "Sekela", "30705", 37.205706, 10.994580),
    ("West Gojjam", "SemenAchefer", "30701", 36.950320, 11.703076),
    ("West Gojjam", "Wemberma", "30711", 36.800161, 10.486355),
    ("West Gojjam", "YilmanaDensa", "30703", 37.556935, 11.242093),
    ("East Gojjam", "Aneded", "30617", 37.873505, 10.179000),
    ("East Gojjam", "Awabel", "30612", 37.997358, 10.212218),
    ("East Gojjam", "BasoLiben", "30611", 37.714553, 10.021805),
    ("East Gojjam", "Bibugn", "30601", 37.749505, 10.836696),
    ("East Gojjam", "DebayTelatgen", "30607", 37.991777, 10.539188),
    ("East Gojjam", "DebreElias", "30608", 37.321346, 10.231790),
    ("East Gojjam", "Dejen", "30613", 38.175494, 10.198866),
    ("East Gojjam", "EnarjEnawga", "30605", 38.216355, 10.683994),
    ("East Gojjam", "EnbiseSarMidir", "30604", 38.392755, 10.864420),
    ("East Gojjam", "Enemay", "30606", 38.174532, 10.500872),
    ("East Gojjam", "GonchaSisoEnese", "30603", 38.165969, 10.982284),
    ("East Gojjam", "Gonje", "30618", 37.636020, 11.076850),
    ("East Gojjam", "Guzamn", "30610", 37.594361, 10.234884),
    ("East Gojjam", "HuletEjEnese", "30602", 37.903457, 10.980537),
    ("East Gojjam", "Michakel", "30609", 37.521879, 10.477544),
    ("East Gojjam", "Senan", "30616", 37.780806, 10.516104),
    ("East Gojjam", "ShebelBereta", "30614", 38.371066, 10.346531),
    ("North Shewa", "AngolelanaTera", "30513", 39.457359, 9.454041),
    ("North Shewa", "Ankober", "30515", 39.777143, 9.558158),
    ("North Shewa", "Antsokiya", "30507", 39.801906, 10.597753),
    ("North Shewa", "Assagirt", "30514", 39.617465, 9.337820),
    ("North Shewa", "BasonaWorena", "30519", 39.527856, 9.732305),
    ("North Shewa", "Berehet", "30517", 39.685194, 9.181857),
    ("North Shewa", "EferatanaGidem", "30508", 39.880052, 10.312758),
    ("North Shewa", "Ensaro", "30503", 38.896107, 9.825957),
    ("North Shewa", "GisheRabel", "30506", 39.598402, 10.577349),
    ("North Shewa", "HagereMariam", "30516", 39.378816, 9.188960),
    ("North Shewa", "Kewet", "30512", 39.906709, 9.978670),
    ("North Shewa", "MenzGeraMidir", "30505", 39.635242, 10.357111),
    ("North Shewa", "MenzKeyaGabriel", "30521", 39.367458, 10.179828),
    ("North Shewa", "MenzLaloMidir", "30522", 39.509783, 10.125476),
    ("North Shewa", "MenzMamaMidir", "30509", 39.645014, 10.103273),
    ("North Shewa", "Merahbete", "30502", 38.970531, 10.048544),
    ("North Shewa", "MimoWeremo", "30501", 39.008439, 10.243928),
    ("North Shewa", "MinjarShenkora", "30518", 39.494676, 8.915414),
    ("North Shewa", "MojanWedera", "30511", 39.528358, 9.924861),
    ("North Shewa", "MoretnaJiru", "30504", 39.148714, 9.942233),
    ("North Shewa", "SiyaDebirnaWayu", "30523", 39.200864, 9.784480),
    ("North Shewa", "TaremaBer", "30510", 39.821278, 9.860286),
    ("Oromia Special Zone", "ArtumaFursi", "31004", 40.014267, 10.523371),
    ("Oromia Special Zone", "Bati", "31002", 40.057639, 11.164514),
    ("Oromia Special Zone", "DewaCheffa", "31001", 39.849483, 10.765048),
    ("Oromia Special Zone", "DewaHarewa", "31005", 40.053020, 10.762262),
    ("Oromia Special Zone", "JilleTimuga", "31003", 40.046519, 10.245175),
    ("North Gondar", "AddiArekay", "30101", 37.978834, 13.384581),
    ("North Gondar", "Alfa", "30115", 36.733056, 11.932552),
    ("North Gondar", "Beyeda", "30102", 38.480893, 13.251713),
    ("North Gondar", "Chilga", "30112", 36.905317, 12.596079),
    ("North Gondar", "Dabat", "30105", 37.696418, 13.042877),
    ("North Gondar", "Debark", "30104", 37.835039, 13.202881),
    ("North Gondar", "Dembia", "30111", 37.263443, 12.402936),
    ("North Gondar", "EastBelesa", "30117", 38.182584, 12.535412),
    ("North Gondar", "GonderZuria", "30110", 37.554414, 12.426337),
    ("North Gondar", "Janamora", "30103", 38.199218, 13.012738),
    ("North Gondar", "LayArmacho", "30108", 37.364619, 12.776428),
    ("North Gondar", "Metema", "30113", 36.435224, 12.748417),
    ("North Gondar", "MirabArmacho", "30106", 36.461480, 13.237889),
    ("North Gondar", "Quara", "30114", 35.858524, 12.215022),
    ("North Gondar", "TachArmacho", "30120", 37.073510, 13.033841),
    ("North Gondar", "Takusa", "30121", 36.772221, 12.222633),
    ("North Gondar", "Tsegede", "30107", 37.054124, 13.293704),
    ("North Gondar", "Tselemt", "30119", 38.410866, 13.456403),
    ("North Gondar", "Wegera", "30109", 37.777726, 12.774422),
    ("North Gondar", "WestBelesa", "30116", 37.835860, 12.490872),
    ("North Wollo", "Bugna", "30301", 38.699226, 12.161685),
    ("North Wollo", "Dawunt", "30311", 38.836384, 11.471488),
    ("North Wollo", "Delanta", "30306", 39.217635, 11.613796),
    ("North Wollo", "Gidan", "30303", 39.315872, 12.070730),
    ("North Wollo", "GubaLafto", "30307", 39.496113, 11.794713),
    ("North Wollo", "Habru", "30308", 39.766622, 11.662877),
    ("North Wollo", "Kobo", "30302", 39.642956, 12.103824),
    ("North Wollo", "Lasta", "30310", 39.012524, 12.052807),
    ("North Wollo", "Meket", "30304", 38.821010, 11.819998),
    ("North Wollo", "Wadla", "30305", 39.008740, 11.658973),
    ("Wag Himra", "Abergele", "30805", 38.888981, 13.074973),
    ("Wag Himra", "Dehana", "30803", 38.672031, 12.438624),
    ("Wag Himra", "GazGibla", "30804", 39.057223, 12.317384),
    ("Wag Himra", "Sahla", "30806", 38.499812, 12.931398),
    ("Wag Himra", "Sekota", "30802", 39.060291, 12.651750),
    ("Wag Himra", "Ziquala", "30801", 38.709455, 12.810792)
]

def seed_data():
    conn = get_db_connection()
    c = conn.cursor()
    
    # Check if database is already seeded (e.g. if zones table exists and has rows)
    try:
        c.execute("SELECT COUNT(*) as cnt FROM zones")
        res = c.fetchone()
        if res and res['cnt'] > 0:
            print("Database already seeded. Skipping seeding.")
            conn.close()
            return
    except Exception:
        pass
    
    # 0. Disable foreign keys and drop/recreate all tables using metadata
    c.execute("SET FOREIGN_KEY_CHECKS = 0;")
    tables = [
        "problems", "beneficiaries", "demands", "area_assignments", "agents",
        "woredas", "zones", "employees", "contractors", "suppliers", 
        "activity_logs", "dashboard_stats"
    ]
    for table in tables:
        c.execute(f"DROP TABLE IF EXISTS {table};")
    c.execute("SET FOREIGN_KEY_CHECKS = 1;")
    conn.commit()
    conn.close()

    # Recreate tables via SQLAlchemy init_db
    init_db()

    # Reopen connection to seed data
    conn = get_db_connection()
    c = conn.cursor()
    
    # Seed Dashboard Stats
    c.execute('''
        INSERT INTO dashboard_stats (
            id, total_suppliers, suppliers_trend, total_beneficiaries, beneficiaries_trend,
            units_distributed, units_trend, active_zones, pending_approvals, pending_trend,
            equipment_issues, issues_trend
        ) VALUES (1, 124, 12.0, 45280, 8.0, 41289, 15.0, 12, 342, -4.0, 28, -6.0)
    ''')
    
    # Seed Suppliers
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

    # Seed Contractors
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

    # Seed Zones
    inserted_zones = []
    for z_name in ZONES_DATA:
        c.execute("INSERT INTO zones (name) VALUES (%s)", (z_name,))
        inserted_zones.append((c.lastrowid, z_name))
    
    zone_name_to_id = {z_name: z_id for z_id, z_name in inserted_zones}

    # Seed Woredas
    woreda_name_to_id = {}
    for z_name, w_name, code, lon, lat in WOREDAS_DATA:
        z_id = zone_name_to_id[z_name]
        c.execute(
            "INSERT INTO woredas (zone_id, name, code, longitude, latitude) VALUES (%s, %s, %s, %s, %s)",
            (z_id, w_name, code, lon, lat)
        )
        woreda_name_to_id[w_name] = c.lastrowid

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
    
    # Seed Agents
    agents = [
        ("Fekadu Assefa", "fekadu@sedms.et", "+251 921 001 001", "AG-001", zone_name_to_id["Awi Zone"], "Active", 88, 124),
        ("Rahel Solomon", "rahel@sedms.et", "+251 922 002 002", "AG-002", zone_name_to_id["Awi Zone"], "Active", 76, 89),
        ("Tadesse Girma", "tadesse@sedms.et", "+251 923 003 003", "AG-003", zone_name_to_id["South Gondar"], "Active", 91, 156),
        ("Meseret Alemu", "meseret@sedms.et", "+251 924 004 004", "AG-004", zone_name_to_id["South Wollo"], "Inactive", 54, 42),
        ("Solomon Bekele", "solomon@sedms.et", "+251 925 005 005", "AG-005", zone_name_to_id["East Gojjam"], "Active", 85, 108)
    ]
    c.executemany('''
        INSERT INTO agents (name, email, phone, national_id, zone_id, status, performance, served)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ''', agents)

    import random
    
    suppliers_names = [s[0] for s in suppliers]
    equipment_types = ["Home Solar System", "Solar Lantern", "Institutional Solar", "Off-grid Solar Grid"]
    b_statuses = ["Approved", "Pending Zone", "Pending Woreda", "Rejected"]
    genders = ["Male", "Female"]
    woreda_ids_list = list(woreda_name_to_id.values())
    
    # Seed Beneficiaries (Dynamic)
    beneficiaries = []
    for i in range(1, 201):
        created_at = now - datetime.timedelta(days=random.randint(1, 240))
        b = (
            f"Beneficiary {i}", f"ET-BEN-{1000+i}", f"+251 920 {random.randint(100, 999)} {random.randint(100, 999)}",
            random.choice(genders), random.choice(["1", "2-4", "5+"]), random.choice(woreda_ids_list),
            f"0{random.randint(1, 9)}", f"Village {random.randint(1, 20)}", random.choice(equipment_types),
            random.choice(equipment_types), random.choice(suppliers_names),
            random.choices(b_statuses, weights=[70, 10, 10, 10])[0], "{}", created_at.strftime('%Y-%m-%d %H:%M:%S')
        )
        beneficiaries.append(b)
        
    c.executemany('''
        INSERT INTO beneficiaries (full_name, national_id, phone, gender, household_size, woreda_id, kebele, village, survey_type, equipment_type, supplier, status, details_json, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', beneficiaries)

    # Seed Problems (Dynamic)
    problems = []
    p_categories = ["Hardware", "Logistics", "Data Issue", "Other"]
    p_statuses = ["Open", "Pending", "Under Repair", "Resolved"]
    p_urgencies = ["High", "Medium", "Low"]
    
    for i in range(1, 81):
        created_at = now - datetime.timedelta(days=random.randint(1, 240))
        p = (
            f"Issue {i}", random.choice(p_categories), f"0{random.randint(1, 9)}", random.choice(woreda_ids_list),
            random.choice(equipment_types), f"SN-{1000+i}", f"Beneficiary {random.randint(1, 200)}", "Encoder_X",
            random.choice(p_statuses), random.choice(p_urgencies), created_at.strftime('%Y-%m-%d %H:%M:%S')
        )
        problems.append(p)
        
    c.executemany('''
        INSERT INTO problems (title, category, kebele, woreda_id, equipment, serial_number, beneficiary_name, submitted_by, status, urgency, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', problems)

    # Seed Demands (Dynamic)
    demands = []
    d_statuses = ["Pending Woreda Review", "Assigned", "Rejected", "Pending Zone Review"]
    for i in range(1, 101):
        d = (
            f"Applicant {i}", f"ET-DMD-{1000+i}", f"+251 911 {random.randint(100, 999)} {random.randint(100, 999)}",
            random.choice(woreda_ids_list), f"0{random.randint(1, 9)}", f"Village {random.randint(1, 20)}",
            random.choice(genders), random.choice(["yes", "no"]), "home_lantern",
            random.choice(["1", "2", "3", "4+"]), random.choice(["Yes", "No"]),
            random.choice(equipment_types), f"{random.choice([10, 50, 100, 500])}W", "{}",
            random.choice(d_statuses), None
        )
        demands.append(d)
        
    c.executemany('''
        INSERT INTO demands (full_name, national_id, phone, woreda_id, kebele, village, gender, has_disability, service_type, household_size, elderly_count, solar_panel_type, watt_level, details_json, status, assigned_supplier_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', demands)

    # Seed Area Assignments (first supplier assigned to Dangila, Awi Zone)
    # supplier_id=1, zone_id=Awi Zone, woreda_id=Dangila
    c.execute('''
        INSERT INTO area_assignments (supplier_id, zone_id, woreda_id, kebele)
        VALUES (%s, %s, %s, %s)
    ''', (1, zone_name_to_id["Awi Zone"], woreda_name_to_id["Dangila"], "01"))

    # Seed Employees (Head Expert, Super Admin, Zone ZA/ZE, and Woreda WE/WA for all 118 woredas!)
    default_pw = hash_pw("emp123")
    employees = [
        ("headexpert", default_pw, "Head Expert", "headexpert@sedms.et", None, None, now),
        ("superadmin", default_pw, "Super Admin", "superadmin@sedms.et", None, None, now),
    ]

    for z_name, z_id in zone_name_to_id.items():
        clean_z_name = z_name.replace(" ", "")
        employees.extend([
            (f"{clean_z_name}ZA", default_pw, "Zone Approver", f"za_{clean_z_name}@sedms.et", z_id, None, now),
            (f"{clean_z_name}ZE", default_pw, "Zone Expert", f"ze_{clean_z_name}@sedms.et", z_id, None, now),
        ])

    for z_name, w_name, _, _, _ in WOREDAS_DATA:
        z_id = zone_name_to_id[z_name]
        w_id = woreda_name_to_id[w_name]
        clean_z_name = z_name.replace(" ", "")
        clean_w_name = w_name.replace(" ", "")
        employees.extend([
            (f"{clean_z_name}{clean_w_name}WE", default_pw, "Woreda Encoder", f"we_{clean_w_name}@sedms.et", z_id, w_id, now),
            (f"{clean_z_name}{clean_w_name}WA", default_pw, "Woreda Approver", f"wa_{clean_w_name}@sedms.et", z_id, w_id, now),
        ])

    c.executemany('''
        INSERT INTO employees (username, hashed_password, role, email, zone_id, woreda_id, created_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    ''', employees)

    conn.commit()
    conn.close()
    print("Database drop, recreate, and seed completed successfully with GADM Amhara dataset.")

if __name__ == "__main__":
    seed_data()
