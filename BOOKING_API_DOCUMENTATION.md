# Booking API Documentation

This file covers all booking APIs for users and CRM/admin users.

Base URLs:
- User booking APIs: `/api/bookings/`
- CRM booking APIs: `/api/crm/bookings/`

Authentication:
- User booking APIs require user JWT access token.
- CRM booking APIs require CRM/admin JWT access token and role permissions.

Booking statuses:
- `new`
- `in_progress`
- `quoted`
- `confirmed`
- `cancelled`
- `closed`

Guest gender values:
- `male`
- `female`
- `other`

Common user booking fields:
- `service`: required Service ID.
- `service_item`: optional HotelInfo ID. Required only when selected service has `booking_mode=items` or `requires_service_item=true`.
- `message`: optional text, max 2000 chars.
- `consent_to_contact`: optional boolean, default `true`.
- `guests`: required non-empty list of guest objects.

Guest object:
```json
{
  "name": "Amit Kumar",
  "age": 35,
  "gender": "male"
}
```

Important validation rules:
- User must be authenticated.
- User must have required profile data before booking.
- `service` must be active.
- `service` slug must match the endpoint being called.
- `guests` must contain at least one guest.
- If `service_item` is required, it must belong to the selected `service`.
- If service does not support service items, sending `service_item` returns validation error.
- Date end fields cannot be earlier than start fields.

Common create success response:
```json
{
  "success": true,
  "message": "Booking request submitted successfully.",
  "data": {
    "id": 10,
    "booking": {
      "id": 125,
      "user": 7,
      "service": 1,
      "service_name": "Hotel Reservations",
      "service_slug": "hotel-reservations",
      "service_item": 12,
      "service_item_title": "Taj Palace",
      "service_item_city": "Delhi",
      "service_item_location": "Chanakyapuri",
      "number_of_guests": 2,
      "message": "Need early check-in if possible.",
      "consent_to_contact": true,
      "status": "new",
      "remarks": "",
      "admin_notes": "",
      "guests": [
        {"id": 1, "name": "Amit Kumar", "age": 35, "gender": "male"},
        {"id": 2, "name": "Priya Kumar", "age": 32, "gender": "female"}
      ],
      "created": "2026-07-31T10:30:00Z",
      "updated": "2026-07-31T10:30:00Z"
    },
    "check_in_date": "2026-08-01",
    "check_in_time": "14:00:00",
    "check_out_date": "2026-08-03",
    "check_out_time": "11:00:00",
    "number_of_rooms": 1,
    "number_of_guests": 2,
    "budget_amount": "5000.00",
    "td_tariff_amount": "4500.00"
  }
}
```

## User Booking Create APIs

All create APIs use `POST` and require user authentication.

