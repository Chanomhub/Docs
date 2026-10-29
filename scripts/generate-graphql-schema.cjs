/**
 * Regenerate v2_schema.json from the backend's GraphQL SDL.
 *
 * Usage (from the Docs repo):  bun scripts/generate-graphql-schema.cjs
 *                              (or: node scripts/generate-graphql-schema.cjs)
 *
 * The production API disables introspection, so the schema browser is driven
 * by this committed snapshot instead of a live introspection query. Run this
 * after changing any backend file under backend/src/graphql/schemas/.
 */
const { readFileSync, writeFileSync, readdirSync } = require('node:fs');
const { join } = require('node:path');

// Resolve the backend schema dir relative to this script: ../../backend/src/graphql/schemas
const here = __dirname;
const backendSchemas = join(here, '..', '..', 'backend', 'src', 'graphql', 'schemas');
const backendModules = join(backendSchemas, '..', '..', '..', 'node_modules');

const { loadSchemaSync } = require(join(backendModules, '@graphql-tools', 'load'));
const { GraphQLFileLoader } = require(
  join(backendModules, '@graphql-tools', 'graphql-file-loader'),
);
const graphql = require(join(backendModules, 'graphql'));

// Same file set and loader the backend v2 Yoga instance uses (graphql.provider.ts):
// shared/*.gql + v2.gql + v2/*.gql — @graphql-tools merges duplicate type defs.
const files = [
  ...readdirSync(join(backendSchemas, 'shared'))
    .filter((f) => f.endsWith('.gql'))
    .map((f) => join(backendSchemas, 'shared', f)),
  join(backendSchemas, 'v2.gql'),
  ...readdirSync(join(backendSchemas, 'v2'))
    .filter((f) => f.endsWith('.gql'))
    .map((f) => join(backendSchemas, 'v2', f)),
];

const schema = loadSchemaSync(files, { loaders: [new GraphQLFileLoader()] });
const sorted = graphql.lexicographicSortSchema(schema);

// Emit in introspection-result format (what GraphQlSchema.astro consumes).
const result = graphql.graphqlSync({
  schema: sorted,
  source: graphql.getIntrospectionQuery(),
});
if (result.errors) {
  console.error(result.errors);
  process.exit(1);
}

writeFileSync(
  join(here, '..', 'v2_schema.json'),
  JSON.stringify(result.data, null, 2) + '\n',
);
console.log(`v2_schema.json regenerated from ${files.length} SDL files.`);
