# 💪️ powerlifting.gg

[![Node.js CI](https://github.com/wajeht/powerlifting.gg/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/wajeht/powerlifting.gg/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/wajeht/powerlifting.gg/blob/main/LICENSE) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/wajeht/powerlifting.gg)

multitenancy coaching review systems

> [!WARNING]
> This project is unfinished and heavily work in progress.

# 🤔 Why?

`JavaScript` does not suck. Most developers ~~(You)~~ have skill issues and suck at writing `JavaScript`. Here is a very simple multi-tenancy application with each tenant operating with its own subdomain.

How cool is that? I'd say it is pretty cool!

We're using traditional server-side rendering with `Vue` as a client on some parts of the app where it makes complete sense and needs extensive interactivity. With a combination of modern tools like `Tailwind`, `Vitest`, `Playwright`, and more, your imagination is the limit.

You might be asking: why not use `Next`, `Nuxt`, or some other `meta-framework`? This project seems like a hack and blah blah blah.

SHUT UP!

This whole codebase is `readable`, `extensible`, `testable`, and lastly, there is no damn `MAGIC` under the hood!

# 📚 Technologies

- **Express** for HTTP router and basic middleware
- **[ejs](https://www.npmjs.com/package/ejs)** for server side rendering
- **SQLite** for database
- **[knex.js](https://github.com/knex/knex)** for database migration and query
- **Vue 3** with **Vite** tooling for UI
- **[daisyUI](https://daisyui.com/)** for tailwind compatible ready made components
- **[Animate.css](https://animate.style/)** for ready made animation
- **[Commander.js](https://www.npmjs.com/package/commander)** for CLI commands
- **Redis** to cache some of the large queries

> [!Note]
> Why not typescript?
>
> Talk is cheap. Submit `PR` instead!
>
> You're more then welcome to convert this whole project into `Typescript`

# 💻 Development

See [DEVELOPMENT](./docs/DEVELOPMENT.md) for more information.

# 📜 License

Distributed under the MIT License © [wajeht](https://www.github.com/wajeht). See [LICENSE](./LICENSE) for more information.
