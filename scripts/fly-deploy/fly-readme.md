## Deploy With Fly

Deploy with server:
If you haven't already install Fly

```bash
brew install flyctl
```

## Important

### Update `fly.toml`

Change the "app" value to a name of your choosing, this is important as this will throw an error if you try to deploy under the default name

[Fly Docs]("https://fly.io/docs/hands-on/install-flyctl/")

## If you haven't signed up with fly

```bash
fly auth signup
```

Or: [Fly Signup Link]("https://fly.io/app/sign-up")

## Sign In With Fly

```bash
fly auth
```

Go to your [Fly dashboard](https://fly.io/dashboard/personal)

## Find Your App

Once your app is open
click "tokens"
then "create deploy token"

Securely Save/copy that key

# Create a deploy environment in GitHub

- Go to your GitHub Project
- Click on "Settings" -> "Environments" -> "New Environment"
- Name your environment examples: dev, stage, or prod
- Under "Environment Secrets" -> (+) Add Secret -> Name it "FLY_API_TOKEN"
- Paste the token value created by fly.io and click "Add secret"
