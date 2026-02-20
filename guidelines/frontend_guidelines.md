# TickiTacka — Frontend Feature & Page Requirements

> Auto-generated from backend analysis. Use this as a prompt reference for frontend design.

---

## Roles

| Role                        | Description                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| **User**                    | Regular customer — can browse events, buy tickets, manage transactions, write reviews           |
| **EO** (Event Organizer)    | Can create/manage events, manage ticket types, manage transactions, view dashboard & statistics |
| **Guest** (unauthenticated) | Can browse events, view event details, view reviews                                             |

---

## 1. Register Page

### Route: `/register`

**Form (User Registration):**

- `email` — required, email format
- `username` — required, unique
- `password` — required, min 6 chars
- `fullName` — required
- `phoneNumber` — required
- `referralCode` — optional (input field for entering someone else's code)
- `role` — toggle/selector between **User** and **EO**

**Additional Fields (if role = EO):**

- `organizerName` — required
- `companyAddress` — required

**Flow:**

1. User fills out form
2. If EO is selected → show additional organizer fields
3. If referral code provided → validated against existing users
4. On success → JWT token set as httpOnly cookie → redirect to homepage
5. If referral code used:
   - Referrer gets **10,000 points** (expires in 3 months)
   - New user (referee) gets a **10% discount coupon** (expires in 3 months)

**API:** `POST /api/auth/register`

---

## 2. Login Page

### Route: `/login`

**Form:**

- `email` — required
- `password` — required

**Flow:**

1. User enters credentials
2. On success → JWT token set as httpOnly cookie → redirect based on role:
   - **User** → Homepage or last visited page
   - **EO** → Organizer Dashboard
3. On error → show "Invalid email or password"

**API:** `POST /api/auth/login`

---

## 3. Forgot Password Page

### Route: `/forgot-password`

**Form:**

- `email` — required

**Flow:**

1. User enters their email
2. On submit → always show generic success message: _"If an account with that email exists, a password reset link has been sent"_
3. Rate limited: max 5 requests per 15 minutes per IP

**API:** `POST /api/auth/forgot-password`

---

## 4. Reset Password Page

### Route: `/reset-password?token=<token>`

**Form:**

- `newPassword` — required, min 6 chars
- `confirmPassword` — required (frontend validation only)

**Flow:**

1. Page reads `token` from URL query parameter
2. User enters new password
3. On submit → sends token + newPassword to API
4. On success → show success message → redirect to login
5. Token expires after 15 minutes, and is single-use

**API:** `POST /api/auth/reset-password`

---

## 5. Homepage / Event Discovery Page

### Route: `/` or `/events`

**Components:**

- Hero/banner section
- Search bar (searches event name)
- Filter by **category** (dropdown — from `/api/categories`)
- Filter by **city** (dropdown — from location API)
- Event card grid (paginated)

**Each Event Card shows:**

- Event image (first image)
- Event name
- Event date
- Venue name
- City name
- Category name
- Lowest ticket price (from `ticketTypes`)

**Query Parameters:**

- `search` — string (name search)
- `category` — categoryId (UUID)
- `city` — cityId (UUID)
- `page` — number (default 1)
- `limit` — number (default 10)

**Flow:**

1. Page loads → fetch events from API (published, upcoming only)
2. User filters/searches → re-fetch with query params
3. Click on event card → navigate to `/events/:slug`

**APIs:**

- `GET /api/events` — public
- `GET /api/categories` — public
- `GET /api/locations/provinces` — public
- `GET /api/locations/provinces/:provinceId/cities` — public

---

## 6. Event Detail Page

### Route: `/events/:slug`

**Sections:**

- Event image gallery (carousel or grid)
- Event name, date, time, end date/time
- Category badge
- Location info: city, venue name, venue address
- Description (rich text / markdown)
- **Ticket Types list** — each showing: name, description, price, available quota
- **Event Vouchers** (if any, shown to logged-in users)
- **Reviews section** (paginated, with average rating summary)

**Components:**

- "Buy Ticket" button → opens ticket selection / redirects to checkout (User only)
- "Write Review" button (appears if: user is logged in, event date has passed, user has a completed transaction, user hasn't reviewed yet)

**Review Form (inline or modal):**

- `rating` — required, 1-5 stars
- `reviewText` — optional, textarea

**APIs:**

- `GET /api/events/:slug` — public
- `GET /api/events/:eventId/ticket-types` — public
- `GET /api/events/:eventId/reviews?page=&limit=` — public
- `POST /api/events/:eventId/reviews` — User only, authenticated

---

## 7. Checkout / Create Transaction Page

### Route: `/events/:slug/checkout` or `/checkout`

**Requires:** Authenticated User (role = User)

**Form:**

- **Ticket selection:**
  - For each ticket type: name, price, quantity selector (min 0, max = available quota)
  - At least 1 ticket must be selected
- **Discount section:**
  - Toggle: **Use Points** (shows available point balance)
  - Select: **User Coupon** (dropdown of user's unused, non-expired coupons)
  - Input: **Event Voucher** (select from vouchers attached to the event)
- **Order summary:**
  - Subtotal
  - Points discount
  - Coupon discount
  - Voucher discount
  - **Total Amount**
- Payment deadline: 2 hours from creation

**Flow:**

1. User selects ticket types + quantities
2. Optionally applies points/coupon/voucher
3. Frontend calculates estimated total (for preview)
4. Clicks "Place Order" → creates transaction via API
5. If `totalAmount = 0` → transaction auto-confirmed (status = `done`)
6. If `totalAmount > 0` → status = `waiting_for_payment` → redirect to transaction detail to upload payment proof

**API:** `POST /api/transactions`

**Request Body:**

```json
{
  "eventId": "uuid",
  "items": [{ "ticketTypeId": "uuid", "quantity": 2 }],
  "usePoints": true,
  "userCouponId": "uuid",
  "eventVoucherId": "uuid"
}
```

---

## 8. My Transactions Page (Customer)

### Route: `/my-transactions` or `/transactions`

**Requires:** Authenticated User (role = User)

**Components:**

- Filter by status: `waiting_for_payment`, `waiting_for_admin_confirmation`, `done`, `canceled`, `expired`
- Paginated transaction list

**Each Transaction Card shows:**

- Event image (thumbnail)
- Event name
- Invoice number
- Total amount
- Payment status (with color-coded badge)
- Created date
- Ticket details (ticket type names, quantities)

**Flow:**

1. Page loads → fetch user's transactions
2. Can filter by status
3. Click on transaction → go to transaction detail page

**API:** `GET /api/transactions?status=&page=&limit=`

---

## 9. Transaction Detail Page (Customer)

### Route: `/transactions/:id`

**Requires:** Authenticated User (role = User)

**Shows:**

- Invoice number
- Event name, date, time, venue
- Transaction items: ticket type, qty, unit price, subtotal per item
- Points used
- Coupon discount
- Voucher discount
- Total amount
- Payment status
- Payment deadline (countdown if waiting)
- Payment proof image (if uploaded)

**Actions:**

- **Upload Payment Proof** — if status = `waiting_for_payment` and deadline not passed
  - File upload input (single image)
  - On upload → status changes to `waiting_for_admin_confirmation`
  - Confirmation deadline: 3 days from proof upload
- **Cancel Transaction** — if status = `waiting_for_payment`
  - Confirms with modal
  - Rollback: restores points, coupon, voucher, ticket quota

**APIs:**

- `GET /api/transactions/:id`
- `PATCH /api/transactions/:id/payment-proof` (multipart/form-data, field: `paymentProof`)
- `PATCH /api/transactions/:id/cancel`

---

## 10. User Profile Page

### Route: `/profile` or `/settings`

**Requires:** Authenticated (any role)

**Sections:**

### 10a. View Profile

- Profile picture (with upload/change button)
- Username
- Full name
- Email (read-only)
- Phone number
- Role
- Referral code (display + copy button)
- If EO: Organizer name, Company address

### 10b. Edit Profile Form

- `username` — optional to change, unique validation
- `fullName` — optional
- `phoneNumber` — optional
- `profilePicture` — file upload (max 1MB, jpg/jpeg/png/gif/webp)
- If EO:
  - `organizerName` — optional
  - `companyAddress` — optional

### 10c. Change Password Form

- `oldPassword` — required
- `newPassword` — required, min 6 chars, must differ from old
- `confirmPassword` — frontend validation

**APIs:**

- `GET /api/users/profile`
- `PATCH /api/users/profile` (multipart/form-data, field: `profilePicture`)
- `PATCH /api/users/password`

---

## 11. Organizer Dashboard — My Events Page

### Route: `/dashboard/events` (EO only)

**Requires:** Authenticated EO

**Components:**

- Filter by status: `draft`, `published`, `completed`, `canceled`
- Search by event name
- Filter by category
- Paginated event list/table

**Each Event Row/Card shows:**

- Event image (thumbnail)
- Event name
- Category
- City
- Status badge (draft/published/completed/canceled)
- Event date
- Ticket sold count vs total quota
- Transaction count
- Action buttons: Edit, Publish, Cancel, Delete, View Statistics

**Flow:**

1. Page loads → fetch organizer's events
2. Filter/search → re-fetch
3. Click event → navigate to event edit or detail page

**API:** `GET /api/organizer/events?status=&search=&category=&page=&limit=`

---

## 12. Create Event Page

### Route: `/dashboard/events/create` (EO only)

**Requires:** Authenticated EO

**Form:**

- `name` — required, text
- `categoryId` — required, dropdown (from `/api/categories`)
- `eventDate` — required, date picker
- `eventTime` — required, time picker
- `endDate` — optional, date picker
- `endTime` — optional, time picker
- `cityId` — required, cascading dropdown:
  1. Select Province (from `/api/locations/provinces`)
  2. Select City (from `/api/locations/provinces/:id/cities`)
- `venueName` — required, text
- `venueAddress` — required, textarea
- `description` — required, rich text / textarea
- `images` — required, file upload (up to 3 images)
- **Ticket Types** (dynamic list, at least 1 required):
  - `name` — required
  - `description` — optional
  - `price` — required, number (0 = free)
  - `quota` — required, number (min 1)
  - Add/remove ticket type buttons

**Flow:**

1. EO fills out the form
2. Event is created with status = `draft`
3. After creation → redirect to event edit page or event list
4. EO must **Publish** separately once ready

**API:** `POST /api/events` (multipart/form-data, field: `images`)

---

## 13. Edit Event Page

### Route: `/dashboard/events/:id/edit` (EO only)

**Requires:** Authenticated EO, must own the event

**Form:** Same as Create Event but pre-filled

**Additional features:**

- Re-upload images (replaces all existing)
- **Manage Ticket Types** (separate sub-section):
  - List existing ticket types
  - Add new ticket type
  - Edit existing (cannot reduce quota below soldCount)
  - Delete ticket type (only if soldCount = 0)

**APIs:**

- `PUT /api/events/:id` (multipart/form-data)
- `GET /api/events/:eventId/ticket-types`
- `POST /api/events/:eventId/ticket-types`
- `PUT /api/events/:eventId/ticket-types/:ticketTypeId`
- `DELETE /api/events/:eventId/ticket-types/:ticketTypeId`

---

## 14. Publish / Cancel Event (Actions, not separate pages)

**Actions available from Event Edit or My Events page:**

### Publish Event

- Validates: must have category, city, venue, description, at least 1 ticket type, at least 1 image
- Changes status from `draft` → `published`
- **API:** `PATCH /api/events/:id/publish`

### Cancel Event

- Allowed for `draft` or `published` events
- Changes status to `canceled`
- **API:** `PATCH /api/events/:id/cancel`

### Delete Event (soft delete)

- Soft deletes the event + cleans up Cloudinary images
- **API:** `DELETE /api/events/:id`

---

## 15. Create Event Voucher (Modal or sub-page)

### Route: `/dashboard/events/:id/vouchers/create` or inline modal

**Requires:** Authenticated EO, must own the event

**Form:**

- `voucherCode` — required, unique, string
- `voucherName` — required, string
- `discountType` — required, select: `percentage` or `fixed`
- `discountValue` — required, number
- `maxUsage` — required, number
- `maxDiscount` — optional, number (only for percentage type)
- `startDate` — required, datetime
- `expiredAt` — required, datetime
- `isActive` — boolean toggle (default true)

**API:** `POST /api/events/:eventId/vouchers`

---

## 16. Organizer Transaction Management Page

### Route: `/dashboard/transactions` (EO only)

**Requires:** Authenticated EO

**Components:**

- Filter by status: `waiting_for_payment`, `waiting_for_admin_confirmation`, `done`, `canceled`, `expired`, `rejected`
- Filter by event (dropdown of organizer's events)
- Paginated transaction table

**Each Transaction Row shows:**

- Customer info: name, email, avatar
- Event name
- Invoice number
- Total amount
- Payment status badge
- Created date
- Action buttons (Accept / Reject — only for `waiting_for_admin_confirmation`)

**APIs:**

- `GET /api/transactions/organizer?status=&eventId=&page=&limit=`

---

## 17. Organizer Transaction Detail Page

### Route: `/dashboard/transactions/:id` (EO only)

**Requires:** Authenticated EO

**Shows:**

- Customer info (name, email, avatar)
- Invoice number
- Event name
- Transaction items (ticket types, quantities, prices)
- Points used, coupon details, voucher details
- Subtotal, discounts breakdown, total amount
- Payment status
- Payment proof image (viewable/zoomable)
- Proof uploaded at timestamp
- Confirmation deadline

**Actions:**

- **Accept** — only if status = `waiting_for_admin_confirmation`
  - Changes status to `done`, sets confirmedAt
  - Sends acceptance email to customer
  - **API:** `PATCH /api/transactions/:id/accept`
- **Reject** — only if status = `waiting_for_admin_confirmation`
  - Rolls back: tickets, points, coupons, vouchers
  - Changes status to `rejected`
  - Sends rejection email to customer
  - **API:** `PATCH /api/transactions/:id/reject`

---

## 18. Organizer Dashboard — Statistics Page (Aggregate)

### Route: `/dashboard/statistics` (EO only)

**Requires:** Authenticated EO

**Summary Cards:**

- Total Revenue (all events, confirmed transactions)
- Total Events
- Total Tickets Sold
- Total Attendees (unique transactions)

**Chart Section:**

- Filter by: `year` | `month` | `day`
- If month: filter by year (default = current year)
- If day: filter by year + month
- Line/Bar chart showing:
  - Revenue over time
  - Tickets sold over time
  - Transaction count over time

**API:** `GET /api/organizer/statistics?filterBy=month&year=2026&month=2`

---

## 19. Organizer Dashboard — Per-Event Statistics Page

### Route: `/dashboard/events/:eventId/statistics` (EO only)

**Requires:** Authenticated EO

**Shows:**

- Event info: name, status, event date
- **Summary:**
  - Total revenue
  - Total tickets sold
  - Total attendees
- **Ticket Breakdown Table:**
  - Per ticket type: name, price, quota, sold count, revenue
- **Chart** (same as aggregate but filtered to single event)

**API:** `GET /api/organizer/events/:eventId/statistics?filterBy=month&year=2026`

---

## 20. Organizer — Event Attendees Page

### Route: `/dashboard/events/:eventId/attendees` (EO only)

**Requires:** Authenticated EO

**Shows:**

- Event name
- Paginated attendee list (from confirmed transactions)

**Each Row:**

- Customer avatar
- Customer name
- Customer email
- Invoice number
- Ticket types + quantities
- Total paid
- Purchase date

**API:** `GET /api/organizer/events/:eventId/attendees?page=&limit=`

---

## 21. Reviews Section (Embedded in Event Detail)

### Route: Part of `/events/:slug`

**Public view:**

- Average rating (stars + number)
- Total review count
- Paginated review cards:
  - User avatar, username, full name
  - Rating (stars)
  - Review text
  - Created date

**Authenticated User actions:**

- "Write Review" button (if eligible — event date passed + has completed transaction + hasn't reviewed yet)
- Review form: rating (1-5 stars), review text (optional)

**APIs:**

- `GET /api/events/:eventId/reviews?page=&limit=`
- `POST /api/events/:eventId/reviews`

---

## Background Processes (No UI, but affects UX)

### Auto-Expire Transactions

- Cron job runs periodically
- Transactions with status `waiting_for_payment` past `paymentDeadline` (2 hours) → auto-changed to `expired`
- Rollback: tickets, points, coupons, vouchers restored

### Auto-Cancel Unconfirmed Transactions

- Cron job runs periodically
- Transactions with status `waiting_for_admin_confirmation` past `confirmationDeadline` (3 days) → auto-changed to `canceled`
- Rollback: tickets, points, coupons, vouchers restored

> **Frontend impact:** Transaction status may change between page loads. Use real-time polling or display countdown timers for deadlines.

---

## Summary — All Frontend Pages Needed

| #   | Page                           | Route                                     | Auth                   | Role |
| --- | ------------------------------ | ----------------------------------------- | ---------------------- | ---- |
| 1   | Register                       | `/register`                               | No                     | —    |
| 2   | Login                          | `/login`                                  | No                     | —    |
| 3   | Forgot Password                | `/forgot-password`                        | No                     | —    |
| 4   | Reset Password                 | `/reset-password?token=`                  | No                     | —    |
| 5   | Homepage / Event Discovery     | `/` or `/events`                          | No                     | —    |
| 6   | Event Detail                   | `/events/:slug`                           | No (reviews need auth) | —    |
| 7   | Checkout                       | `/events/:slug/checkout`                  | Yes                    | User |
| 8   | My Transactions (list)         | `/transactions`                           | Yes                    | User |
| 9   | Transaction Detail             | `/transactions/:id`                       | Yes                    | User |
| 10  | User Profile / Settings        | `/profile`                                | Yes                    | Any  |
| 11  | Dashboard — My Events          | `/dashboard/events`                       | Yes                    | EO   |
| 12  | Create Event                   | `/dashboard/events/create`                | Yes                    | EO   |
| 13  | Edit Event                     | `/dashboard/events/:id/edit`              | Yes                    | EO   |
| 14  | Create Voucher                 | Modal or `/dashboard/events/:id/vouchers` | Yes                    | EO   |
| 15  | Dashboard — Transactions       | `/dashboard/transactions`                 | Yes                    | EO   |
| 16  | Transaction Detail (Organizer) | `/dashboard/transactions/:id`             | Yes                    | EO   |
| 17  | Dashboard — Statistics         | `/dashboard/statistics`                   | Yes                    | EO   |
| 18  | Per-Event Statistics           | `/dashboard/events/:id/statistics`        | Yes                    | EO   |
| 19  | Event Attendees                | `/dashboard/events/:id/attendees`         | Yes                    | EO   |

---

## API Base URL

All endpoints are prefixed with: `/api`

### Public Endpoints (No Auth)

- `GET /api/events` — list published, upcoming events
- `GET /api/events/:slug` — event details
- `GET /api/events/:eventId/ticket-types` — ticket types for event
- `GET /api/events/:eventId/reviews` — reviews for event
- `GET /api/categories` — all event categories
- `GET /api/locations/provinces` — all provinces
- `GET /api/locations/provinces/:id/cities` — cities by province
- `GET /api/organizers/:organizerId/reviews` — reviews for organizer

### Auth Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/session` — get current user info (verifyToken)
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### User (Customer) Endpoints

- `GET /api/users/profile`
- `PATCH /api/users/profile`
- `PATCH /api/users/password`
- `POST /api/transactions`
- `GET /api/transactions`
- `GET /api/transactions/:id`
- `PATCH /api/transactions/:id/cancel`
- `PATCH /api/transactions/:id/payment-proof`
- `POST /api/events/:eventId/reviews`

### EO (Organizer) Endpoints

- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `PATCH /api/events/:id/publish`
- `PATCH /api/events/:id/cancel`
- `POST /api/events/:eventId/vouchers`
- `POST /api/events/:eventId/ticket-types`
- `PUT /api/events/:eventId/ticket-types/:ticketTypeId`
- `DELETE /api/events/:eventId/ticket-types/:ticketTypeId`
- `GET /api/transactions/organizer`
- `GET /api/transactions/organizer/:id`
- `PATCH /api/transactions/:id/accept`
- `PATCH /api/transactions/:id/reject`
- `GET /api/organizer/events`
- `GET /api/organizer/events/:eventId/attendees`
- `GET /api/organizer/statistics`
- `GET /api/organizer/events/:eventId/statistics`

---

## Payment Status Flow

```
[Create Transaction]
       │
       ▼
waiting_for_payment ──(2h timeout)──► expired
       │
       ▼ (upload proof)
waiting_for_admin_confirmation ──(3d timeout)──► canceled
       │                    │
       ▼ (accept)           ▼ (reject)
      done               rejected

waiting_for_payment ──(user cancel)──► canceled
```

---

## Event Status Flow

```
  draft ──(publish)──► published ──(event date passes)──► completed
    │                      │
    └──(cancel)──► canceled ◄──(cancel)──┘
```
