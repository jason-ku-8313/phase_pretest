const KEY = "comment_markers"

function getAllMarker() {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
}

function setAllMarker(obj) {
    localStorage.setItem(KEY, JSON.stringify(obj ?? {}))
}

function getCommentMarker(markerId) {
    const commentMarkers = getAllMarker();
    return commentMarkers[markerId];
}

function deleteCommentMarker(markerId) {
    const commentMarkers = getAllMarker();
    delete commentMarkers[markerId];
    localStorage.setItem(KEY, JSON.stringify(commentMarkers))
}

export function set(commentMarker) {
    const commentMarkers = getAllMarker();
    setAllMarker({ ...commentMarkers, [commentMarker.name]: commentMarker })
}

export function get(markerId) {
    if (!markerId) {
        return;
    }
    const comments = getCommentMarker(markerId);
    if (!comments || !Object.values(comments).length) {
        return;
    }
    return comments;
}

export function getAll() {
    const comments = getAllMarker();
    return comments;
}

export function remove(markerId) {
    deleteCommentMarker(markerId)
}