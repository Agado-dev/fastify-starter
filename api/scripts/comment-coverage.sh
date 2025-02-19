#!/bin/bash

# Ensure script stops on error
set -e

# Check if coverage file exists
if [ ! -f "$COVERAGE_FILE" ]; then
  echo "❌ Coverage summary file not found!"
  exit 1
fi

# Extract coverage metrics
echo "### $TYPE Coverage Report 📊" > coverage-report.md
echo "\`\`\`json" >> coverage-report.md
jq '.total' "$COVERAGE_FILE" >> coverage-report.md
echo "\`\`\`" >> coverage-report.md

# Post comment to PR
gh pr comment "$PR_NUMBER" --body-file coverage-report.md
