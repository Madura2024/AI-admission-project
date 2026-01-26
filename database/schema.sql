-- Database Schema for AI Automated Admission Management System

-- Users Table (Admin & Students)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('student', 'admin')) NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table (Master Data)
CREATE TABLE IF NOT EXISTS courses (
    course_id SERIAL PRIMARY KEY,
    course_name TEXT,
    stream TEXT,
    fees INTEGER,
    eligibility TEXT
);

-- Enquiries Table (Pre-Admission)
CREATE TABLE IF NOT EXISTS enquiries (
    id SERIAL PRIMARY KEY,
    application_no VARCHAR(50) UNIQUE,
    student_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15),
    qualification VARCHAR(50),
    marks INTEGER,
    interested_stream VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Application Master Table
CREATE TABLE applications (
    application_no VARCHAR(50) PRIMARY KEY,
    status VARCHAR(20) CHECK (status IN ('draft', 'submitted', 'verified', 'rejected')) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 1: Personal Details
CREATE TABLE personal_details (
    id SERIAL PRIMARY KEY,
    application_no VARCHAR(50) REFERENCES applications(application_no) ON DELETE CASCADE,
    full_name VARCHAR(100),
    photo_url TEXT,
    aadhar_number VARCHAR(20),
    gender VARCHAR(10),
    dob DATE,
    age INTEGER,
    religion VARCHAR(50),
    nationality VARCHAR(50),
    community VARCHAR(20),
    caste VARCHAR(50),
    blood_group VARCHAR(10),
    whatsapp_no VARCHAR(15),
    email VARCHAR(100),
    UNIQUE(application_no)
);

-- Step 2: Parent / Guardian Details
CREATE TABLE parent_details (
    id SERIAL PRIMARY KEY,
    application_no VARCHAR(50) REFERENCES applications(application_no) ON DELETE CASCADE,
    father_name VARCHAR(100),
    father_photo_url TEXT,
    father_sign_url TEXT,
    mother_name VARCHAR(100),
    mother_photo_url TEXT,
    mother_sign_url TEXT,
    annual_income NUMERIC(12, 2),
    student_mobile VARCHAR(15),
    father_mobile VARCHAR(15),
    mother_mobile VARCHAR(15),
    office_address TEXT,
    UNIQUE(application_no)
);

-- Step 3: Address Details
CREATE TABLE address_details (
    id SERIAL PRIMARY KEY,
    application_no VARCHAR(50) REFERENCES applications(application_no) ON DELETE CASCADE,
    perm_state VARCHAR(50),
    perm_pincode VARCHAR(10),
    comm_state VARCHAR(50),
    comm_pincode VARCHAR(10),
    UNIQUE(application_no)
);

-- Step 4: Academic Records
CREATE TABLE academic_records (
    id SERIAL PRIMARY KEY,
    application_no VARCHAR(50) REFERENCES applications(application_no) ON DELETE CASCADE,
    
    -- X Std
    x_month_year VARCHAR(20),
    x_register_no VARCHAR(50),
    x_school_name VARCHAR(150),
    x_board VARCHAR(50),
    
    -- HSC / Equivalent
    hsc_month_year VARCHAR(20),
    hsc_register_no VARCHAR(50),
    hsc_school_name VARCHAR(150),
    hsc_board VARCHAR(50),
    hsc_medium VARCHAR(20),
    
    -- Marks
    maths_marks NUMERIC(5,2),
    physics_theory NUMERIC(5,2),
    physics_practical NUMERIC(5,2),
    chemistry_theory NUMERIC(5,2),
    chemistry_practical NUMERIC(5,2),
    vocational_theory NUMERIC(5,2),
    
    attempts INTEGER,
    total_marks_100 NUMERIC(5,2),
    cutoff_200 NUMERIC(5,2),
    
    -- Degree / Diploma (Optional)
    college_name VARCHAR(150),
    university VARCHAR(150),
    passing_month_year VARCHAR(20),
    percentage_cgpa NUMERIC(5,2),
    arrears_count INTEGER,
    
    UNIQUE(application_no)
);

-- Step 5: Admission Details
CREATE TABLE admission_details (
    id SERIAL PRIMARY KEY,
    application_no VARCHAR(50) REFERENCES applications(application_no) ON DELETE CASCADE,
    admission_type VARCHAR(20), -- MQ / GQ
    allotment_no VARCHAR(50),
    quota VARCHAR(50),
    admitted_branch VARCHAR(100),
    hostel_required BOOLEAN,
    transport_required BOOLEAN,
    boarding_point VARCHAR(100),
    UNIQUE(application_no)
);

-- Step 6: Declaration (Signatures tracked here or in personal/parent details, keeping simplified)
CREATE TABLE declarations (
    id SERIAL PRIMARY KEY,
    application_no VARCHAR(50) REFERENCES applications(application_no) ON DELETE CASCADE,
    candidate_sign_url TEXT,
    parent_sign_url TEXT,
    declared_date DATE,
    is_declared BOOLEAN DEFAULT FALSE,
    UNIQUE(application_no)
);

-- Documents Table (Generic for any extra docs)
CREATE TABLE uploaded_documents (
    id SERIAL PRIMARY KEY,
    application_no VARCHAR(50) REFERENCES applications(application_no) ON DELETE CASCADE,
    document_type VARCHAR(50),
    file_path TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data for Courses (Preserve functionality)
INSERT INTO courses (course_name, eligibility, fees, stream) VALUES
('B.E. Computer Science', 'Marks > 80 in Science', 150000, 'Engineering'),
('B.E. Mechanical', 'Marks > 70 in Science', 150000, 'Engineering'),
('B.Sc. Physics', 'Marks > 60 in Science', 150000, 'Science'),
('B.Sc. Mathematics', 'Marks > 60 in Science', 150000, 'Science'),
('B.A. English', 'Any Stream', 150000, 'Arts'),
('B.A. History', 'Any Stream', 150000, 'Arts')
ON CONFLICT DO NOTHING;
