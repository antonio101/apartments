# Installation

First of all, make sure you have Docker installed and you have available the following ports:

- 8080 → Frontend (React.js)
- 8000 → Backend (Laravel)
- 8443 → PHPMyAdmin
- 3308 → MySQL

## Launching Docker
```console
sudo docker-compose up --build
```

# Managing the APP

### Routes:

Frontend:
http://localhost:8080

API:
http://localhost:8000/api

Redis queues:
http://localhost:8000/horizon

PHPMyAdmin:
http://localhost:8443


# Testing
## Launch testing
```console
sudo docker exec backend /bin/sh -c "php artisan test --coverage-html reports"
```

### Coverage results
Open in your browser the following file:
/api/tests/coverage/index.html

# Usage

1. Create a new account with a real email.
2. Submit a new apartment.
3. As a guest user, send a booking request for this apartment. The landlord user will receive an email notification.
4. When the landlord approves a booking request, the apartment will be shown as unavailable.