| Service | Endpoint | Detail Fields |
| --- | --- | --- |
| Airport Transfers | `/api/bookings/airport-transfers/` | `pickup_location`, `drop_location`, `pickup_date`, `pickup_time`, `transfer_type`, `vehicle_type`, `number_of_passengers`, `flight_or_train_number` |
| Bus Ticket Booking | `/api/bookings/bus-ticket-booking/` | `from_city`, `to_city`, `travel_date`, `preferred_time`, `bus_type`, `number_of_passengers` |
| Catering Services | `/api/bookings/catering-services/` | `event_date`, `event_time`, `event_location`, `event_type`, `number_of_guests`, `cuisine_preference`, `meal_type` |
| Corporate Travel | `/api/bookings/corporate-travel/` | `company_name`, `travel_purpose`, `from_city`, `to_city`, `departure_date`, `return_date`, `number_of_travellers` |
| Cruise Booking | `/api/bookings/cruise-booking/` | `destination`, `departure_port`, `departure_date`, `return_date`, `cabin_type`, `number_of_passengers` |
| Currency Exchange | `/api/bookings/currency-exchange/` | `currency_from`, `currency_to`, `amount`, `exchange_city`, `required_date` |
| Event Management | `/api/bookings/event-management/` | `event_type`, `event_date`, `event_location`, `number_of_guests`, `budget_amount`, `requirements` |
| Flight Booking | `/api/bookings/flight-booking/` | `from_city`, `to_city`, `departure_date`, `return_date`, `trip_type`, `travel_class`, `preferred_airline`, `number_of_passengers` |
| Group Tour | `/api/bookings/group-tour/` | `destination`, `start_date`, `end_date`, `number_of_people`, `tour_type`, `budget_amount` |
| Holiday Packages | `/api/bookings/holiday-packages/` | `destination`, `start_date`, `end_date`, `number_of_people`, `package_type`, `budget_amount` |
| Honeymoon Packages | `/api/bookings/honeymoon-packages/` | `destination`, `start_date`, `end_date`, `number_of_people`, `package_type`, `budget_amount` |
| Hotel Consultancy | `/api/bookings/hotel-consultancy/` | `city`, `preferred_location`, `check_in_date`, `check_out_date`, `number_of_rooms`, `number_of_guests`, `budget_amount`, `requirements` |
| Hotel Reservations | `/api/bookings/hotel-reservations/` | `check_in_date`, `check_in_time`, `check_out_date`, `check_out_time`, `number_of_rooms`, `number_of_guests`, `budget_amount`, `td_tariff_amount` |
| International Tours | `/api/bookings/international-tours/` | `countries`, `start_date`, `end_date`, `number_of_people`, `budget_amount`, `visa_required` |
| Self-Drive Car Rentals | `/api/bookings/self-drive-car-rentals/` | `pickup_city`, `pickup_location`, `pickup_date`, `pickup_time`, `dropoff_date`, `dropoff_time`, `vehicle_type`, `driving_license_number` |
| Taxi Services | `/api/bookings/taxi-services/` | `pickup_location`, `drop_location`, `pickup_date`, `pickup_time`, `trip_type`, `vehicle_type`, `number_of_passengers` |
| Train Ticket Booking | `/api/bookings/train-ticket-booking/` | `from_station`, `to_station`, `travel_date`, `preferred_train`, `travel_class`, `number_of_passengers` |
| Travel Insurance | `/api/bookings/travel-insurance/` | `destination_country`, `travel_start_date`, `travel_end_date`, `number_of_travellers`, `coverage_type` |
| Visa Assistance | `/api/bookings/visa-assistance/` | `destination_country`, `visa_type`, `travel_date`, `appointment_city`, `number_of_applicants` |

## User Payload Examples

