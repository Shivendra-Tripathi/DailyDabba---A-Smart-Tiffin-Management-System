# DailyDabba frontend (Login + Register)

## Run
1. Install Node.js 18+.
2. `npm install`
3. `npm run dev`, then open http://localhost:5173
4. Start the Spring Boot backend on port 8080. It must allow CORS from `http://localhost:5173`.

## Where things live
- `tailwind.config.js`: colours and neumorphic shadows (design tokens)
- `src/components/ui`: Button, Input, Card, Alert, ImageUpload (reusable)
- `src/components/layout`: Logo, AuthLayout
- `src/features/auth`: LoginForm, RegisterForm, RoleSelector
- `src/services`: all backend calls (apiClient.js, authService.js)
- `src/utils`: validators.js (validation rules), tokenStorage.js (JWT storage)
- `src/context/AuthContext.jsx`: login state; `src/hooks/useForm.js`: form logic
- `src/pages`, `src/App.jsx`: pages and routes
