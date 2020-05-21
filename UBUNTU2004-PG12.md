# Configuring PostgreSQL 12 on Ubuntu 20.04

The following notes will help setting up a local instance of PostgreSQL 12 on Ubuntu 20.04.

Note that SSL is configured by default.

## Install PostgreSQL

1. Install Postgresql from the default repositories.

   ```bash
   sudo apt update

   sudo apt install postgresql postgresql-contrib
   ```

1. Check connectivity to the db as the postgres user.

   ```bash
   sudo -i -u postgres

   psql

   postgres=# \conninfo
   You are connected to database "postgres" as user "postgres" via socket in "/var/run/postgresql" at port "5432".
   postgres=# \q
   ```

1. Create a DB user account for your linux account. Replacing `<YOUR_LINUX_USERNAME>` with your linux account name.

   ```bash
   createuser -s -e -w <YOUR_LINUX_USERNAME>

   exit # exit the postgres account session
   ```

1. Create a Login DB in a session as your user.

   ```bash
   createdb $USER
   ```

1. Check connectivity with via your linux account.

   ```bash
   $ psql

   postgres=# \conninfo
   You are connected to database "<YOUR_LINUX_USERNAME>" as user "<YOUR_LINUX_USERNAME>" via socket in "/var/run/postgresql" at port "5432".
   postgres=# \q
   ```

## Edit pg_hba.conf

For local development, the DB must trust local connections.

1. Find the `pg_hba.conf` file.

   ```bash
   $ sudo find /etc -name "pg_hba.conf"
   /etc/postgresql/12/main/pg_hba.conf
   ```

1. Create a backup - just in case!

   ```bash
   $ sudo cp /etc/postgresql/12/main/pg_hba.conf /etc/postgresql/12/main/pg_hba.conf.bak
   ```

1. Edit the file

   ```bash
   sudo nano /etc/postgresql/12/main/pg_hba.conf
   ```

   Replace `md5` with `trust` in the following line

   ```bash
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            md5
   ```

   Save and quit.

1. Restart postgres

   ```bash
   sudo service postgresql restart
   ```

You should now be able to continue the steps in detailed in the [README](README.md#setup-the-database)

## References

- [How To Install PostgreSQL on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart)
- [PostgreSQL - createuser](https://www.postgresql.org/docs/12/app-createuser.html)
- [Configure PostgreSQL to allow remote connection](https://blog.bigbinary.com/2016/01/23/configure-postgresql-to-allow-remote-connection.html)