### Airport Transfers
`POST /api/bookings/airport-transfers/`
```json
{
  "service": 1,
  "pickup_location": "Delhi Airport T3",
  "drop_location": "Chanakyapuri",
  "pickup_date": "2026-08-01",
  "pickup_time": "10:30:00",
  "transfer_type": "airport_to_hotel",
  "vehicle_type": "sedan",
  "number_of_passengers": 2,
  "flight_or_train_number": "AI-101",
  "message": "Need driver details before pickup.",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Bus Ticket Booking
`POST /api/bookings/bus-ticket-booking/`
```json
{
  "service": 2,
  "from_city": "Delhi",
  "to_city": "Jaipur",
  "travel_date": "2026-08-05",
  "preferred_time": "08:00:00",
  "bus_type": "AC Sleeper",
  "number_of_passengers": 2,
  "message": "",
  "guests": [
    {"name": "Amit Kumar", "age": 35, "gender": "male"},
    {"name": "Priya Kumar", "age": 32, "gender": "female"}
  ],
  "consent_to_contact": true
}
```

### Catering Services
`POST /api/bookings/catering-services/`
```json
{
  "service": 3,
  "event_date": "2026-08-10",
  "event_time": "19:00:00",
  "event_location": "Delhi Cantonment",
  "event_type": "official dinner",
  "number_of_guests": 80,
  "cuisine_preference": "North Indian",
  "meal_type": "dinner",
  "message": "Include vegetarian options.",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Corporate Travel
`POST /api/bookings/corporate-travel/`
```json
{
  "service": 4,
  "company_name": "BHLI LLP",
  "travel_purpose": "meeting",
  "from_city": "Delhi",
  "to_city": "Mumbai",
  "departure_date": "2026-08-12",
  "return_date": "2026-08-15",
  "number_of_travellers": 3,
  "message": "",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Cruise Booking
`POST /api/bookings/cruise-booking/`
```json
{
  "service": 5,
  "destination": "Goa",
  "departure_port": "Mumbai",
  "departure_date": "2026-09-01",
  "return_date": "2026-09-04",
  "cabin_type": "balcony",
  "number_of_passengers": 2,
  "message": "",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Currency Exchange
`POST /api/bookings/currency-exchange/`
```json
{
  "service": 6,
  "currency_from": "INR",
  "currency_to": "USD",
  "amount": "50000.00",
  "exchange_city": "Delhi",
  "required_date": "2026-08-02",
  "message": "Need pickup from office if possible.",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Event Management
`POST /api/bookings/event-management/`
```json
{
  "service": 7,
  "event_type": "conference",
  "event_date": "2026-08-20",
  "event_location": "New Delhi",
  "number_of_guests": 150,
  "budget_amount": "250000.00",
  "requirements": "Stage, AV, registration desk, and lunch.",
  "message": "",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Flight Booking
`POST /api/bookings/flight-booking/`
```json
{
  "service": 8,
  "from_city": "Delhi",
  "to_city": "Mumbai",
  "departure_date": "2026-08-10",
  "return_date": "2026-08-12",
  "trip_type": "round_trip",
  "travel_class": "economy",
  "preferred_airline": "Air India",
  "number_of_passengers": 2,
  "message": "Prefer morning departure.",
  "guests": [
    {"name": "Amit Kumar", "age": 35, "gender": "male"},
    {"name": "Priya Kumar", "age": 32, "gender": "female"}
  ],
  "consent_to_contact": true
}
```

### Group Tour
`POST /api/bookings/group-tour/`
```json
{
  "service": 9,
  "destination": "Rajasthan",
  "start_date": "2026-09-10",
  "end_date": "2026-09-15",
  "number_of_people": 12,
  "tour_type": "family group",
  "budget_amount": "180000.00",
  "message": "",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Holiday Packages
`POST /api/bookings/holiday-packages/`
```json
{
  "service": 10,
  "destination": "Kerala",
  "start_date": "2026-10-01",
  "end_date": "2026-10-06",
  "number_of_people": 4,
  "package_type": "family",
  "budget_amount": "120000.00",
  "message": "Include houseboat stay.",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Honeymoon Packages
`POST /api/bookings/honeymoon-packages/`
```json
{
  "service": 11,
  "destination": "Maldives",
  "start_date": "2026-11-01",
  "end_date": "2026-11-05",
  "number_of_people": 2,
  "package_type": "premium",
  "budget_amount": "250000.00",
  "message": "",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Hotel Consultancy
`POST /api/bookings/hotel-consultancy/`
```json
{
  "service": 12,
  "city": "Delhi",
  "preferred_location": "Near airport",
  "check_in_date": "2026-08-01",
  "check_out_date": "2026-08-03",
  "number_of_rooms": 2,
  "number_of_guests": 4,
  "budget_amount": "10000.00",
  "requirements": "Need family rooms.",
  "message": "",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Hotel Reservations
`POST /api/bookings/hotel-reservations/`
```json
{
  "service": 13,
  "service_item": 12,
  "check_in_date": "2026-08-01",
  "check_in_time": "14:00:00",
  "check_out_date": "2026-08-03",
  "check_out_time": "11:00:00",
  "number_of_rooms": 1,
  "number_of_guests": 2,
  "budget_amount": "5000.00",
  "td_tariff_amount": "4500.00",
  "message": "Near airport. Need early check-in if possible.",
  "guests": [
    {"name": "Amit Kumar", "age": 35, "gender": "male"},
    {"name": "Priya Kumar", "age": 32, "gender": "female"}
  ],
  "consent_to_contact": true
}
```

### International Tours
`POST /api/bookings/international-tours/`
```json
{
  "service": 14,
  "countries": "France, Switzerland",
  "start_date": "2026-12-10",
  "end_date": "2026-12-20",
  "number_of_people": 2,
  "budget_amount": "500000.00",
  "visa_required": true,
  "message": "",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Self-Drive Car Rentals
`POST /api/bookings/self-drive-car-rentals/`
```json
{
  "service": 15,
  "pickup_city": "Delhi",
  "pickup_location": "IGI Airport",
  "pickup_date": "2026-08-01",
  "pickup_time": "10:00:00",
  "dropoff_date": "2026-08-05",
  "dropoff_time": "18:00:00",
  "vehicle_type": "SUV",
  "driving_license_number": "DL-1234567890",
  "message": "",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Taxi Services
`POST /api/bookings/taxi-services/`
```json
{
  "service": 16,
  "pickup_location": "Delhi Airport",
  "drop_location": "India Gate",
  "pickup_date": "2026-08-01",
  "pickup_time": "09:30:00",
  "trip_type": "one_way",
  "vehicle_type": "sedan",
  "number_of_passengers": 2,
  "message": "",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Train Ticket Booking
`POST /api/bookings/train-ticket-booking/`
```json
{
  "service": 17,
  "from_station": "New Delhi",
  "to_station": "Jaipur",
  "travel_date": "2026-08-08",
  "preferred_train": "Ajmer Shatabdi",
  "travel_class": "CC",
  "number_of_passengers": 2,
  "message": "",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Travel Insurance
`POST /api/bookings/travel-insurance/`
```json
{
  "service": 18,
  "destination_country": "Singapore",
  "travel_start_date": "2026-09-01",
  "travel_end_date": "2026-09-07",
  "number_of_travellers": 2,
  "coverage_type": "family",
  "message": "",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

### Visa Assistance
`POST /api/bookings/visa-assistance/`
```json
{
  "service": 19,
  "destination_country": "United Kingdom",
  "visa_type": "tourist",
  "travel_date": "2026-10-15",
  "appointment_city": "Delhi",
  "number_of_applicants": 2,
  "message": "Need document checklist.",
  "guests": [{"name": "Amit Kumar", "age": 35, "gender": "male"}],
  "consent_to_contact": true
}
```

## User Booking History APIs

### Booking History
`GET /api/bookings/requests/history/`

Auth: User JWT

Query params:
- `service`: optional Service ID.
- `service_slug`: optional service slug.
- `status`: optional booking status.

Response:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 125,
      "user": 7,
      "service": 13,
      "service_name": "Hotel Reservations",
      "service_slug": "hotel-reservations",
      "service_item": 12,
      "service_item_title": "Taj Palace",
      "service_item_city": "Delhi",
      "service_item_location": "Chanakyapuri",
      "number_of_guests": 2,
      "message": "Need early check-in if possible.",
      "consent_to_contact": true,
      "status": "new",
      "remarks": "",
      "admin_notes": "",
      "guests": [
        {"id": 1, "name": "Amit Kumar", "age": 35, "gender": "male"}
      ],
      "created": "2026-07-31T10:30:00Z",
      "updated": "2026-07-31T10:30:00Z"
    }
  ]
}
```

### Booking Detail
`GET /api/bookings/requests/<booking_request_id>/`

Auth: User JWT

Note: User can only view their own booking request.

### Cancel Booking
`POST /api/bookings/requests/<booking_request_id>/cancel/`

Auth: User JWT

Payload:
```json
{
  "reason": "Plan changed."
}
```

Response:
```json
{
  "success": true,
  "message": "Booking request cancelled successfully.",
  "data": {
    "id": 125,
    "status": "cancelled",
    "remarks": "Plan changed."
  }
}
```

### Admin User Booking List
`GET /api/bookings/requests/list/`

Auth: Django admin/staff user

Query params:
- `service`
- `service_slug`
- `status`

Note: This is a legacy/admin list endpoint and returns common `BookingRequest` data only. CRM-specific booking APIs below are preferred for CRM panel.

## CRM Booking APIs

CRM routes are separate per service type.

List:
`GET /api/crm/bookings/<service-slug>/`

Detail:
`GET /api/crm/bookings/<service-slug>/<detail_id>/`

Update:
`PUT /api/crm/bookings/<service-slug>/<detail_id>/`
`PATCH /api/crm/bookings/<service-slug>/<detail_id>/`

Delete:
`DELETE /api/crm/bookings/<service-slug>/<detail_id>/`

Create is not allowed from CRM:
`POST /api/crm/bookings/<service-slug>/` returns HTTP 405.

CRM permissions:
- List/retrieve: `can_read`
- Update/patch: `can_update`
- Delete: `can_delete`
- Create: disabled; bookings should be created from user APIs.

CRM list query params:
- `search`: searches user first name, last name, email, profile mobile number, employee ID, guest names, service name, and hotel item title.
- `service`: Service ID.
- `service_slug`: service slug.
- `status`: booking status.
- `date_from`: booking created date lower bound, format `YYYY-MM-DD`.
- `date_to`: booking created date upper bound, format `YYYY-MM-DD`.
- `page`: page number.
- `page_size`: page size, default `20`, max `100`.

CRM paginated list response:
```json
{
  "success": true,
  "count": 25,
  "next": "https://your-domain.com/api/crm/bookings/hotel-reservations/?page=2",
  "previous": null,
  "page": 1,
  "page_size": 20,
  "total_pages": 2,
  "data": [
    {
      "id": 10,
      "booking": {
        "id": 125,
        "user": 7,
        "user_info": {
          "id": 7,
          "username": "user@example.com",
          "email": "user@example.com",
          "first_name": "Amit",
          "last_name": "Kumar",
          "is_active": true,
          "date_joined": "2026-07-31T10:00:00Z",
          "profile": {
            "id": 4,
            "mobile_number": "9999999999",
            "service_number": "SN-100",
            "officer_rank": 1,
            "pay_level": "10",
            "employee_id": "EMP-100",
            "department": 1,
            "profile_image": "image-url-or-null"
          }
        },
        "service": 13,
        "service_name": "Hotel Reservations",
        "service_slug": "hotel-reservations",
        "service_item": 12,
        "service_item_title": "Taj Palace",
        "service_item_city": "Delhi",
        "service_item_location": "Chanakyapuri",
        "number_of_guests": 2,
        "message": "Need early check-in if possible.",
        "consent_to_contact": true,
        "status": "new",
        "remarks": "",
        "admin_notes": "",
        "guests": [
          {"id": 1, "name": "Amit Kumar", "age": 35, "gender": "male"}
        ],
        "status_history": [],
        "created": "2026-07-31T10:30:00Z",
        "updated": "2026-07-31T10:30:00Z"
      },
      "check_in_date": "2026-08-01",
      "check_in_time": "14:00:00",
      "check_out_date": "2026-08-03",
      "check_out_time": "11:00:00",
      "number_of_rooms": 1,
      "number_of_guests": 2,
      "budget_amount": "5000.00",
      "td_tariff_amount": "4500.00"
    }
  ]
}
```

CRM update common payload fields:
- `status`: optional, one of booking statuses.
- `status_note`: optional note saved to status history only when status changes.
- `remarks`: optional customer-visible/internal remarks.
- `admin_notes`: optional admin notes.
- `message`: optional update to common booking message.
- `guests`: optional full replacement list of guests.
- Any detail field belonging to that service.

CRM update payload example:
```json
{
  "status": "quoted",
  "status_note": "Quote shared with customer.",
  "remarks": "Quote sent.",
  "admin_notes": "Follow up tomorrow.",
  "budget_amount": "5500.00",
  "guests": [
    {"name": "Amit Kumar", "age": 35, "gender": "male"},
    {"name": "Priya Kumar", "age": 32, "gender": "female"}
  ]
}
```

CRM update response:
```json
{
  "success": true,
  "message": "Booking request updated successfully.",
  "data": {
    "id": 10,
    "booking": {
      "id": 125,
      "status": "quoted",
      "remarks": "Quote sent.",
      "admin_notes": "Follow up tomorrow.",
      "status_history": [
        {
          "id": 1,
          "old_status": "new",
          "new_status": "quoted",
          "note": "Quote shared with customer.",
          "changed_by": 3,
          "changed_by_email": "crm@example.com",
          "created_at": "2026-07-31T11:00:00Z"
        }
      ]
    },
    "budget_amount": "5500.00"
  }
}
```

CRM delete response:
```json
{
  "success": true,
  "message": "Booking request deleted successfully."
}
```

## CRM Booking Endpoints By Service

| Service | List Endpoint | Detail Endpoint |
| --- | --- | --- |
| Airport Transfers | `/api/crm/bookings/airport-transfers/` | `/api/crm/bookings/airport-transfers/<detail_id>/` |
| Bus Ticket Booking | `/api/crm/bookings/bus-ticket-booking/` | `/api/crm/bookings/bus-ticket-booking/<detail_id>/` |
| Catering Services | `/api/crm/bookings/catering-services/` | `/api/crm/bookings/catering-services/<detail_id>/` |
| Corporate Travel | `/api/crm/bookings/corporate-travel/` | `/api/crm/bookings/corporate-travel/<detail_id>/` |
| Cruise Booking | `/api/crm/bookings/cruise-booking/` | `/api/crm/bookings/cruise-booking/<detail_id>/` |
| Currency Exchange | `/api/crm/bookings/currency-exchange/` | `/api/crm/bookings/currency-exchange/<detail_id>/` |
| Event Management | `/api/crm/bookings/event-management/` | `/api/crm/bookings/event-management/<detail_id>/` |
| Flight Booking | `/api/crm/bookings/flight-booking/` | `/api/crm/bookings/flight-booking/<detail_id>/` |
| Group Tour | `/api/crm/bookings/group-tour/` | `/api/crm/bookings/group-tour/<detail_id>/` |
| Holiday Packages | `/api/crm/bookings/holiday-packages/` | `/api/crm/bookings/holiday-packages/<detail_id>/` |
| Honeymoon Packages | `/api/crm/bookings/honeymoon-packages/` | `/api/crm/bookings/honeymoon-packages/<detail_id>/` |
| Hotel Consultancy | `/api/crm/bookings/hotel-consultancy/` | `/api/crm/bookings/hotel-consultancy/<detail_id>/` |
| Hotel Reservations | `/api/crm/bookings/hotel-reservations/` | `/api/crm/bookings/hotel-reservations/<detail_id>/` |
| International Tours | `/api/crm/bookings/international-tours/` | `/api/crm/bookings/international-tours/<detail_id>/` |
| Self-Drive Car Rentals | `/api/crm/bookings/self-drive-car-rentals/` | `/api/crm/bookings/self-drive-car-rentals/<detail_id>/` |
| Taxi Services | `/api/crm/bookings/taxi-services/` | `/api/crm/bookings/taxi-services/<detail_id>/` |
| Train Ticket Booking | `/api/crm/bookings/train-ticket-booking/` | `/api/crm/bookings/train-ticket-booking/<detail_id>/` |
| Travel Insurance | `/api/crm/bookings/travel-insurance/` | `/api/crm/bookings/travel-insurance/<detail_id>/` |
| Visa Assistance | `/api/crm/bookings/visa-assistance/` | `/api/crm/bookings/visa-assistance/<detail_id>/` |

## Error Responses

Validation error:
```json
{
  "success": false,
  "errors": {
    "service": ["Selected service must be 'hotel-reservations'."]
  }
}
```

Not found:
```json
{
  "success": false,
  "message": "Booking request not found."
}
```

Server error:
```json
{
  "success": false,
  "message": "Unable to submit booking request."
}
```
