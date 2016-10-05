# Admin manual for the ANDI application

The ANDI admin module provides the user management functionality for the ANDI application. The admin module can be found at URL.

To log into the ANDI admin module, you need an admin account (a.k.a. superuser account). [Create a new admin account.](#Create new admin)

The picture below shows a screenshot of the ANDI admin module.

![screenshot ANDI admin module](https://github.com/jvdzwaan/ANDI-frontend/blob/django/doc/img/andi-admin.png?raw=true "Screenshot of the ANDI admin module")

The admin interface shows the different parts of the user administration. The most important parts are 'Allowed e mail addresss' and 'Allowed mail domains' under 'Accounts', and 'Users' under 'Authentication and Authorization'.

## Accounts

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

### Allowed e mail addresses

To add or change the email addresses on the whitelist, click 'Add' or 'Change' behind 'Allowed e mail addresss'. Clicking 'Allowed e mail addresss' shows a list of all the email addresses on the whitelist. From here new email addresses can be added, and existing ones can be changed or deleted by clicking on the respective links.

**Please note** that deleting an email address from this list stops the person with that email address from creating a new account only. How to delete a user is explained [here](#Delete user).

### Allowed mail domains

To add or change the email domains on the whitelist, click 'Add' or 'Change' behind 'Allowed mail domains'. Clicking 'Allowed mail domains' shows a list of all the mail domains on the whitelist. From here new mail domains can be added, and existing ones can be changed or deleted by clicking on the respective links.

## Authentication and Authorization

To be able to use the ANDI application, users have to make an account. It is advisable to have each user create their own account. When people create an account, they receive an email to activate their account. Without activation, the ANDI application cannot be used.

An admin is a user that can log into the ANDI admin module and manage users (i.e., deactivate them), allowed mail domains, and allowed email addresses.

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

### Delete user

To stop a user from accessing the ANDI application, an admin user has to deactivate this person's account.

1. Click 'Users' in the Admin module
2. Select the user you want to deactivate from the list
3. Deselect the checkbox 'Active' under 'Permissions'.
4. Click 'Save' (at the bottom of the page)

**Please note** The admin module allows you to delete complete 'User' objects (and 'Andi user profiles'). If you delete a user and his user profile this way, nothing stops them from creating a new account (if their email domain is on the list of allowed mail domains or if their email address is on the list of allowed email addresses). So, if you want to stop a user from accessing the ANDI application, deactivate his account and do not delete him.
