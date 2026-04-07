// Jest setup file

// Automatically runs before each test suite

// Clear all mocks after every test
afterEach(() => {
    jest.clearAllMocks();
});

// Optional: Silence console errors/warnings during tests
// (helps keep output clean — remove if you want logs)
jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(console, "warn").mockImplementation(() => {});