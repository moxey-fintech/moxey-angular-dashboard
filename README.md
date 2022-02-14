# Rehive Angular admin dashboard

### Dashboard | Management and operations

Moxey's dashboard is designed to help you manage your product from end-to-end:
* invite new users, collect KYC documents, verify user information,
* clear deposits and withdrawals, manage and review transactions,
* manage customer support,
* set transaction fees, set transaction limits, set notification preferences,
* configure employee and user permissions
* and more.

### Getting started

* fork the repository
* git clone  `https://github.com/rehive/client-moxey-dashboard-angular`,
* cd into `client-moxey-dashboard-angular`
* make sure you have node v10.15.0 and npm v6.4.1,
* make sure to install bower: `npm install -g bower`
* run `npm install` to install the dependencies,
* to run local copy in development mode, execute: `gulp serve:local`,
* to run local copy in production mode from release folder, execute: `npm start`.

### Deployment

* commit all changes
* run `inv git_release` to increment the version and tag the release
* wait for the build trigger or run `inv cloudbuild <version>` to build and upload the latest docker image
* run `inv upgrade production` to add the latest image to kubernetes deployment

### Where can I learn more ?

Check us out at [Rehive](http://www.rehive.com/)
