# Git Manager

A lightweight VS Code extension for switching between multiple GitHub accounts and storing repository-specific account choices in a `.gitaccount` file.

## Included commands

- `Git Manager: Add Account`
- `Git Manager: Remove Account`
- `Git Manager: Switch Account`
- `Git Manager: Configure Repository Account`
- `Git Manager: List Accounts`

## SSH configuration

When you add an account with a host alias and identity file, the extension appends a matching SSH host block to `~/.ssh/config`.

Example:

```ssh
Host github.com-work
  HostName github.com
  User git
  IdentityFile /home/you/.ssh/id_rsa_work
  IdentitiesOnly yes
```

## `.gitaccount` file

The extension writes a repository-level file in the workspace root:

```json
{
  "accountId": "account_123456",
  "accountName": "Work"
}
```

## Development

```bash
npm install
npm run compile
npm run watch
```

## License

MIT
