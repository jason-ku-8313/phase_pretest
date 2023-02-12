import { get, getAll, set, remove } from '../markerStorage'

describe("markerStorage functions", () => {
    beforeEach(() => {
        localStorage.clear();
    });
  
    it("should set and get a comment marker", () => {
        const commentMarker = { name: "marker1", comments: ["comment1", "comment2"] };
        set(commentMarker);
        expect(get("marker1")).toEqual(commentMarker);
    });
  
    it("should return all comment markers", () => {
        const commentMarker1 = { name: "marker1", comments: ["comment1", "comment2"] };
        const commentMarker2 = { name: "marker2", comments: ["comment3", "comment4"] };
        set(commentMarker1);
        set(commentMarker2);
        expect(getAll()).toEqual({ marker1: commentMarker1, marker2: commentMarker2 });
    });
  
    it("should remove a comment marker", () => {
        const commentMarker1 = { name: "marker1", comments: ["comment1", "comment2"] };
        const commentMarker2 = { name: "marker2", comments: ["comment3", "comment4"] };
        set(commentMarker1);
        set(commentMarker2);
        remove("marker1");
        expect(getAll()).toEqual({ marker2: commentMarker2 });
    });
});