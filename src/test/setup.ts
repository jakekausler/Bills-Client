import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Override VITE_DISABLE_AUTH for tests
vi.stubEnv('VITE_DISABLE_AUTH', '');
