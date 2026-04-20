'use strict';

module.exports = {
  async up(queryInterface) {
    // Company Sizes
    await queryInterface.bulkInsert('company_sizes', [
      { label: '1-10',      min_count: 1,    max_count: 10,    is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: '11-50',     min_count: 11,   max_count: 50,    is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: '51-200',    min_count: 51,   max_count: 200,   is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: '201-500',   min_count: 201,  max_count: 500,   is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: '501-1000',  min_count: 501,  max_count: 1000,  is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: '1001-5000', min_count: 1001, max_count: 5000,  is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: '5000+',     min_count: 5001, max_count: null,  is_active: true, created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });

    // Industries
    await queryInterface.bulkInsert('industries', [
      { industry_name: 'Information Technology', industry_code: 'IT',       is_active: true, created_at: new Date(), updated_at: new Date() },
      { industry_name: 'Finance & Banking',      industry_code: 'FIN',      is_active: true, created_at: new Date(), updated_at: new Date() },
      { industry_name: 'Healthcare',             industry_code: 'HLTH',     is_active: true, created_at: new Date(), updated_at: new Date() },
      { industry_name: 'Education',              industry_code: 'EDU',      is_active: true, created_at: new Date(), updated_at: new Date() },
      { industry_name: 'E-Commerce',             industry_code: 'ECOM',     is_active: true, created_at: new Date(), updated_at: new Date() },
      { industry_name: 'Manufacturing',          industry_code: 'MFG',      is_active: true, created_at: new Date(), updated_at: new Date() },
      { industry_name: 'Real Estate',            industry_code: 'RE',       is_active: true, created_at: new Date(), updated_at: new Date() },
      { industry_name: 'Media & Entertainment',  industry_code: 'MEDIA',    is_active: true, created_at: new Date(), updated_at: new Date() },
      { industry_name: 'Logistics & Supply Chain', industry_code: 'LOG',    is_active: true, created_at: new Date(), updated_at: new Date() },
      { industry_name: 'Consulting',             industry_code: 'CONSULT',  is_active: true, created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });

    // Departments
    await queryInterface.bulkInsert('departments', [
      { dept_name: 'Engineering',         dept_code: 'ENG',  is_active: true, created_at: new Date(), updated_at: new Date() },
      { dept_name: 'Product Management',  dept_code: 'PM',   is_active: true, created_at: new Date(), updated_at: new Date() },
      { dept_name: 'Design',              dept_code: 'DES',  is_active: true, created_at: new Date(), updated_at: new Date() },
      { dept_name: 'Marketing',           dept_code: 'MKT',  is_active: true, created_at: new Date(), updated_at: new Date() },
      { dept_name: 'Sales',               dept_code: 'SAL',  is_active: true, created_at: new Date(), updated_at: new Date() },
      { dept_name: 'Human Resources',     dept_code: 'HR',   is_active: true, created_at: new Date(), updated_at: new Date() },
      { dept_name: 'Finance',             dept_code: 'FIN',  is_active: true, created_at: new Date(), updated_at: new Date() },
      { dept_name: 'Operations',          dept_code: 'OPS',  is_active: true, created_at: new Date(), updated_at: new Date() },
      { dept_name: 'Customer Support',    dept_code: 'CS',   is_active: true, created_at: new Date(), updated_at: new Date() },
      { dept_name: 'Data & Analytics',    dept_code: 'DATA', is_active: true, created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });

    // Experience Levels
    await queryInterface.bulkInsert('experience_levels', [
      { label: 'Fresher (0-1 yr)',    min_years: 0,  max_years: 1,  is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Junior (1-3 yrs)',    min_years: 1,  max_years: 3,  is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Mid-Level (3-6 yrs)', min_years: 3,  max_years: 6,  is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Senior (6-10 yrs)',   min_years: 6,  max_years: 10, is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Lead (10-15 yrs)',    min_years: 10, max_years: 15, is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Executive (15+ yrs)', min_years: 15, max_years: null, is_active: true, created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });

    // Employment Types
    await queryInterface.bulkInsert('employment_types', [
      { label: 'Full-time',   is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Part-time',   is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Contract',    is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Internship',  is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Freelance',   is_active: true, created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });

    // Education Levels
    await queryInterface.bulkInsert('education_levels', [
      { label: 'High School',          sort_order: 1, is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Diploma',              sort_order: 2, is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: "Bachelor's Degree",    sort_order: 3, is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: "Master's Degree",      sort_order: 4, is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Doctorate (PhD)',       sort_order: 5, is_active: true, created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });

    // Work Modes
    await queryInterface.bulkInsert('work_modes', [
      { label: 'On-site',  is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Remote',   is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Hybrid',   is_active: true, created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });

    // Notice Periods
    await queryInterface.bulkInsert('notice_periods', [
      { label: 'Immediate',    days: 0,   is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: '15 Days',      days: 15,  is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: '30 Days',      days: 30,  is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: '45 Days',      days: 45,  is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: '60 Days',      days: 60,  is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: '90 Days',      days: 90,  is_active: true, created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });

    // Currencies
    await queryInterface.bulkInsert('currencies', [
      { code: 'INR', name: 'Indian Rupee',   symbol: '₹', is_active: true, created_at: new Date(), updated_at: new Date() },
      { code: 'USD', name: 'US Dollar',      symbol: '$', is_active: true, created_at: new Date(), updated_at: new Date() },
      { code: 'EUR', name: 'Euro',           symbol: '€', is_active: true, created_at: new Date(), updated_at: new Date() },
      { code: 'GBP', name: 'British Pound',  symbol: '£', is_active: true, created_at: new Date(), updated_at: new Date() },
      { code: 'AED', name: 'UAE Dirham',     symbol: 'د.إ', is_active: true, created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });

    // Cities
    await queryInterface.bulkInsert('cities', [
      { city_name: 'Bengaluru', state: 'Karnataka',     country: 'India', is_active: true, created_at: new Date(), updated_at: new Date() },
      { city_name: 'Mumbai',    state: 'Maharashtra',   country: 'India', is_active: true, created_at: new Date(), updated_at: new Date() },
      { city_name: 'Delhi',     state: 'Delhi',         country: 'India', is_active: true, created_at: new Date(), updated_at: new Date() },
      { city_name: 'Hyderabad', state: 'Telangana',     country: 'India', is_active: true, created_at: new Date(), updated_at: new Date() },
      { city_name: 'Pune',      state: 'Maharashtra',   country: 'India', is_active: true, created_at: new Date(), updated_at: new Date() },
      { city_name: 'Chennai',   state: 'Tamil Nadu',    country: 'India', is_active: true, created_at: new Date(), updated_at: new Date() },
      { city_name: 'Kolkata',   state: 'West Bengal',   country: 'India', is_active: true, created_at: new Date(), updated_at: new Date() },
      { city_name: 'Ahmedabad', state: 'Gujarat',       country: 'India', is_active: true, created_at: new Date(), updated_at: new Date() },
      { city_name: 'Remote',    state: null,            country: null,    is_remote: true, is_active: true, created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });

    // Skills
    await queryInterface.bulkInsert('skills', [
      { skill_name: 'JavaScript',    skill_type: 'TECHNICAL', category: 'Programming', is_active: true, usage_count: 0, created_at: new Date(), updated_at: new Date() },
      { skill_name: 'Node.js',       skill_type: 'TECHNICAL', category: 'Backend',     is_active: true, usage_count: 0, created_at: new Date(), updated_at: new Date() },
      { skill_name: 'React',         skill_type: 'TECHNICAL', category: 'Frontend',    is_active: true, usage_count: 0, created_at: new Date(), updated_at: new Date() },
      { skill_name: 'Python',        skill_type: 'TECHNICAL', category: 'Programming', is_active: true, usage_count: 0, created_at: new Date(), updated_at: new Date() },
      { skill_name: 'Java',          skill_type: 'TECHNICAL', category: 'Programming', is_active: true, usage_count: 0, created_at: new Date(), updated_at: new Date() },
      { skill_name: 'SQL',           skill_type: 'TECHNICAL', category: 'Database',    is_active: true, usage_count: 0, created_at: new Date(), updated_at: new Date() },
      { skill_name: 'AWS',           skill_type: 'TECHNICAL', category: 'Cloud',       is_active: true, usage_count: 0, created_at: new Date(), updated_at: new Date() },
      { skill_name: 'Docker',        skill_type: 'TECHNICAL', category: 'DevOps',      is_active: true, usage_count: 0, created_at: new Date(), updated_at: new Date() },
      { skill_name: 'Communication', skill_type: 'SOFT',      category: 'Soft Skills', is_active: true, usage_count: 0, created_at: new Date(), updated_at: new Date() },
      { skill_name: 'Leadership',    skill_type: 'SOFT',      category: 'Soft Skills', is_active: true, usage_count: 0, created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface) {
    const tables = ['skills','cities','currencies','notice_periods','work_modes',
      'employment_types','experience_levels','departments','industries','company_sizes'];
    for (const t of tables) await queryInterface.bulkDelete(t, null, {});
  },
};
