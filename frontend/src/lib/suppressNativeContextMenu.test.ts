import { describe, expect, it } from "vitest";
import { suppressNativeContextMenu } from "./suppressNativeContextMenu";

const rightClick = () => new Event("contextmenu", { cancelable: true });

describe("suppressNativeContextMenu", () => {
  it("prevents the native menu until disposed", () => {
    const target = new EventTarget();
    const dispose = suppressNativeContextMenu(target as unknown as Window);

    const blocked = rightClick();
    target.dispatchEvent(blocked);
    expect(blocked.defaultPrevented).toBe(true);

    dispose();
    const allowed = rightClick();
    target.dispatchEvent(allowed);
    expect(allowed.defaultPrevented).toBe(false);
  });
});
