import type { ApiEndpoint, QuickStartStep, StackItem, RepoItem, RoadmapItem } from './types';

export const API_BASE = 'https://mytradebuddy.com/api';

export const quickStartSteps: QuickStartStep[] = [
  {
    title: 'Install the SDK',
    description: 'Add the Trade Buddy SDK to your project with npm or yarn.',
    code: `// Step 1: Install
// Run in your terminal:

npm install @tradebuddy/sdk

// or with yarn:
yarn add @tradebuddy/sdk

// TypeScript types are included out of the box.
// No @types package needed.`,
  },
  {
    title: 'Authenticate',
    description: 'Sign in with email and password to get a session token.',
    code: `import { TradeBuddy } from '@tradebuddy/sdk';

// Create a client instance
const client = new TradeBuddy();

// Authenticate with email and password
const session = await client.signIn({
  email: 'jane@school.edu',
  password: 'your-password',
});

console.log(session.user.name); // "Jane Doe"
console.log(session.token);     // "eyJhbG..."`,
  },
  {
    title: 'Fetch listings',
    description: 'Query the marketplace for products, donations, or wanted items.',
    code: `// Fetch all listings from the marketplace
const listings = await client.getListings();

// Each listing is fully typed
listings.forEach((item: Listing) => {
  console.log(item.title);      // "School Blazer"
  console.log(item.type);       // "Sell" | "Donate" | "Wanted"
  console.log(item.price);      // 25
  console.log(item.category);   // "School Uniform"
  console.log(item.condition);  // "Good"
});

// Filter by type
const donations = listings.filter(
  l => l.type === 'Donate'
);`,
  },
  {
    title: 'Create a listing',
    description: 'Post a new item to the marketplace programmatically.',
    code: `// Create a new listing
const newListing = await client.createListing({
  title: 'Graphing Calculator',
  type: 'Sell',
  price: 35,
  category: 'Electronics',
  condition: 'Like New',
  description: 'TI-84 Plus, barely used',
});

console.log(newListing.id);  // "sell_42"

// Delete your account (careful!)
await client.deleteAccount();`,
  },
];

