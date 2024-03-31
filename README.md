# ⭐️ powerlifting.gg

[![Node.js CI](https://github.com/wajeht/powerlifting.gg/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/wajeht/powerlifting.gg/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/wajeht/powerlifting.gg/blob/main/LICENSE) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/wajeht/powerlifting.gg)

multitenancy coaching review systems

> [!WARNING]
> This project is unfinished and heavily work in progress.

# 🤔 Why?

`JavaScript` does not suck. Most developers ~~(You)~~ have skill issues and suck at writing `JavaScript`. Here is a very simple multi-tenancy application with each tenant operating with its own subdomain.

How cool is that? I'd say it is pretty cool!

We're using traditional server-side rendering with `Vue` as a client on some parts of the apps where it makes complete sense! With a combination of modern tools like `Tailwind`, `Vitest`, `Playwright`, and more, your imagination is the limit.

You might be asking: why not use `Next`, `Nuxt`, or some other `meta-framework`? This project seems like a hack and blah blah blah.

SHUT UP!

This whole codebase is `readable`, `extensible`, `testable`, and lastly, there is no damn `MAGIC` under the hood!

# ✅ Todo

- [x] vitest
- [x] prod for demo
- [x] tenancy each subdomain
- [x] tailwind
- [x] vue
- [x] hot reload for vue/tailwind/express
- [x] dockernize
- [ ] eslint
- [ ] auth
- [x] email
- [ ] swagger
- [ ] job/queue
- [ ] web socket
- [ ] rbac
- [ ] playright
- [ ] test setup for ci
- [ ] litestream to auto backup sqlite to s3
- [ ] zero downtime
- [ ] submit tenant and super-admin approve
- [ ] reserve known coaches

# 💻 Development

See [DEVELOPMENT](./DEVELOPMENT.md) for more information.

# 📜 License

Distributed under the MIT License © [wajeht](https://www.github.com/wajeht). See [LICENSE](./LICENSE) for more information.
