import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'schema.graphql',
  documents: ['src/graphql/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    'src/graphql/__generated__/': {
      preset: 'client',
      config: {
        documentMode: 'string',
        useTypeImports: true,
        enumsAsTypes: true,
        scalars: { DateTime: 'string' },
      },
    },
  },
};

export default config;
