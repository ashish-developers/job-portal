# Employer Guide — Job Portal API

Base URL: `http://localhost:3000`

---

## Overview

An employer goes through two distinct phases:

| Phase | What happens |
|-------|-------------|
| **Phase 1 – Onboarding** | Register → verify email → create company profile |
| **Phase 2 – Operations** | Login as sub-user → post jobs → manage applications |

---

## Phase 1 — Onboarding

### Step 1 — Register

`POST /api/v1/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@acme.com",
  "password": "Secret123!",
  "role": "employer"
}
```

**Response**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

> An OTP is sent to the registered email. It is valid for **30 minutes**.

---

### Step 2 — Verify Email

`POST /api/v1/auth/verify-email`

```json
{
  "email": "john@acme.com",
  "otp": "482910"
}
```

**Response**
```json
{ "success": true }
```

> Didn't receive the OTP? Call `POST /api/v1/auth/resend-otp` with `{ "email": "..." }`.

---

### Step 3 — Login (User JWT)

`POST /api/v1/auth/login`

```json
{
  "email": "john@acme.com",
  "password": "Secret123!"
}
```

**Response**
```json
{
  "success": true,
  "accessToken": "<USER_JWT>",
  "user": { "id": 1, "role": "employer", "status": "pending_profile" }
}
```

> Save the `accessToken`. Use it as `Authorization: Bearer <USER_JWT>` in the next step only.

---

### Step 4 — Create Company Profile

`POST /api/v1/employer/profile`
**Header:** `Authorization: Bearer <USER_JWT>`

```json
{
  "company_name": "Acme Corp",
  "company_email": "hr@acme.com",
  "company_phone": "+911234567890",
  "industry_id": 1,
  "company_size_id": 3,
  "website_url": "https://acme.com",
  "description": "We build great products.",
  "founded_year": 2015,
  "headquarters_city": "Bengaluru",
  "company_address": "123 MG Road, Bengaluru",
  "contact_name": "John Doe",
  "contact_designation": "CEO",
  "contact_phone": "+911234567890"
}
```

**Response**
```json
{
  "success": true,
  "message": "Company profile created.",
  "data": { "id": 1, "company_name": "Acme Corp", "verification_status": "PENDING", ... }
}
```

> This also creates an **Admin sub-user** with your registered email and password.  
> Your account is now in `PENDING` verification — a platform admin will review it.

---

### Step 5 — Login as Employer Sub-User (Employer JWT)

`POST /api/v1/employer/auth/login`

```json
{
  "email": "john@acme.com",
  "password": "Secret123!"
}
```

**Response**
```json
{
  "success": true,
  "accessToken": "<EMPLOYER_JWT>",
  "user": { "id": 1, "employer_id": 1, "is_admin": true }
}
```

> From here on, use `<EMPLOYER_JWT>` for all employer operations.  
> This is a **different token** from the user JWT in Step 3.

---

## Phase 2 — Operations

Use `Authorization: Bearer <EMPLOYER_JWT>` for all requests below.

---

### Get Company Profile

`GET /api/v1/employer/profile`

---

### Update Company Profile

`PUT /api/v1/employer/profile`

```json
{
  "description": "Updated company description.",
  "logo_url": "https://acme.com/logo.png",
  "linkedin_url": "https://linkedin.com/company/acme"
}
```

---

### Post a Job

`POST /api/v1/jobs`

```json
{
  "title": "Senior Backend Engineer",
  "description": "We are looking for a Node.js expert...",
  "requirements": "5+ years Node.js, PostgreSQL experience",
  "city_id": 1,
  "work_mode_id": 3,
  "employment_type_id": 1,
  "experience_level_id": 4,
  "salary_min": 1500000,
  "salary_max": 2500000,
  "currency_id": 1,
  "skills": [1, 2, 6]
}
```

> Job is created with `status: draft`. You must publish it separately.

**Publish the job**

