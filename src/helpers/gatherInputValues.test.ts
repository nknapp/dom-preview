import {describe, expect, it} from "vitest";
import {gatherInputValues} from "./gatherInputValues";


describe("gatherInputValues", () => {
    it("returns an empty array for no inputs", () => {
        document.body.innerHTML = `
            <div>Hello world!</div>
        `
        expect(gatherInputValues()).toEqual([])
    })
})