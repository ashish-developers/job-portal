'use strict';

module.exports = {
  async up(queryInterface) {
    // ── Qualifications (linked to education_levels by label lookup) ─────────────
    const eduLevels = await queryInterface.sequelize.query(
      `SELECT id, label FROM education_levels`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const eduId = (label) => eduLevels.find(e => e.label === label)?.id;

    await queryInterface.bulkInsert('qualifications', [
      // High School
      { label: 'Class X (SSC)',       education_level_id: eduId('High School'),       is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Class XII (HSC)',      education_level_id: eduId('High School'),       is_active: true, created_at: new Date(), updated_at: new Date() },
      // Diploma
      { label: 'Diploma in Engineering', education_level_id: eduId('Diploma'),        is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Diploma in Computer Science', education_level_id: eduId('Diploma'),   is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'Polytechnic Diploma',   education_level_id: eduId('Diploma'),         is_active: true, created_at: new Date(), updated_at: new Date() },
      // Bachelor's
      { label: 'B.E. / B.Tech',         education_level_id: eduId("Bachelor's Degree"), is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'B.Sc',                  education_level_id: eduId("Bachelor's Degree"), is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'BCA',                   education_level_id: eduId("Bachelor's Degree"), is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'B.Com',                 education_level_id: eduId("Bachelor's Degree"), is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'BBA',                   education_level_id: eduId("Bachelor's Degree"), is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'B.A.',                  education_level_id: eduId("Bachelor's Degree"), is_active: true, created_at: new Date(), updated_at: new Date() },
      // Master's
      { label: 'M.E. / M.Tech',         education_level_id: eduId("Master's Degree"), is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'MCA',                   education_level_id: eduId("Master's Degree"), is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'MBA',                   education_level_id: eduId("Master's Degree"), is_active: true, created_at: new Date(), updated_at: new Date() },
      { label: 'M.Sc',                  education_level_id: eduId("Master's Degree"), is_active: true, created_at: new Date(), updated_at: new Date() },
      // PhD
      { label: 'Ph.D.',                 education_level_id: eduId('Doctorate (PhD)'), is_active: true, created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });

    // ── Job Roles (linked to departments by dept_code lookup) ───────────────────
    const depts = await queryInterface.sequelize.query(
      `SELECT id, dept_code FROM departments`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const deptId = (code) => depts.find(d => d.dept_code === code)?.id;

    await queryInterface.bulkInsert('job_roles', [
      // Engineering
      { role_title: 'Software Engineer',          dept_id: deptId('ENG'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Senior Software Engineer',   dept_id: deptId('ENG'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Lead Engineer',              dept_id: deptId('ENG'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Frontend Developer',         dept_id: deptId('ENG'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Backend Developer',          dept_id: deptId('ENG'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Full Stack Developer',       dept_id: deptId('ENG'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'DevOps Engineer',            dept_id: deptId('ENG'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'QA Engineer',                dept_id: deptId('ENG'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Mobile Developer (Android)', dept_id: deptId('ENG'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Mobile Developer (iOS)',     dept_id: deptId('ENG'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      // Product
      { role_title: 'Product Manager',            dept_id: deptId('PM'),   is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Associate Product Manager',  dept_id: deptId('PM'),   is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Product Analyst',            dept_id: deptId('PM'),   is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      // Design
      { role_title: 'UI/UX Designer',             dept_id: deptId('DES'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Graphic Designer',           dept_id: deptId('DES'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Motion Designer',            dept_id: deptId('DES'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      // Data
      { role_title: 'Data Analyst',               dept_id: deptId('DATA'), is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Data Scientist',             dept_id: deptId('DATA'), is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Data Engineer',              dept_id: deptId('DATA'), is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'ML Engineer',                dept_id: deptId('DATA'), is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      // Marketing
      { role_title: 'Marketing Manager',          dept_id: deptId('MKT'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'SEO Specialist',             dept_id: deptId('MKT'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Content Writer',             dept_id: deptId('MKT'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Digital Marketing Executive',dept_id: deptId('MKT'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      // Sales
      { role_title: 'Sales Executive',            dept_id: deptId('SAL'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Business Development Manager', dept_id: deptId('SAL'), is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Account Manager',            dept_id: deptId('SAL'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      // HR
      { role_title: 'HR Executive',               dept_id: deptId('HR'),   is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'HR Manager',                 dept_id: deptId('HR'),   is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Talent Acquisition Specialist', dept_id: deptId('HR'), is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      // Finance
      { role_title: 'Financial Analyst',          dept_id: deptId('FIN'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Accountant',                 dept_id: deptId('FIN'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Finance Manager',            dept_id: deptId('FIN'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      // Operations
      { role_title: 'Operations Manager',         dept_id: deptId('OPS'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Project Manager',            dept_id: deptId('OPS'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Scrum Master',               dept_id: deptId('OPS'),  is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      // Customer Support
      { role_title: 'Customer Support Executive', dept_id: deptId('CS'),   is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
      { role_title: 'Customer Success Manager',   dept_id: deptId('CS'),   is_active: true, is_approved: true, created_at: new Date(), updated_at: new Date() },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('job_roles', null, {});
    await queryInterface.bulkDelete('qualifications', null, {});
  },
};
