import pymysql
import pymysql.cursors
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_NAME = os.getenv("DB_NAME", "sedms")

def get_connection_no_db():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT,
        cursorclass=pymysql.cursors.DictCursor
    )

def get_db_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor
    )

def init_db():
    conn = get_connection_no_db()
    c = conn.cursor()
    c.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    conn.commit()
    conn.close()

    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SET FOREIGN_KEY_CHECKS = 0;")
    c.execute("DROP TABLE IF EXISTS area_assignments;")
    c.execute("DROP TABLE IF EXISTS woredas;")
    c.execute("DROP TABLE IF EXISTS zones;")
    c.execute("DROP TABLE IF EXISTS suppliers;")
    c.execute("DROP TABLE IF EXISTS contractors;")
    c.execute("DROP TABLE IF EXISTS agents;")
    c.execute("DROP TABLE IF EXISTS beneficiaries;")
    c.execute("DROP TABLE IF EXISTS problems;")
    c.execute("DROP TABLE IF EXISTS demands;")
    c.execute("DROP TABLE IF EXISTS activity_logs;")
    c.execute("DROP TABLE IF EXISTS dashboard_stats;")
    c.execute("SET FOREIGN_KEY_CHECKS = 1;")
    
    c.execute('''
        CREATE TABLE dashboard_stats (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            total_suppliers INTEGER,
            suppliers_trend REAL,
            total_beneficiaries INTEGER,
            beneficiaries_trend REAL,
            units_distributed INTEGER,
            units_trend REAL,
            active_zones INTEGER,
            pending_approvals INTEGER,
            pending_trend REAL,
            equipment_issues INTEGER,
            issues_trend REAL
        );
    ''')

    c.execute('''
        CREATE TABLE activity_logs (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            user TEXT,
            action TEXT,
            details TEXT,
            status TEXT,
            timestamp DATETIME
        );
    ''')

    c.execute('''
        CREATE TABLE suppliers (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            license_number VARCHAR(100),
            service_type VARCHAR(100),
            contact_person VARCHAR(255),
            contact_phone VARCHAR(50),
            email VARCHAR(255),
            address VARCHAR(255),
            company_type VARCHAR(100),
            score INTEGER DEFAULT 0,
            status VARCHAR(50) DEFAULT 'Active'
        );
    ''')

    c.execute('''
        CREATE TABLE contractors (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            service_type VARCHAR(100),
            contact_person VARCHAR(255),
            contact_phone VARCHAR(50),
            address VARCHAR(255),
            status VARCHAR(50) DEFAULT 'Active',
            registered_date DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ''')

    c.execute('''
        CREATE TABLE zones (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL
        );
    ''')

    c.execute('''
        CREATE TABLE woredas (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            zone_id INTEGER,
            name VARCHAR(255) NOT NULL,
            FOREIGN KEY (zone_id) REFERENCES zones(id)
        );
    ''')

    c.execute('''
        CREATE TABLE area_assignments (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            supplier_id INTEGER NOT NULL,
            zone_id INTEGER NOT NULL,
            woreda_id INTEGER NOT NULL,
            kebele VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
            FOREIGN KEY (zone_id) REFERENCES zones(id),
            FOREIGN KEY (woreda_id) REFERENCES woredas(id)
        );
    ''')

    c.execute('''
        CREATE TABLE agents (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255),
            phone VARCHAR(50),
            national_id VARCHAR(100),
            zone_id INTEGER,
            status VARCHAR(50) DEFAULT 'Active',
            performance INTEGER DEFAULT 0,
            served INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (zone_id) REFERENCES zones(id)
        );
    ''')

    c.execute('''
        CREATE TABLE beneficiaries (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            full_name VARCHAR(255) NOT NULL,
            national_id VARCHAR(100),
            phone VARCHAR(50),
            gender VARCHAR(20),
            household_size VARCHAR(50),
            zone VARCHAR(255),
            woreda VARCHAR(255),
            kebele VARCHAR(255),
            village VARCHAR(255),
            survey_type VARCHAR(100),
            equipment_type VARCHAR(100),
            supplier VARCHAR(255),
            status VARCHAR(50) DEFAULT 'Pending Woreda',
            details_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ''')

    c.execute('''
        CREATE TABLE problems (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255),
            category VARCHAR(100),
            kebele VARCHAR(255),
            woreda VARCHAR(255),
            zone VARCHAR(255),
            equipment VARCHAR(255),
            serial_number VARCHAR(100),
            beneficiary_name VARCHAR(255),
            submitted_by VARCHAR(255),
            status VARCHAR(50) DEFAULT 'Pending',
            urgency VARCHAR(50),
            details_json TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ''')

    c.execute('''
        CREATE TABLE demands (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            full_name VARCHAR(255) NOT NULL,
            national_id VARCHAR(100),
            phone VARCHAR(50),
            zone VARCHAR(255),
            woreda VARCHAR(255),
            kebele VARCHAR(255),
            village VARCHAR(255),
            gender VARCHAR(20),
            has_disability VARCHAR(10),
            service_type VARCHAR(50),
            household_size VARCHAR(50),
            elderly_count VARCHAR(50),
            solar_panel_type VARCHAR(100),
            watt_level VARCHAR(50),
            details_json TEXT,
            status VARCHAR(50) DEFAULT 'Pending Woreda Review',
            assigned_supplier_id INTEGER DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (assigned_supplier_id) REFERENCES suppliers(id)
        );
    ''')
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