export const endpoints: ApiEndpoint[] = [
  {
    id: 'signup',
    method: 'POST',
    title: 'Sign Up',
    description: 'Create a new user account. Returns a Bearer token for authenticated requests.',
    path: '/auth.php?action=signup',
    auth: false,
    params: [
      { name: 'name', type: 'string', required: true, description: 'Full name of the user' },
      { name: 'email', type: 'string', required: true, description: "User's email address" },
      { name: 'password', type: 'string', required: true, description: 'Account password' },
    ],
    tabs: [
      {
        label: 'TypeScript',
        code: `import { TradeBuddy } from '@tradebuddy/sdk';

const client = new TradeBuddy();

const session = await client.signUp({
  name: 'Jane Doe',
  email: 'jane@school.edu',
  password: 'secure-password',
});

console.log(session.user);  // { id: 42, name: "Jane Doe", ... }
console.log(session.token); // Bearer token for future requests`,
      },
      {
        label: 'cURL',
        code: `curl -X POST ${API_BASE}/auth.php?action=signup \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Doe",
    "email": "jane@school.edu",
    "password": "secure-password"
  }'`,
      },
      {
        label: 'Response',
        code: `{
  "success": true,
  "user": {
    "id": 42,
    "name": "Jane Doe",
    "email": "jane@school.edu"
  },
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}`,
      },
    ],
  },
  {
    id: 'signin',
    method: 'POST',
    title: 'Sign In',
    description: 'Authenticate an existing user and receive a Bearer token.',
    path: '/auth.php?action=login',
    auth: false,
    params: [
      { name: 'email', type: 'string', required: true, description: 'Registered email address' },
      { name: 'password', type: 'string', required: true, description: 'Account password' },
    ],
    tabs: [
      {
        label: 'TypeScript',
        code: `const session = await client.signIn({
  email: 'jane@school.edu',
  password: 'secure-password',
});

// Session is now active — client is authenticated
console.log(session.user.name); // "Jane Doe"`,
      },
      {
        label: 'cURL',
        code: `curl -X POST ${API_BASE}/auth.php?action=login \\
  -H "Content-Type: application/json" \\
  -d '{ "email": "jane@school.edu", "password": "secure-password" }'`,
      },
      {
        label: 'Response',
        code: `{
  "success": true,
  "user": { "id": 42, "name": "Jane Doe", "email": "jane@school.edu" },
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}`,
      },
    ],
    tryIt: 'signin',
  },
  {
    id: 'signout',
    method: 'POST',
    title: 'Sign Out',
    description: 'Invalidate the current session token.',
    path: '/auth.php?action=logout',
    auth: true,
    tabs: [
      {
        label: 'TypeScript',
        code: `await client.signOut();
// Token is now invalidated on the server`,
      },
      {
        label: 'cURL',
        code: `curl -X POST ${API_BASE}/auth.php?action=logout \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
      },
    ],
  },
  {
    id: 'delete-account',
    method: 'DELETE',
    title: 'Delete Account',
    description: 'Permanently delete a user account and all associated listings. This action cannot be undone.',
    path: '/account.php?action=delete',
    auth: true,
    tabs: [
      {
        label: 'TypeScript',
        code: `// Permanently deletes account + all listings
await client.deleteAccount();

// The token is now invalid
// All user data has been removed from the database`,
      },
      {
        label: 'cURL',
        code: `curl -X POST ${API_BASE}/account.php?action=delete \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
      },
      {
        label: 'Response',
        code: `{
  "success": true,
  "message": "Account deleted successfully"
}`,
      },
    ],
  },
  {
    id: 'get-listings',
    method: 'GET',
    title: 'Get All Listings',
    description: 'Retrieve all marketplace listings. Returns products for sale, donations, and wanted items.',
    path: '/listings.php',
    auth: false,
    tabs: [
      {
        label: 'TypeScript',
        code: `const listings = await client.getListings();

// Type-safe access to listing properties
listings.forEach((item: Listing) => {
  console.log(\`\${item.title} — $\${item.price}\`);
  console.log(\`\${item.category} | \${item.condition}\`);
  console.log(\`Seller: \${item.sellerName}\`);

  if (item.imageUri) {
    console.log(\`Image: \${item.imageUri}\`);
  }
});`,
      },
      {
        label: 'cURL',
        code: `curl ${API_BASE}/listings.php`,
      },
      {
        label: 'Response',
        code: `{
  "success": true,
  "listings": [
    {
      "id": "sell_17",
      "type": "Sell",
      "title": "Sixth Form Uniform",
      "price": 40,
      "category": "School Uniform",
      "condition": "Good",
      "description": "Size: Large",
      "imageUri": "https://mytradebuddy.com/uploads/...",
      "sellerName": "Arhan Harchandani",
      "sellerEmail": "arhan@example.com",
      "createdAt": 1773280792000
    }
  ]
}`,
      },
    ],
    tryIt: 'listings',
  },
  {
    id: 'create-listing',
    method: 'POST',
    title: 'Create Listing',
    description: 'Post a new item to the marketplace. Supports products for sale, donations, and wanted items.',
    path: '/listings.php',
    auth: true,
    params: [
      { name: 'title', type: 'string', required: true, description: 'Item title' },
      { name: 'type', type: '"Sell" | "Donate" | "Wanted"', required: true, description: 'Listing type' },
      { name: 'price', type: 'number', required: false, description: 'Price in local currency (Sell type only)' },
      { name: 'category', type: 'string', required: true, description: 'One of the 12 supported categories' },
      { name: 'condition', type: 'string', required: true, description: 'Item condition (New, Like New, Good, Fair)' },
      { name: 'description', type: 'string', required: false, description: 'Additional details about the item' },
    ],
    tabs: [
      {
        label: 'TypeScript',
        code: `const listing = await client.createListing({
  title: 'Graphing Calculator',
  type: 'Sell',
  price: 35,
  category: 'Electronics',
  condition: 'Like New',
  description: 'TI-84 Plus, barely used. Includes case.',
});

console.log(listing.id); // "sell_42"`,
      },
      {
        label: 'cURL',
        code: `curl -X POST ${API_BASE}/listings.php \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Graphing Calculator",
    "type": "Sell",
    "price": 35,
    "category": "Electronics",
    "condition": "Like New",
    "description": "TI-84 Plus, barely used."
  }'`,
      },
      {
        label: 'Response',
        code: `{
  "success": true,
  "id": "sell_42"
}`,
      },
    ],
  },
];

export const stackItems: StackItem[] = [
  {
    icon: 'monitor',
    title: 'Website',
    description: 'Server-rendered PHP with MySQL. 12 category pages, admin panel, messaging system, donations, and wanted items.',
    tags: ['PHP', 'MySQL', 'HTML/CSS', 'JavaScript'],
    color: 'blue',
  },
  {
    icon: 'phone',
    title: 'Mobile App',
    description: 'Cross-platform React Native app built with Expo. Shares the same database and user accounts as the website.',
    tags: ['React Native', 'Expo', 'JavaScript'],
    color: 'green',
  },
  {
    icon: 'bolt',
    title: 'REST API',
    description: 'PHP endpoints with Bearer token auth. Powers the mobile app and the TypeScript SDK.',
    tags: ['REST', 'JSON', 'Bearer Auth'],
    color: 'blue',
  },
  {
    icon: 'database',
    title: 'Database',
    description: 'Shared MySQL database. Single source of truth for users, listings, messages, and sessions.',
    tags: ['MySQL', 'Shared State'],
    color: 'green',
  },
];

export const repos: RepoItem[] = [
  {
    name: 'tradebuddyhq/site',
    description: 'Website, admin panel, and REST API. The full backend powering Trade Buddy.',
    language: 'PHP',
    langColor: '#4F5D95',
    visibility: 'Private',
    url: 'https://github.com/tradebuddyhq/site',
  },
  {
    name: 'tradebuddyhq/app',
    description: 'React Native mobile app. Cross-platform iOS and Android client.',
    language: 'JavaScript',
    langColor: '#f1e05a',
    visibility: 'Public',
    url: 'https://github.com/tradebuddyhq/app',
  },
  {
    name: 'tradebuddyhq/sdk',
    description: 'Official TypeScript SDK for the Trade Buddy API. npm: @tradebuddy/sdk',
    language: 'TypeScript',
    langColor: '#3178c6',
    visibility: 'Public',
    url: 'https://github.com/tradebuddyhq/sdk',
  },
];

export const roadmap: RoadmapItem[] = [
  {
    icon: 'package',
    title: 'TypeScript SDK',
    description: 'Fully typed client for the Trade Buddy API. Install with npm, get autocomplete and type safety out of the box.',
    status: 'live',
  },
  {
    icon: 'webhook',
    title: 'Webhooks',
    description: 'Subscribe to real-time events like new listings, sales, and account changes. Get notified via HTTP POST to your endpoint.',
    status: 'building',
  },
  {
    icon: 'key',
    title: 'Developer API Keys',
    description: 'Dedicated API keys for third-party apps. Rate limiting, usage analytics, and scoped permissions per key.',
    status: 'planned',
  },
  {
    icon: 'code',
    title: 'Embeddable Widget',
    description: 'Drop a <script> tag on any school website to display Trade Buddy listings. Customizable themes and filters.',
    status: 'planned',
  },
  {
    icon: 'terminal',
    title: 'CLI Tool',
    description: 'Interact with Trade Buddy from your terminal. Browse listings, post items, manage your account with npx tradebuddy.',
    status: 'planned',
  },
  {
    icon: 'heartbeat',
    title: 'Status Page',
    description: 'Real-time API uptime monitoring at status.tradebuddy.dev. Incident history and response time metrics.',
    status: 'planned',
  },
  {
    icon: 'changelog',
    title: 'Changelog',
    description: 'Track every API change with versioned release notes. Never be surprised by breaking changes.',
    status: 'planned',
  },
];
