
// Mock MSW server
export const server = {
  listen: jest.fn(),
  close: jest.fn(),
  resetHandlers: jest.fn(),
  use: jest.fn(),
};
