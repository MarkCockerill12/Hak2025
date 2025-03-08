/** @type {import("eslint").Linter.Config} */
const config = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": [
    "@typescript-eslint",
    "drizzle"
  ],
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  "rules": {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        "prefer": "type-imports",
        "fixStyle": "inline-type-imports"
      }
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": {
          "attributes": false
        }
      }
    ],
    "drizzle/enforce-delete-with-where": [
      "error",
      {
        "drizzleObjectName": [
          "db",
          "ctx.db"
        ]
      }
    ],
    "drizzle/enforce-update-with-where": [
      "error",
      {
        "drizzleObjectName": [
          "db",
          "ctx.db"
        ]
      }
    ]
  },
  "overrides": [
    {
      "files": ["./src/components/ui/chart.tsx"],
      "rules": {
        "@typescript-eslint/consistent-indexed-object-style": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/restrict-template-expressions": "off"
      }
    },
    {
      "files": ["./src/components/ui/form.tsx"],
      "rules": {
        "@typescript-eslint/consistent-type-imports": "off"
      }
    },
    {
      "files": ["./src/components/ui/pagination.tsx"],
      "rules": {
        "@typescript-eslint/consistent-type-imports": "off"
      }
    },
    {
      "files": ["./src/components/ui/progress.tsx"],
      "rules": {
      }
    },
    {
      "files": ["./src/components/ui/sidebar.tsx"],
      "rules": {
        "@typescript-eslint/consistent-type-imports": "off"
      }
    },
    {
      "files": ["./src/components/ui/toggle-group.tsx"],
      "rules": {
      }
    },
    {
      "files": [
        "./src/components/ui/accordion.tsx",
        "./src/components/ui/alert-dialog.tsx",
        "./src/components/ui/alert.tsx",
        "./src/components/ui/aspect-ratio.tsx",
        "./src/components/ui/avatar.tsx",
        "./src/components/ui/badge.tsx",
        "./src/components/ui/breadcrumb.tsx",
        "./src/components/ui/button.tsx",
        "./src/components/ui/calendar.tsx",
        "./src/components/ui/card.tsx",
        "./src/components/ui/carousel.tsx",
        "./src/components/ui/checkbox.tsx",
        "./src/components/ui/collapsible.tsx"
      ],
      "rules": {
      }
    }
  ]
}

module.exports = config;