`PATCH /api/v1/jobs/:id/publish`

**Close the job**

`PATCH /api/v1/jobs/:id/close`

---

### View Your Jobs

`GET /api/v1/jobs`

Optional query params: `?status=published&page=1&limit=20`

---

### View Applications for a Job

`GET /api/v1/seeker/jobs/:jobId/applications`

Optional: `?status=applied&page=1`

---

### Update Application Status

`PATCH /api/v1/seeker/applications/:id/status`

```json
{
  "status": "shortlisted",
  "employer_notes": "Strong profile, schedule interview"
}
```

**Available statuses (in order):**

| Status | Meaning |
|--------|---------|
| `applied` | Seeker just applied |
| `screening` | Under initial review |
| `shortlisted` | Selected for next round |
| `interview_scheduled` | Interview booked |
| `offer_extended` | Offer made |
| `hired` | Candidate accepted |
| `rejected` | Not selected |

---

### Search Candidates

`GET /api/v1/search/candidates?query=node.js&experienceLevelId=3`

**Find matched candidates for a specific job**

`GET /api/v1/search/candidates/for-job/:jobId`

---

## Team Management (Sub-Users & Roles)

### Available Permissions

| Permission slug | What it allows |
|----------------|----------------|
| `jobs:view` | View job listings |
| `jobs:create` | Post new jobs |
| `jobs:edit` | Edit / publish / close jobs |
| `jobs:delete` | Delete jobs |
| `applications:view` | View applications |
| `applications:edit` | Update application status |
| `users:view` | View sub-users |
| `users:create` | Add sub-users |
| `users:edit` | Edit sub-users |
| `users:delete` | Remove sub-users |
| `roles:view` | View roles |
| `roles:create` | Create roles |
| `roles:edit` | Edit roles / permissions |
| `roles:delete` | Delete roles |

---

### Create a Role

`POST /api/v1/employer/roles`

```json
{
  "name": "HR Manager",
  "description": "Manages hiring",
  "permission_ids": [5, 6, 7]
}
```

### Add / Remove Permissions on a Role

`POST /api/v1/employer/roles/:id/permissions/add`
```json
{ "permissions": ["jobs:view", "applications:view"] }
```

`POST /api/v1/employer/roles/:id/permissions/remove`
```json
{ "permissions": ["jobs:delete"] }
```

---

### Add a Sub-User

`POST /api/v1/employer/users`

```json
{
  "name": "Jane Smith",
  "email": "jane@acme.com",
  "password": "Pass1234!",
  "role_id": 2
}
```

> Jane logs in via `POST /api/v1/employer/auth/login` with her credentials and gets an employer JWT scoped to her permissions.

---

## Master Data Reference

Use these endpoints to get IDs for `industry_id`, `city_id`, `skill` IDs, etc.

`GET /api/v1/master` — list all resource types  
`GET /api/v1/master/industries` — all industries  
`GET /api/v1/master/cities` — all cities  
`GET /api/v1/master/skills` — all skills  
`GET /api/v1/master/employment-types` — employment types  
`GET /api/v1/master/experience-levels` — experience levels  
`GET /api/v1/master/work-modes` — work modes  
`GET /api/v1/master/currencies` — currencies  
`GET /api/v1/master/company-sizes` — company sizes  

---

## Token Summary

| Token | Obtained from | Used for |
|-------|--------------|---------|
| **User JWT** | `POST /auth/login` | Step 4 (create profile) only |
| **Employer JWT** | `POST /employer/auth/login` | All employer operations |

> Never mix them up — using a User JWT on employer routes returns `401 Use employer login token`.

---

## Forgot Password

`POST /api/v1/employer/auth/forgot-password`
```json
{ "email": "john@acme.com" }
```

A reset link is emailed. Then:

`POST /api/v1/employer/auth/reset-password`
```json
{
  "email": "john@acme.com",
  "token": "<token_from_email>",
  "password": "NewPass456!"
}
```
