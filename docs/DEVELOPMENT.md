## Prerequisites

- For the last step you should have a running local Nginx web server on your Mac.
  Step 1: Install and configure Dnsmasq
  Use brew to install Dnsmasq.

```bash
$ brew install dnsmasq
```

Create a configuration file.

```bash
$ /usr/local/etc/dnsmasq.conf
```

And add the following line to forward all `*.run` requests to localhost (`127.0.0.1`).

```text
address=/run/127.0.0.1
```

Next, use brew’s services feature to start Dnsmasq as a service. Use sudo to ensure that it is started when your Mac boots, otherwise it will only start after you login.

```bash
$ sudo brew services restart dnsmasq
```

You can verify your changes using the dig command by querying your local Dnsmasq instance.

```bash
$ dig foobar.run @127.0.0.1`
```

You should get an answer back that points to 127.0.0.1.

`https://medium.com/@hjblokland/how-to-setup-automatic-local-domains-with-dnsmasq-and-nginx-on-macos-5f34174bdf82`
