CREATE DATABASE job_info_db;

USE job_info_db;

CREATE TABLE jobs (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    organization_name VARCHAR(255),
    role VARCHAR(255),
    stipend DECIMAL(10, 2),
    experience_years INT,
    location VARCHAR(255),
    job_description TEXT,
    other_details TEXT
);


select * from jobs
