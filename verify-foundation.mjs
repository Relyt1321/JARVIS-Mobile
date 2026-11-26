import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const readText = (relativePath) =>
  readFile(path.join(projectRoot, relativePath), 'utf8');
const readJson = async (relativePath) =>
  JSON.parse(await readText(relativePath));

const app = await readJson('app.json');
const pkg = await readJson('package.json');
const tsconfig = await readJson('tsconfig.json');

assert.equal(pkg.main, 'expo-router/entry', 'Expo Router must be the app entry point');
assert.equal(app.expo.name, 'JARVIS Mobile');
assert.equal(app.expo.slug, 'jarvis-mobile');
assert.equal(app.expo.scheme, 'jarvismobile');
assert.equal(app.expo.orientation, 'portrait');
assert.equal(app.expo.ios.bundleIdentifier, 'com.jarvis.mobile');
assert.equal(app.expo.ios.supportsTablet, true);
assert.equal(app.expo.android.package, 'com.jarvis.mobile');
assert.ok(app.expo.plugins.includes('expo-router'));
assert.equal(tsconfig.compilerOptions.strict, true);
assert.deepEqual(tsconfig.compilerOptions.paths['@/*'], ['./src/*']);

const requiredDependencies = [
  'expo',
  'expo-constants',
  'expo-linking',
  'expo-router',
  'expo-status-bar',
  'react',
  'react-native',
  'react-native-safe-area-context',
  'react-native-screens',
];
for (const dependency of requiredDependencies) {
  assert.equal(typeof pkg.dependencies[dependency], 'string', `Missing dependency: ${dependency}`);
}

const routes = [
  ['src/app/(tabs)/index.tsx', 'JARVIS Mobile'],
  ['src/app/(tabs)/assistant.tsx', 'Assistant'],
  ['src/app/(tabs)/memory.tsx', 'Memory'],
  ['src/app/(tabs)/settings.tsx', 'Settings'],
];
for (const [routePath, title] of routes) {
  const source = await readText(routePath);
  assert.match(source, /export default function /, `${routePath} must have a default route export`);
  assert.match(source, /ScreenPlaceholder/, `${routePath} must render its current placeholder`);
  assert.ok(source.includes(`title="${title}"`), `${routePath} has an unexpected title`);
}

const rootLayout = await readText('src/app/_layout.tsx');
const tabLayout = await readText('src/app/(tabs)/_layout.tsx');
const notFound = await readText('src/app/+not-found.tsx');
const windowsSetup = await readText('install-windows.cmd');
assert.match(rootLayout, /export default function RootLayout/);
assert.match(rootLayout, /<Stack/);
assert.match(rootLayout, /<StatusBar/);
assert.match(tabLayout, /export default function TabLayout/);
assert.match(tabLayout, /<Tabs\s+initialRouteName="index"/, 'Home must be the initial tab');
assert.match(tabLayout, /tabBarHideOnKeyboard:\s*true/);
const tabDefinitions = [
  ['index', 'Home', 'Home tab'],
  ['assistant', 'Assistant', 'Assistant tab'],
  ['memory', 'Memory', 'Memory tab'],
  ['settings', 'Settings', 'Settings tab'],
];
const declaredTabs = [...tabLayout.matchAll(/<Tabs\.Screen\s+name="([^"]+)"/g)].map(
  ([, route]) => route,
);
assert.deepEqual(
  declaredTabs,
  tabDefinitions.map(([route]) => route),
  'The four roadmap tabs must exist in the expected order',
);
for (const [route, title, accessibilityLabel] of tabDefinitions) {
  assert.ok(tabLayout.includes(`name="${route}"`), `Missing tab route: ${route}`);
  assert.ok(tabLayout.includes(`title: '${title}'`), `Missing tab title: ${title}`);
  assert.ok(
    tabLayout.includes(`tabBarAccessibilityLabel: '${accessibilityLabel}'`),
    `Missing accessible label for ${route}`,
  );
}
assert.match(notFound, /export default function NotFoundScreen/);
assert.match(notFound, /href="\/"/);
assert.match(windowsSetup, /cd \/d "%~dp0"/i);
assert.match(windowsSetup, /if not exist "package\.json"/i);
assert.match(windowsSetup, /npm\.cmd ping --fetch-retries=0 --fetch-timeout=8000/i);
assert.match(windowsSetup, /npm\.cmd install --no-audit --no-fund/i);
assert.match(windowsSetup, /run verify:foundation/i);
assert.match(windowsSetup, /run typecheck/i);
for (const script of ['start', 'ios', 'android', 'typecheck', 'verify:foundation']) {
  assert.equal(typeof pkg.scripts[script], 'string', `Missing npm script: ${script}`);
}

const gitignore = await readText('.gitignore');
assert.match(gitignore, /^node_modules\/$/m);
assert.match(gitignore, /^\.expo\/$/m);

console.log('Foundation checks passed: app identity, platform IDs, Expo Router entry, required dependencies, strict TypeScript config, Home as the initial tab, four correctly ordered and accessible tabs, fallback route, setup preflight, and launch scripts.');
