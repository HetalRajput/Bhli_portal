import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as vscode from 'vscode';

type GitAccount = {
  id: string;
  name: string;
  username?: string;
  hostAlias?: string;
  identityFile?: string;
};

const STORAGE_KEY = 'git-manager.accounts';
const GITACCOUNT_FILE = '.gitaccount';

export function activate(context: vscode.ExtensionContext) {
  const disposables = [
    vscode.commands.registerCommand('gitManager.addAccount', addAccount),
    vscode.commands.registerCommand('gitManager.removeAccount', removeAccount),
    vscode.commands.registerCommand('gitManager.switchAccount', switchAccount),
    vscode.commands.registerCommand('gitManager.configureRepositoryAccount', configureRepositoryAccount),
    vscode.commands.registerCommand('gitManager.listAccounts', listAccounts),
  ];

  context.subscriptions.push(...disposables);
}

export function deactivate() {}

async function addAccount() {
  const name = await vscode.window.showInputBox({
    prompt: 'Enter a label for the account, for example: Work',
    placeHolder: 'Work',
  });

  if (!name) {
    return;
  }

  const username = await vscode.window.showInputBox({
    prompt: 'Enter GitHub username (optional)',
    placeHolder: 'your-username',
  });

  const hostAlias = await vscode.window.showInputBox({
    prompt: 'Enter SSH host alias (optional, e.g. github.com-work)',
    placeHolder: 'github.com-work',
  });

  const identityFile = await vscode.window.showInputBox({
    prompt: 'Enter SSH identity file path (optional, e.g. ~/.ssh/id_rsa_work)',
    placeHolder: '~/.ssh/id_rsa_work',
  });

  const account: GitAccount = {
    id: `account_${Date.now()}`,
    name,
    username,
    hostAlias,
    identityFile,
  };

  const accounts = getAccounts();
  accounts.push(account);
  saveAccounts(accounts);

  if (hostAlias && identityFile) {
    configureSshHost(hostAlias, identityFile);
  }

  vscode.window.showInformationMessage(`Added account: ${name}`);
}

async function removeAccount() {
  const accounts = getAccounts();

  if (!accounts.length) {
    vscode.window.showWarningMessage('No GitHub accounts are configured yet.');
    return;
  }

  const picked = await vscode.window.showQuickPick(
    accounts.map((account) => ({ label: account.name, description: account.id, account })),
    { place: 'below', title: 'Select account to remove' },
  );

  if (!picked) {
    return;
  }

  const updated = getAccounts().filter((account) => account.id !== picked.account.id);
  saveAccounts(updated);
  vscode.window.showInformationMessage(`Removed account: ${picked.account.name}`);
}

async function switchAccount() {
  const accounts = getAccounts();

  if (!accounts.length) {
    vscode.window.showWarningMessage('No GitHub accounts are configured yet.');
    return;
  }

  const picked = await vscode.window.showQuickPick(
    accounts.map((account) => ({ label: account.name, description: account.id, account })),
    { place: 'below', title: 'Select account for the current repository' },
  );

  if (!picked) {
    return;
  }

  writeGitAccountFile(picked.account);
  vscode.window.showInformationMessage(`Switched repository account to: ${picked.account.name}`);
}

async function configureRepositoryAccount() {
  await switchAccount();
}

function listAccounts() {
  const accounts = getAccounts();

  if (!accounts.length) {
    vscode.window.showInformationMessage('No configured accounts found.');
    return;
  }

  const lines = accounts.map((account) => `- ${account.name} (${account.id})`);
  vscode.window.showInformationMessage(`Configured Accounts:\n${lines.join('\n')}`);
}

function getAccounts(): GitAccount[] {
  const value = vscode.workspace.getConfiguration('gitManager').get<string>(STORAGE_KEY, '');
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as GitAccount[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: GitAccount[]) {
  const config = vscode.workspace.getConfiguration('gitManager');
  void config.update(STORAGE_KEY, JSON.stringify(accounts), vscode.ConfigurationTarget.Global);
}

function writeGitAccountFile(account: GitAccount) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showWarningMessage('Open a workspace folder before configuring a repository account.');
    return;
  }

  const filePath = path.join(workspaceFolder.uri.fsPath, GITACCOUNT_FILE);
  const content = JSON.stringify({ accountId: account.id, accountName: account.name }, null, 2);
  fs.writeFileSync(filePath, `${content}\n`, 'utf8');
}

function configureSshHost(hostAlias: string, identityFile: string) {
  const sshConfigPath = path.join(os.homedir(), '.ssh', 'config');
  const hostName = hostAlias.includes('github.com') ? 'github.com' : hostAlias;
  const entry = [
    '',
    `Host ${hostAlias}`,
    `  HostName ${hostName}`,
    '  User git',
    `  IdentityFile ${identityFile.replace(/^~\//, `${os.homedir()}/`)}`,
    '  IdentitiesOnly yes',
    '',
  ].join('\n');

  const current = fs.existsSync(sshConfigPath) ? fs.readFileSync(sshConfigPath, 'utf8') : '';
  if (!current.includes(`Host ${hostAlias}`)) {
    fs.appendFileSync(sshConfigPath, entry, 'utf8');
  }
}
