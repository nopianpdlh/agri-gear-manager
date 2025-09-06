# 🤝 Contributing to Agri-Gear Manager

Terima kasih atas minat Anda untuk berkontribusi pada **Agri-Gear Manager**! Kami sangat menghargai setiap kontribusi dari komunitas developer.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Pull Request Process](#pull-request-process)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Documentation](#documentation)

## 📜 Code of Conduct

Proyek ini mengadopsi Contributor Covenant Code of Conduct. Dengan berpartisipasi, Anda diharapkan untuk menjunjung tinggi kode ini. Silakan laporkan perilaku yang tidak dapat diterima ke [nopianpdlh@gmail.com](mailto:nopianpdlh@gmail.com).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm atau yarn
- Git
- Akun GitHub
- Akun Supabase (untuk testing)

### Setup Development Environment

1. **Fork repository**
   ```bash
   # Fork di GitHub, kemudian clone fork Anda
   git clone https://github.com/YOUR_USERNAME/agri-gear-manager.git
   cd agri-gear-manager
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/nopianpdlh/agri-gear-manager.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Setup environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local dengan Supabase credentials Anda
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔄 Development Process

### 1. Create Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Branch Naming Convention

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation updates
- `refactor/component-name` - Code refactoring
- `style/ui-improvement` - UI/UX improvements

### 3. Commit Message Convention

Kami menggunakan [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
type(scope): description

# Examples
feat(auth): add Google OAuth integration
fix(dashboard): resolve chart rendering issue
docs(readme): update installation guide
style(ui): improve button hover effects
refactor(api): optimize database queries
```

#### Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - UI/UX changes
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

## 📬 Pull Request Process

### 1. Before Creating PR

- [ ] Ensure your code follows our coding standards
- [ ] Add/update tests if applicable
- [ ] Update documentation if needed
- [ ] Test your changes locally
- [ ] Ensure no TypeScript errors
- [ ] Run linting: `npm run lint`

### 2. Creating Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub**
   - Use clear, descriptive title
   - Fill out PR template completely
   - Link related issues
   - Add screenshots for UI changes
   - Request reviews from maintainers

### 3. PR Template

```markdown
## 📝 Description
Brief description of changes

## 🔗 Related Issues
Fixes #123

## 🧪 Testing
- [ ] Manual testing completed
- [ ] All tests pass
- [ ] No TypeScript errors

## 📷 Screenshots (if applicable)
[Add screenshots for UI changes]

## ✅ Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🎨 Coding Standards

### TypeScript

```typescript
// Use explicit types
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// Use async/await over Promises
async function fetchUser(id: string): Promise<UserProfile> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Use meaningful variable names
const isAuthenticated = checkAuthStatus();
const userPermissions = getUserPermissions();
```

### React Components

```tsx
// Use functional components with TypeScript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### File Organization

```
components/
├── ui/           # Reusable UI components
├── shared/       # Business logic components
└── forms/        # Form components

lib/
├── utils.ts      # Utility functions
├── types.ts      # TypeScript types
└── constants.ts  # App constants
```

### CSS/Styling

- Use Tailwind CSS classes
- Follow mobile-first approach
- Use semantic class names
- Avoid inline styles

```tsx
// Good
<div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">

// Avoid
<div style={{ display: 'flex', flexDirection: 'column' }}>
```

## 🧪 Testing Guidelines

### Unit Tests

```typescript
// utils.test.ts
import { formatDate } from './utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2023-12-25');
    expect(formatDate(date)).toBe('25 December 2023');
  });
});
```

### Component Tests

```tsx
// Button.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick}>Click me</Button>
    );
    
    fireEvent.click(getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## 📚 Documentation

### Code Comments

```typescript
/**
 * Calculates the total cost of equipment maintenance
 * @param equipmentId - The ID of the equipment
 * @param startDate - Start date for calculation
 * @param endDate - End date for calculation
 * @returns Promise resolving to total cost
 */
async function calculateMaintenanceCost(
  equipmentId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  // Implementation
}
```

### README Updates

- Update feature lists when adding new features
- Include screenshots for UI changes
- Update setup instructions if needed
- Add troubleshooting sections for common issues

## 🏷️ Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested

## 🎯 Priority Areas for Contribution

1. **🐛 Bug Fixes**
   - Check existing issues labeled `bug`
   - Test edge cases
   - Improve error handling

2. **📱 Mobile Responsiveness**
   - Test on various screen sizes
   - Improve touch interactions
   - Optimize for mobile performance

3. **♿ Accessibility**
   - Add ARIA labels
   - Improve keyboard navigation
   - Ensure color contrast compliance

4. **🌍 Internationalization**
   - Add translation support
   - Localize date/number formats
   - RTL language support

5. **📊 Performance**
   - Optimize bundle size
   - Improve loading times
   - Database query optimization

## 📞 Getting Help

- 💬 **GitHub Discussions**: [Ask questions](https://github.com/nopianpdlh/agri-gear-manager/discussions)
- 🐛 **Issues**: [Report bugs](https://github.com/nopianpdlh/agri-gear-manager/issues)
- 📧 **Email**: [nopianpdlh@gmail.com](mailto:nopianpdlh@gmail.com)

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors graph
- Special thanks in documentation

---

Terima kasih telah membantu membuat Agri-Gear Manager menjadi lebih baik! 🌾
