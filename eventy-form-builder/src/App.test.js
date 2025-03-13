import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders default form title", () => {
  render(<App />);
  const titleInput = screen.getByDisplayValue(/Untitled Form/i);
  expect(titleInput).toBeInTheDocument();
});

test("renders 'Add Section' button", () => {
  render(<App />);
  const button = screen.getByText(/Add Section/i);
  expect(button).toBeInTheDocument();
});

test("renders default section", () => {
  render(<App />);
  const sectionInput = screen.getByDisplayValue(/Untitled Section/i);
  expect(sectionInput).toBeInTheDocument();
});
