import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";

describe("Header", () => {
  it("renders timer and theme toggles with correct icons", () => {
    render(
      <Header
        handleLanguageChange={vi.fn()}
        handleSpeedMode={vi.fn()}
        speedMode={false}
        language="en"
        toggleTheme={vi.fn()}
        theme="light"
      />
    );

    expect(screen.getByRole("button", { name: "⏱️" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "🌙" })).toBeInTheDocument();
    expect(screen.getByText("Time mode:")).toBeInTheDocument();
  });

  it("calls handlers when toggles are clicked", async () => {
    const handleSpeedMode = vi.fn();
    const toggleTheme = vi.fn();
    const user = userEvent.setup();

    render(
      <Header
        handleLanguageChange={vi.fn()}
        handleSpeedMode={handleSpeedMode}
        speedMode={true}
        language="en"
        toggleTheme={toggleTheme}
        theme="dark"
      />
    );

    await user.click(screen.getByRole("button", { name: "💤" }));
    await user.click(screen.getByRole("button", { name: "☀️" }));

    expect(handleSpeedMode).toHaveBeenCalledTimes(1);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it("notifies when language changes", async () => {
    const handleLanguageChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Header
        handleLanguageChange={handleLanguageChange}
        handleSpeedMode={vi.fn()}
        speedMode={false}
        language="en"
        toggleTheme={vi.fn()}
        theme="light"
      />
    );

    await user.selectOptions(screen.getByRole("combobox"), "tr");

    expect(handleLanguageChange).toHaveBeenCalledWith("tr");
  });
});
