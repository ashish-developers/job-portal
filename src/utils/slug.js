const { Employer } = require('../models');

const toSlug = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const uniqueSlug = async (base) => {
  let slug = toSlug(base);
  let suffix = 0;
  while (await Employer.findOne({ where: { company_slug: slug } })) {
    suffix++;
    slug = `${toSlug(base)}-${suffix}`;
  }
  return slug;
};

module.exports = { toSlug, uniqueSlug };
