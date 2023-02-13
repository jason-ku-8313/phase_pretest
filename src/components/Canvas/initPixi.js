import { Assets, Sprite, utils } from "pixi.js";
import PubSub from "pubsub-js";
import { get, getAll } from "../../utils/markerStorage";
import {
  CREATE_MARKER,
  OPEN_COMMENT_DIALOG,
  REMOVE_MARKER,
} from "../../constants/topic";
import { nanoid } from "nanoid";

const preloadAssets = [
  { key: "cat", assetsIn: "/cat.jpg" },
  { key: "bulldog", assetsIn: "/bulldog.jpg" },
  { key: "marker", assetsIn: "/marker.png" },
];

const defaultSprites = [
  { key: "cat", x: 200, y: 200 },
  { key: "bulldog", x: 700, y: 400 },
];

export default function initPixi(app) {
  /** Canvas event handlers */
  const handleClickMarker = (e) => {
    if (e.target !== e.currentTarget) return;
    const commentMarker = get(e.target.name);
    if (commentMarker) {
      PubSub.publish(OPEN_COMMENT_DIALOG, {
        ...commentMarker,
        shouldCreateSprite: false,
      });
    }
  };

  let isDragged = false;
  const handleOpenCommentDialog = (e) => {
    if (e.target !== e.currentTarget) return;
    if (!isDragged) {
      PubSub.publish(OPEN_COMMENT_DIALOG, {
        name: nanoid(),
        coordinate: [
          e.target.parent ? e.globalX - e.target.x : e.globalX,
          e.target.parent ? e.globalY - e.target.y : e.globalY,
        ],
        comments: [],
        parent: e.target.name,
        shouldCreateSprite: true,
      });
    }
    isDragged = false;
  };

  const handleDragBegin = (e) => {
    if (e.target !== e.currentTarget) return;

    // Calculate the offset between click point and image anchor's global X/Y
    const offsetX = e.globalX - e.target.position.x;
    const offsetY = e.globalY - e.target.position.y;
    e.target.dragging = { offsetX, offsetY };
  };

  const handleDragMove = (e) => {
    if (e.target !== e.currentTarget) return;

    const { dragging } = e.target;
    if (dragging) {
      isDragged = true;
      e.target.x = e.globalX - dragging.offsetX;
      e.target.y = e.globalY - dragging.offsetY;
    }
  };

  const handleDragEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    e.target.dragging = false;
  };

  const createMarker = (marker) => {
    const sprite = new Sprite(utils.TextureCache["marker"]);
    sprite.name = marker.name;
    sprite.x = marker.coordinate[0];
    sprite.y = marker.coordinate[1];
    sprite.anchor.set(0, 1);
    sprite.interactive = true;
    sprite.onpointerup = handleClickMarker;
    const parent =
      app.stage.name === marker.parent
        ? app.stage
        : app.stage.getChildByName(marker.parent);
    parent.addChild(sprite);
  };

  const initSprites = () => {
    // Place cat and dog to canvas
    const sprites = defaultSprites.map(({ key, x, y }) => {
      const sprite = new Sprite(utils.TextureCache[key]);
      sprite.name = key;
      sprite.x = x;
      sprite.y = y;
      sprite.interactive = true;
      sprite.dragging = false;
      sprite
        .on("mousedown", handleDragBegin)
        .on("mousemove", handleDragMove)
        .on("mouseup", handleDragEnd)
        .on("mouseup", handleOpenCommentDialog)
        .on("mouseout", handleDragEnd);
      return sprite;
    });
    app.stage.addChild(...sprites);

    /**
     * Read existing markers from storage and place to canvas.
     * Note: Should be executed after the above. Some markers are placed on the picture.
     */
    const commentMarkers = getAll();
    Object.values(commentMarkers).map((v) => createMarker(v));
  };

  /** Preload assets and render to canvas */
  preloadAssets.forEach(({ key, assetsIn }) => Assets.add(key, assetsIn));
  Assets.load(preloadAssets.map(({ key }) => key)).then(() => {
    console.log("All images has been loaded successfully.");
    initSprites();
  });

  /** Init stage */
  app.stage.name = "stage";
  app.stage.interactive = true;
  app.stage.hitArea = app.screen;
  app.stage.on("mouseup", handleOpenCommentDialog);

  /** PubSub Subscriber */
  const createMarkerSubscriber = (_, marker) => {
    createMarker(marker);
  };

  const removeMarkerSubscriber = (_, marker) => {
    // Remove marker from canvas
    const parent =
      app.stage.name === marker.parent
        ? app.stage
        : app.stage.getChildByName(marker.parent);
    parent.getChildByName(marker.name)?.destroy();
  };

  const createMarkerSubToken = PubSub.subscribe(
    CREATE_MARKER,
    createMarkerSubscriber
  );
  const removeMarkSubToken = PubSub.subscribe(
    REMOVE_MARKER,
    removeMarkerSubscriber
  );

  // Return destroy function for UseEffect hook
  return () => {
    // On unload completely destroy the application and all of it's children
    app.destroy(true, true);
    PubSub.unsubscribe(createMarkerSubToken);
    PubSub.unsubscribe(removeMarkSubToken);
  };
}
