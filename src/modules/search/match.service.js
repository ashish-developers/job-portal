/**
 * Scoring weights (total = 100)
 *   skills      40 – most important signal
 *   experience  20
 *   location    15
 *   work_mode   10
 *   salary      10
 *   notice       5
 */

/**
 * Score a job against a seeker profile.
 * Both objects must have their associations loaded (skills, workMode, etc.)
 * Returns integer 0-100.
 */
const scoreJobForSeeker = (seeker, job) => {
  let score = 0;

  // ── Skills (40 pts) ────────────────────────────────────────────────────────
  const jobSkillIds = new Set((job.skills  || []).map(s => s.id));
  const seekSkillIds = new Set((seeker.skills || []).map(s => s.id));

  if (jobSkillIds.size === 0) {
    score += 40; // no skills required → full credit
  } else {
    const matched = [...jobSkillIds].filter(id => seekSkillIds.has(id)).length;
    score += Math.round((matched / jobSkillIds.size) * 40);
  }

  // ── Experience (20 pts) ────────────────────────────────────────────────────
  const exp    = parseFloat(seeker.total_experience_years) || 0;
  const minExp = job.min_experience ?? 0;
  const maxExp = job.max_experience ?? 99;

  if (exp >= minExp && exp <= maxExp) {
    score += 20;
  } else if (exp > maxExp) {
    score += 10; // overqualified, still relevant
  } else if (exp >= minExp - 1) {
    score += 12; // one year short
  }

  // ── Location (15 pts) ──────────────────────────────────────────────────────
  const jobRemote   = job.workMode?.label?.toLowerCase() === 'remote';
  const seekerRemote = seeker.workMode?.label?.toLowerCase() === 'remote';

  if (jobRemote || seekerRemote) {
    score += 15; // either side is remote → full location credit
  } else if (job.city_id && seeker.city_id && seeker.city_id === job.city_id) {
    score += 15;
  } else {
    const jobHybrid    = job.workMode?.label?.toLowerCase() === 'hybrid';
    const seekerHybrid = seeker.workMode?.label?.toLowerCase() === 'hybrid';
    if (jobHybrid || seekerHybrid) score += 7; // partial – hybrid tolerable
  }

  // ── Work Mode Preference (10 pts) ──────────────────────────────────────────
  if (!seeker.work_mode_id || !job.work_mode_id) {
    score += 5; // unknown → neutral
  } else if (seeker.work_mode_id === job.work_mode_id) {
    score += 10;
  }

  // ── Salary Compatibility (10 pts) ──────────────────────────────────────────
  const expected = parseFloat(seeker.expected_salary);
  const salMax   = parseFloat(job.salary_max);
  const salMin   = parseFloat(job.salary_min);

  if (!expected || !salMax) {
    score += 5; // no salary data → neutral
  } else if (expected <= salMax && (!salMin || expected >= salMin * 0.9)) {
    score += 10;
  } else if (expected <= salMax * 1.15) {
    score += 5; // slightly over budget
  }

  // ── Notice Period (5 pts) ─────────────────────────────────────────────────
  if (!job.notice_period_id) {
    score += 5;
  } else if (seeker.notice_period_id === job.notice_period_id) {
    score += 5;
  } else {
    score += 2; // mismatch but not a hard block
  }

  return Math.min(100, Math.round(score));
};

/**
 * Classify a numeric score into a human-readable tier.
 */
const matchTier = (score) => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'low';
};

/**
 * Attach { match_score, match_tier } to each item in an array.
 * scoreFn(item) must return a numeric score.
 */
const annotateWithScore = (items, scoreFn) =>
  items
    .map(item => {
      const raw = item.toJSON ? item.toJSON() : { ...item };
      const match_score = scoreFn(raw);
      return { ...raw, match_score, match_tier: matchTier(match_score) };
    })
    .sort((a, b) => b.match_score - a.match_score);

module.exports = { scoreJobForSeeker, matchTier, annotateWithScore };
