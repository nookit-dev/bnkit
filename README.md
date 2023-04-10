Using this library
Right now it own supports bun becuase this project will not rely on any external dependecies 






# no-dependency-app

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v0.5.9. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.



Create a render to webpage function


Hard limitations are I can only use:
- Bun
- TypeScript
- Sqlite
- Chatgpt for advice
- Formatting/Link tools(but if anything maybe just add like prettier to the package.json config or something)
- Since bun is fully compatible with node using chatgpt is a good way to generate scripts, cause they can still be ran with bun, use this to make generators

Bun is my only dependency, there nothing else can slow me down or stop me, build everything from scratch in a reusable way, If something becomes overly complicated, build a new version,

Learn bun, understand bun, and contribute to bun?

Initially these apps aren’t mean to look pretty, but be so fast at responding, everything is instantious


# GOAL
Build dream pop stack app with this stack, build ease of use of dream pop into this dependency-less app. (The frontend will be very static) but there might be ways of loading in css files and things like that

I want to build an app and system  that I can use for projects, and not have to worry about so many external dependencies moving around

# Nice to have would be a HMR style thing that would reload the app whenever there is a change — not sure how far the watch command goes

# Ideas
Every idea is it’s own module within the project
Within each module everything should be very modular and unit testable, and only export things that are worth using outside the module
Each module should be able to be operated independently, they may depend on each other, but all build on each other and uses no external dependencies, it is a flat hierarchy, and then each module should have a fairly flat hierarchy as well
- Type inference will be it’s own module
- validation will be it’s own module (inference + validation = zod)
- Data fetching will be it’s own module (inference + validation + api)
- WebPage Render 
- Server Module ( in a response would return webpage rendrer for example)
- Server Route Module(for getting all the server routes)
- Start.ts or index.ts will start the web server
- Eventually using all the above utilities, build  beautiful-gpt tool in pure bun

# note to self separate api routes by /api
For the web server
And then basically anything else can be page routes, 



