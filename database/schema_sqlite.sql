-- SQLite Schema

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('student', 'admin')) NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT,
    stream TEXT,
    fees INTEGER,
    eligibility TEXT
);

CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_no TEXT UNIQUE,
    institution TEXT, -- KITE or KGCAS
    course TEXT,
    student_name TEXT,
    gender TEXT,
    dob DATE,
    aadhar_no TEXT,
    quota TEXT, -- Management or Govt
    father_name TEXT,
    father_occupation TEXT,
    mother_name TEXT,
    mother_occupation TEXT,
    annual_income NUMERIC,
    community TEXT,
    address TEXT,
    pincode TEXT,
    phone_1 TEXT, -- Student Whatsapp
    phone_2 TEXT, -- Parent Whatsapp
    phone_3 TEXT, -- Other
    school_name_place TEXT,
    school_type TEXT,
    board_of_study TEXT,
    medium_of_instruction TEXT,
    marks_10th_total TEXT,
    marks_10th_maths TEXT,
    marks_10th_science TEXT,
    marks_11th_total TEXT,
    marks_11th_phy_eco TEXT,
    marks_11th_che_comm TEXT,
    marks_11th_maths_accs TEXT,
    marks_11th_comp_bio TEXT,
    marks_12th_total TEXT,
    marks_12th_phy_eco TEXT,
    marks_12th_che_comm TEXT,
    marks_12th_maths_accs TEXT,
    marks_12th_comp_bio TEXT,
    group_12th TEXT,
    reg_no_12th TEXT,
    first_gen_graduate TEXT, -- Yes/No
    pmss TEXT, -- Yes/No
    laptop TEXT, -- Yes/No
    college_bus TEXT, -- Yes/No
    bus_boarding_point TEXT,
    hostel TEXT, -- Yes/No
    source TEXT, -- Direct, Student, Alumni, etc.
    city TEXT, -- Place of origin
    email TEXT, -- Kept from previous
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications ( -- Previously applications, renaming logic kept same as schema
    application_no TEXT PRIMARY KEY,
    status TEXT CHECK (status IN ('draft', 'submitted', 'verified', 'rejected')) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS personal_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_no TEXT,
    full_name TEXT,
    photo_url TEXT,
    aadhar_number TEXT,
    gender TEXT,
    dob DATE,
    age INTEGER,
    religion TEXT,
    nationality TEXT,
    community TEXT,
    caste TEXT,
    blood_group TEXT,
    whatsapp_no TEXT,
    email TEXT,
    native TEXT,
    UNIQUE(application_no)
);

CREATE TABLE IF NOT EXISTS parent_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_no TEXT,
    father_name TEXT,
    father_photo_url TEXT,
    father_sign_url TEXT,
    mother_name TEXT,
    mother_photo_url TEXT,
    mother_sign_url TEXT,
    annual_income NUMERIC,
    student_mobile TEXT,
    father_mobile TEXT,
    mother_mobile TEXT,
    office_address TEXT,
    UNIQUE(application_no)
);

CREATE TABLE IF NOT EXISTS address_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_no TEXT,
    perm_state TEXT,
    perm_pincode TEXT,
    comm_state TEXT,
    comm_pincode TEXT,
    UNIQUE(application_no)
);

CREATE TABLE IF NOT EXISTS academic_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_no TEXT,
    x_month_year TEXT,
    x_register_no TEXT,
    x_school_name TEXT,
    x_board TEXT,
    hsc_month_year TEXT,
    hsc_register_no TEXT,
    hsc_school_name TEXT,
    hsc_board TEXT,
    hsc_medium TEXT,
    maths_marks NUMERIC,
    physics_theory NUMERIC,
    physics_practical NUMERIC,
    chemistry_theory NUMERIC,
    chemistry_practical NUMERIC,
    vocational_theory NUMERIC,
    attempts INTEGER,
    total_marks_100 NUMERIC,
    cutoff_200 NUMERIC,
    college_name TEXT,
    university TEXT,
    passing_month_year TEXT,
    percentage_cgpa NUMERIC,
    arrears_count INTEGER,
    school_type TEXT,
    marks_11th_total NUMERIC,
    UNIQUE(application_no)
);

CREATE TABLE IF NOT EXISTS admission_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_no TEXT,
    admission_type TEXT,
    allotment_no TEXT,
    quota TEXT,
    admitted_branch TEXT,
    hostel_required BOOLEAN,
    transport_required BOOLEAN,
    boarding_point TEXT,
    UNIQUE(application_no)
);

CREATE TABLE IF NOT EXISTS uploaded_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_no TEXT,
    document_type TEXT,
    file_path TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data
INSERT OR IGNORE INTO courses (course_name, eligibility, fees, stream) VALUES
('B.E. Computer Science', 'Marks > 80 in Science', 150000, 'Engineering'),
('B.E. Mechanical', 'Marks > 70 in Science', 150000, 'Engineering'),
('B.Sc. Physics', 'Marks > 60 in Science', 150000, 'Science'),
('B.Sc. Mathematics', 'Marks > 60 in Science', 150000, 'Science'),
('B.A. English', 'Any Stream', 150000, 'Arts'),
('B.A. History', 'Any Stream', 150000, 'Arts');
