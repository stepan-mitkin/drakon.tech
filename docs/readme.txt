DrakonHub environment


HTTP Server
===========
DrakonHub does not support SSL; therefore in a production environment, it needs to run behind an HTTP server, for example, NGINX or Apache. See configuration file examples in the "scripts" folder: scripts/nginx.conf, etc.
In a test environment, it is possible to run DrakonHub without SSL.

When DrakonHub runs behind an HTTP server with SSL support, set the following configuration values (see app/onpremlua):
global_cfg.host = "127.0.0.1"
global_cfg.insecure_cookie = false

When DrakonHub runs without an HTTP server, set these values:
global_cfg.host = "<actual server IP or 127.0.0.1 for locahost>"
global_cfg.insecure_cookie = true

Sending Emails
==============
DrakonHub sends emails with passwords after user registration and on password reset. 
For debug installations, it is possible to turn the sending of actual emails off by setting this value in the configuration file:

global_cfg.debug_mail = true

In the debug mail mode, DrakonHub sends emails as text files in the /dewt/tmp folder.

DrakonHub sends emails with an additional tarantool process via https://www.mailgun.com/.
The configuration for the email process is in https_sender.lua.
The email tarantool process is installed as a normal tarantool service:

1. Copy https_send.lua to /etc/tarantool/instances.available
2. Put a symlink to /etc/tarantool/instances.available/https_send.lua in folder /etc/tarantool/instances.enabled:
sudo ln -s /etc/tarantool/instances.available/https_send.lua /etc/tarantool/instances.enabled/https_send.lua
3. Start the email tarantool service:
sudo tarantoolctl start https_sender

The MailGun key should be put in /dewt/app/external_creds.lua:

return {
    mg_key = "key- your mail gun key"
}
