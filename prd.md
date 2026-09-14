. Overview

Save The Beach SL is a website for a beach-cleaning organisation. It gives the public information about the organisation, lets people register for volunteer cleanup events, and hosts a community-driven media/blog section where people can share articles and thoughts about beach cleaning. An admin manages events, volunteer registrations, and content moderation.

2. Goals
Raise awareness of the organisation's mission and activities
Make it easy for the public to find and register for upcoming beach cleanup events
Build a community voice through a moderated blog/media section
Give the admin a single place to manage events, volunteers, and content
3. Non-Goals (for v1)
Payment processing / donations (can be a future phase)
Public user profiles or social features (likes, comments, follows)
Mobile app (site should be responsive, but no native app in v1)
4. User Roles
Role	Description	Auth Required
Visitor	General public browsing the site	No
Event Registrant	Anyone registering for a cleanup event	No — anonymous per-event form
Contributor	Someone who wants to submit a blog/media post	Yes — lightweight account (signup/login)
Admin	Manages events, registrations, and content moderation	Yes — admin login
5. Features & Requirements
5.1 Home Page
Organisation mission statement / tagline
Impact stats (e.g. events held, volunteers registered, bags collected — manually updatable by admin)
Call-to-action buttons: "Register for an Event" / "Read the Blog"
5.2 About Page
Organisation story, mission, and goals
Team / founders info (optional)
Contact details (email, social links)
5.3 Events Page
List of upcoming events (title, date, location, short description, spots remaining)
Event detail page with full description, map/location, and a "Register" button
Past events optionally shown separately (for credibility/history)
5.4 Volunteer Registration
Simple form on each event's detail page: name, email, phone, (optional: emergency contact, notes)
No account required
Submission stored against that specific event
Confirmation message shown after submitting (email confirmation optional for v1.1)
5.5 Media & Blog
Public feed of approved posts only
Anyone can submit a post, but must first create a lightweight contributor account (signup/login)
New submissions default to status pending
Admin reviews and either approves (goes live) or rejects (with optional reason) each submission
Posts support title, body text, and images
5.6 Contributor Accounts
Signup: name, email, password
Login: email, password
Contributors can see the status of their own submitted posts (pending / approved / rejected)
5.7 Admin Dashboard

Accessible only to admin-role accounts. Includes:

Registrations view: list of volunteers per event, exportable (e.g. CSV)
Event management: create, edit, delete events
Content moderation: view pending posts, approve or reject, delete any existing post
User management (optional v1.1): view contributor accounts
6. Data Model (high level)
Event: id, title, description, date, location, capacityLimit, createdAt
Registration: id, name, email, phone, eventId, createdAt
User: id, name, email, passwordHash, role (contributor | admin), createdAt
Post: id, title, body, images, authorId, status (pending | approved | rejected), createdAt
7. Technical Approach
Framework: Next.js (App Router) — combined frontend + backend
Database: PostgreSQL (via Neon, Railway, or Vercel Postgres)
ORM: Prisma
Auth: NextAuth.js or lightweight custom email/password auth, with a role field distinguishing contributor vs admin
Hosting: Vercel (app) + Railway/Neon (database)
8. Site Map
Route	Purpose	Access
/	Home	Public
/about	About the organisation	Public
/events	Upcoming events list	Public
/events/[id]	Event detail + registration	Public
/blog	Approved posts feed	Public
/blog/[id]	Single post	Public
/blog/new	Submit a post	Contributor login required
/signup, /login	Contributor account creation/login	Public
/admin	Dashboard (registrations, moderation, events)	Admin only
9. Success Metrics
Number of volunteers registered per event
Number of blog posts submitted and approved
Growth in event attendance over time
Site traffic to Events and Blog pages
10. Build Phases

Phase 1 — Foundation Static Home, About, and Events pages with placeholder content.

Phase 2 — Core Utility Database + Prisma setup; real Events data; working volunteer registraation form.

Phase 3 — Community Content Contributor signup/login; blog post submission flow (defaults to pending).

Phase 4 — Admin Control Admin dashboard: view/export registrations, approve/reject/delete posts, create/edit/delete events.