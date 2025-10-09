#!/bin/bash

# Setup script for TanStack Router + Hono SSR template
# This script helps initialize a new project from this template

set -e  # Exit on error

echo "🚀 TanStack Router + Hono SSR - Project Setup"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running in project root
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from the project root."
  exit 1
fi

# Get project name from user
echo -e "${BLUE}What is your project name?${NC} (default: my-app)"
read -r PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-my-app}

echo ""
echo -e "${GREEN}📝 Project name: $PROJECT_NAME${NC}"
echo ""

# Update package.json name
echo "Updating package.json..."
if command -v jq &> /dev/null; then
  jq ".name = \"$PROJECT_NAME\"" package.json > package.json.tmp && mv package.json.tmp package.json
  echo -e "${GREEN}✓ Updated package.json${NC}"
else
  echo -e "${YELLOW}⚠ jq not found, skipping package.json update. Please update manually.${NC}"
fi

# Create .env from .env.example if it doesn't exist
if [ ! -f ".env" ]; then
  echo "Creating .env file from .env.example..."
  cp .env.example .env
  echo -e "${GREEN}✓ Created .env file${NC}"
else
  echo -e "${YELLOW}⚠ .env file already exists, skipping${NC}"
fi

# Check Node.js version
echo ""
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo -e "${YELLOW}⚠ Warning: Node.js 18+ is recommended. You have $(node -v)${NC}"
else
  echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"
fi

# Install dependencies
echo ""
echo -e "${BLUE}Would you like to install dependencies now?${NC} (y/n)"
read -r INSTALL_DEPS
if [ "$INSTALL_DEPS" = "y" ] || [ "$INSTALL_DEPS" = "Y" ]; then
  echo "Installing dependencies..."
  npm install
  echo -e "${GREEN}✓ Dependencies installed${NC}"
else
  echo -e "${YELLOW}⚠ Skipping dependency installation${NC}"
fi

# Git initialization
echo ""
if [ ! -d ".git" ]; then
  echo -e "${BLUE}Would you like to initialize a git repository?${NC} (y/n)"
  read -r INIT_GIT
  if [ "$INIT_GIT" = "y" ] || [ "$INIT_GIT" = "Y" ]; then
    git init
    git add .
    git commit -m "Initial commit from tanstack-hono template"
    echo -e "${GREEN}✓ Git repository initialized${NC}"
  fi
else
  echo -e "${YELLOW}⚠ Git repository already exists${NC}"
fi

# Update README with project name
echo ""
echo "Updating README.md..."
if [ -f "README.md" ]; then
  # Update the degit command in README
  sed -i.bak "s/my-app/$PROJECT_NAME/g" README.md && rm README.md.bak 2>/dev/null || sed -i "s/my-app/$PROJECT_NAME/g" README.md
  echo -e "${GREEN}✓ Updated README.md${NC}"
fi

# Summary
echo ""
echo "=============================================="
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Review and update .env file with your configuration"
echo "  2. Update LICENSE file with your name/organization"
echo "  3. Update SECURITY.md with your contact email"
echo "  4. Review and customize README.md"
echo ""
echo "To start development:"
echo -e "  ${BLUE}npm run dev${NC}"
echo ""
echo "To build for production:"
echo -e "  ${BLUE}npm run build${NC}"
echo -e "  ${BLUE}npm start${NC}"
echo ""
echo "Happy coding! 🎉"
