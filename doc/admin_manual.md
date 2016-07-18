# Admin manual for the ANDI application

## Admin

An admin is a user that log into the ANDI admin module and manage users
(i.e., deactivate them), allowed mail domains, and allowed email addresses.

### Create new admin

To create a new admin you can run the Django management command `createsuperuser`:

```
python manage.py createsuperuser
```

And follow the steps.

You can also add a new admin through the user interface.

1. Log in to the admin interface
2. Click Add next to Users (under Authentication and Authorization)
3. Type user name and password (twice)
4. Click save
5. Check staff status box (under Permissions)
6. Check superuser status box (under Permissions)
7. Click save again (at the bottom of the page)

### Change admin

### Delete admin

## Users

### Create user

### Change user

### Delete user

## User management

To make sure not everybody can make an account for the ANDI application, there
are restrictions on the email addresses that can be used. Only users that specify
an email address with an allowed domain, or email addresses that are on the
whitelist can make an account.

An email address consists of two parts: user and domain. The user is everything
before the @ and domain is everything that comes after the @. If you want to allow all
people with a specific email domain to make an account for the ANDI application,
add that domain as an `allowed email domain`.

If you want to allow individuals that do not have an email address with an allowed
email domain, you can add these email addresses to the `allowed email adresses`.

## Allowed mail domains

To manage dom


## Allowed mail addresses
