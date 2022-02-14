#!/usr/bin/env bash

set -e

perl -pi -e 's/\{\{API_URL\}\}/$ENV{'API_URL'}/g' /usr/share/nginx/html/scripts/*
perl -pi -e 's/\{\{BILLING_URL\}\}/$ENV{'BILLING_URL'}/g' /usr/share/nginx/html/scripts/*
perl -pi -e 's/\{\{BUILDER_URL\}\}/$ENV{'BUILDER_URL'}/g' /usr/share/nginx/html/scripts/*
perl -pi -e 's/\{\{INTERCOM_APPID\}\}/$ENV{'INTERCOM_APPID'}/g' /usr/share/nginx/html/scripts/*
perl -pi -e 's/\{\{SENTRY_DSN\}\}/$ENV{'SENTRY_DSN'}/g' /usr/share/nginx/html/scripts/*

exec "$@"
